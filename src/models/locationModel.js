const db = require('../config/db');

async function getAllLocations() {
  const [locations] = await db.query('SELECT * FROM locations');

  for (const loc of locations) {
    const [subs] = await db.query('SELECT * FROM sub_locations WHERE location_id = ?', [loc.id]);
    loc.sublocations = subs;
  }

  return locations;
}

async function getLocationByID(id) {
  const [locations] = await db.query('SELECT * FROM locations WHERE id = ?', [id]);
  const location = locations[0];
  if (!location) return null;

  const [subs] = await db.query('SELECT * FROM sub_locations WHERE location_id = ?', [id]);
  location.sublocations = subs;

  return location;
}

async function createLocation(locationData) {
  const { name, created_by, updated_by, sublocations = [] } = locationData;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO locations (name, created_by, updated_by) VALUES (?, ?, ?)",
      [name, created_by, updated_by]
    );

    const locationId = result.insertId;

    for (const sub of sublocations) {
      await conn.query(
        "INSERT INTO sub_locations (location_id, name, created_by, updated_by) VALUES (?, ?, ?, ?)",
        [locationId, sub, created_by, updated_by]
      );
    }

    await conn.commit();
    return { id: locationId, name, sublocations };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function deleteLocationsByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => "?").join(", ");

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Delete sub_locations first
    await conn.query(`DELETE FROM sub_locations WHERE location_id IN (${placeholders})`, ids);

    // Then delete main locations
    await conn.query(`DELETE FROM locations WHERE id IN (${placeholders})`, ids);

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateFullLocation(id, locationData) {
  const { name, updated_by, sublocations } = locationData;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "UPDATE locations SET name = ?, updated_by = ? WHERE id = ?",
      [name, updated_by, id]
    );

    if (sublocations) {
      await conn.query("DELETE FROM sub_locations WHERE location_id = ?", [id]);

      for (const sub of sublocations) {
        await conn.query(
          "INSERT INTO sub_locations (location_id, name, created_by, updated_by) VALUES (?, ?, ?, ?)",
          [id, sub, updated_by, updated_by]
        );
      }
    }

    await conn.commit();
    return result.affectedRows > 0 ? { id, name, sublocations } : null;

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function updateLocationPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const [result] = await db.query(`UPDATE locations SET ${updates} WHERE id = ?`, [
    ...values,
    id,
  ]);
  return result.affectedRows > 0 ? { id, ...fields } : null;
}

async function deleteLocationByID(id) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query("DELETE FROM sub_locations WHERE location_id = ?", [id]);
    const [result] = await conn.query("DELETE FROM locations WHERE id = ?", [id]);
    await conn.commit();
    return result.affectedRows > 0;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  getAllLocations,
  getLocationByID,
  createLocation,
  deleteLocationsByIDs,
  updateFullLocation,
  updateLocationPartial,
  deleteLocationByID,
};
