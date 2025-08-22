import db from '../config/db.js';

async function getAllLocations() {
  const { rows: locations } = await db.query('SELECT * FROM locations');

  for (const loc of locations) {
    const { rows: subs } = await db.query('SELECT * FROM sub_locations WHERE location_id = $1', [loc.id]);
    loc.sublocations = subs;
  }

  return locations;
}

async function getLocationByID(id) {
  const { rows: locations } = await db.query('SELECT * FROM locations WHERE id = $1', [id]);
  const location = locations[0];
  if (!location) return null;

  const { rows: subs } = await db.query('SELECT * FROM sub_locations WHERE location_id = $1', [id]);
  location.sublocations = subs;

  return location;
}

async function createLocation(locationData) {
  const { name, created_by, updated_by, sublocations = [] } = locationData;
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      "INSERT INTO locations (name, created_by, updated_by) VALUES ($1, $2, $3) RETURNING id",
      [name, created_by, updated_by]
    );

    const locationId = rows[0].id;

    for (const sub of sublocations) {
      await client.query(
        "INSERT INTO sub_locations (location_id, name, created_by, updated_by) VALUES ($1, $2, $3, $4)",
        [locationId, sub, created_by, updated_by]
      );
    }

    await client.query('COMMIT');
    return { id: locationId, name, sublocations };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function deleteLocationsByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM sub_locations WHERE location_id IN (${placeholders})`, ids);
    await client.query(`DELETE FROM locations WHERE id IN (${placeholders})`, ids);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateFullLocation(id, locationData) {
  const { name, updated_by, sublocations } = locationData;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const { rowCount } = await client.query(
      "UPDATE locations SET name = $1, updated_by = $2 WHERE id = $3",
      [name, updated_by, id]
    );

    if (sublocations) {
      await client.query("DELETE FROM sub_locations WHERE location_id = $1", [id]);

      for (const sub of sublocations) {
        await client.query(
          "INSERT INTO sub_locations (location_id, name, created_by, updated_by) VALUES ($1, $2, $3, $4)",
          [id, sub, updated_by, updated_by]
        );
      }
    }

    await client.query('COMMIT');
    return rowCount > 0 ? { id, name, sublocations } : null;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function updateLocationPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);

  const { rowCount } = await db.query(`UPDATE locations SET ${setClause} WHERE id = $${keys.length + 1}`, [
    ...values,
    id,
  ]);

  return rowCount > 0 ? { id, ...fields } : null;
}

async function deleteLocationByID(id) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query("DELETE FROM sub_locations WHERE location_id = $1", [id]);
    const { rowCount } = await client.query("DELETE FROM locations WHERE id = $1", [id]);
    await client.query('COMMIT');
    return rowCount > 0;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export {
  getAllLocations,
  getLocationByID,
  createLocation,
  deleteLocationsByIDs,
  updateFullLocation,
  updateLocationPartial,
  deleteLocationByID,
};
