import db from "../config/db.js";

// Get all items with optional filters
async function getAllItems(filters = {}) {
  let query = `
    SELECT 
      i.*, 
      c.name AS category_name,
      d.name AS department_name,
      COUNT(u.id) AS unit_count
    FROM items i
    LEFT JOIN item_units u ON u.item_id = i.id
    LEFT JOIN item_categories c ON c.id = i.category_id
    LEFT JOIN departments d ON d.id = i.department_id
  `;

  const conditions = [];
  const values = [];

  if (filters.categoryId) {
    values.push(filters.categoryId);
    conditions.push(`i.category_id = $${values.length}`);
  }

  if (filters.departmentId) {
    values.push(filters.departmentId);
    conditions.push(`i.department_id = $${values.length}`);
  }
  
  if (filters.name) {
    values.push(filters.name);
    conditions.push(`i.name = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY i.id, c.name, d.name";

  const { rows } = await db.query(query, values);
  return rows;
}

// Get one item by ID
async function getItemByID(id) {
  const query = `
    SELECT 
      i.*, 
      c.name AS category_name,
      c.code AS category_code,
      d.name AS department_name,
      d.code AS department_code
    FROM items i
    LEFT JOIN item_categories c ON c.id = i.category_id
    LEFT JOIN departments d ON d.id = i.department_id
    WHERE i.id = $1
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
}

// Create a new item
async function createItem(data) {
  const { name, type, category_id, department_id, created_by, updated_by } =
    data;
  const { rows } = await db.query(
    `INSERT INTO items (name, type, category_id, department_id, created_by, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [name, type, category_id, department_id, created_by, updated_by]
  );
  return {
    id: rows[0].id,
    name,
    type,
    category_id,
    department_id,
    created_by,
    updated_by,
  };
}

// Update an item partially
async function updateItemPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE items SET ${setClause} WHERE id = $${
    keys.length + 1
  } RETURNING *`;

  const { rows } = await db.query(query, [...values, id]);
  return rows[0] || null;
}

// Delete one item
async function deleteItemByID(id) {
  const { rowCount } = await db.query("DELETE FROM items WHERE id = $1", [id]);
  return rowCount > 0;
}

// Delete multiple items
async function deleteItemsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM items WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

export {
  getAllItems,
  getItemByID,
  createItem,
  updateItemPartial,
  deleteItemByID,
  deleteItemsByIDs,
};
