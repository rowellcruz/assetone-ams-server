import db from "../config/db.js";

async function getAllSubLocations(filters = {}) {
  let query = "SELECT * FROM sub_locations";
  const conditions = [];
  const values = [];

  if (filters.locationId) {
    conditions.push(`location_id = $${values.length + 1}`);
    values.push(filters.locationId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getSubLocationByID(id) {
  const { rows } = await db.query("SELECT * FROM sub_locations WHERE id = $1", [id]);
  return rows[0] || null;
}

async function createSubLocation(data) {
  const { name, location_id } = data;
  const { rows } = await db.query(
    "INSERT INTO sub_locations (name, location_id) VALUES ($1, $2) RETURNING id",
    [name, location_id]
  );
  return { id: rows[0].id, name, location_id };
}

async function updateSubLocationPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE sub_locations SET ${setClause} WHERE id = $${keys.length + 1}`;

  await db.query(query, [...values, id]);
  return getSubLocationByID(id);
}

async function deleteSubLocationByID(id) {
  const { rowCount } = await db.query("DELETE FROM sub_locations WHERE id = $1", [id]);
  return rowCount > 0;
}

async function deleteSubLocationsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM sub_locations WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

export {
  getAllSubLocations,
  getSubLocationByID,
  createSubLocation,
  updateSubLocationPartial,
  deleteSubLocationByID,
  deleteSubLocationsByIDs,
};
