import db from "../config/db.js";

export async function getAllVendors(filters = {}) {
  let query = `SELECT * FROM vendors`;

  const conditions = [];
  const values = [];

  if (filters.name) {
    values.push(filters.name);
    conditions.push(`name = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

export async function getVendorByID(id) {
  const result = await db.query("SELECT * FROM vendors WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function createVendor(vendorData) {
  const {
    name,
    address,
    contact_person,
    contact_email,
    contact_phone,
    created_by,
    updated_by,
  } = vendorData;

  const result = await db.query(
    `INSERT INTO vendors 
       (name, address, contact_person, contact_email, contact_phone, created_by, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      name,
      address,
      contact_person,
      contact_email,
      contact_phone,
      created_by,
      updated_by,
    ]
  );

  return { id: result.rows[0].id, ...vendorData };
}

export async function deleteVendorsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;

  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const result = await db.query(
    `DELETE FROM vendors WHERE id IN (${placeholders})`,
    ids
  );

  return result.rowCount;
}

export async function updateFullVendor(id, vendorData) {
  const {
    name,
    description,
    address,
    contact_person,
    email_address,
    phone_number,
    updated_by,
  } = vendorData;

  const result = await db.query(
    `UPDATE vendors
     SET name = $1, description = $2, address = $3, contact_person = $4,
         email_address = $5, phone_number = $6, updated_by = $7
     WHERE id = $8`,
    [
      name,
      description,
      address,
      contact_person,
      email_address,
      phone_number,
      updated_by,
      id,
    ]
  );

  return result.rowCount > 0 ? { id, ...vendorData } : null;
}

export async function updateVendorPartial(id, fields) {
  const keys = Object.keys(fields);

  if (keys.length > 0) {
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const values = keys.map((key) => fields[key]);
    values.push(id);

    await db.query(
      `UPDATE vendors SET ${updates} WHERE id = $${values.length}`,
      values
    );
  }

  return { id, ...fields };
}

export async function deleteVendorByID(id) {
  const result = await db.query("DELETE FROM vendors WHERE id = $1", [id]);
  return result.rowCount > 0;
}
