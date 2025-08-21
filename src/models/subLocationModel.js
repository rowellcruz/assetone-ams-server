const db = require("../config/db");

async function getAllSubLocations(filters = {}) {
  let query = "SELECT * FROM sub_locations";
  const conditions = [];
  const values = [];

  if (filters.locationId) {
    conditions.push("location_id = ?");
    values.push(filters.locationId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.execute(query, values);
  return rows;
}

async function getSubLocationByID(id) {
  const [rows] = await db.execute("SELECT * FROM sub_locations WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createSubLocation(data) {
  const { name, location_id } = data;
  const [result] = await db.execute(
    "INSERT INTO sub_locations (name, location_id) VALUES (?, ?)",
    [name, location_id]
  );
  return { id: result.insertId, name, location_id };
}

async function updateSubLocationPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE sub_locations SET ${setClause} WHERE id = ?`;

  await db.execute(query, [...values, id]);
  return getSubLocationByID(id);
}

async function deleteSubLocationByID(id) {
  const [result] = await db.execute("DELETE FROM sub_locations WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

async function deleteSubLocationsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map(() => "?").join(", ");
  const [result] = await db.execute(`DELETE FROM sub_locations WHERE id IN (${placeholders})`, ids);
  return result.affectedRows;
}

module.exports = {
  getAllSubLocations,
  getSubLocationByID,
  createSubLocation,
  updateSubLocationPartial,
  deleteSubLocationByID,
  deleteSubLocationsByIDs,
};
