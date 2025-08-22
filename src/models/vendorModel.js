import db from '../config/db.js';

export async function getAllVendors(filters = {}) {
  const [rows] = await db.query('SELECT * FROM vendors');
  return rows;
}

export async function getVendorByID(id) {
  const [rows] = await db.query('SELECT * FROM vendors WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function createVendor(vendorData) {
  const { name, description, address, contact_person, email_address, phone_number, created_by, updated_by } = vendorData;
  const [result] = await db.query(
    `INSERT INTO vendors (name, description, address, contact_person, email_address, phone_number, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, address, contact_person, email_address, phone_number, created_by, updated_by]
  );
  return { id: result.insertId, ...vendorData };
}

export async function deleteVendorsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map(() => '?').join(', ');
  const [result] = await db.query(`DELETE FROM vendors WHERE id IN (${placeholders})`, ids);
  return result.affectedRows;
}

export async function updateFullVendor(id, vendorData) {
  const { name, description, address, contact_person, email_address, phone_number, updated_by } = vendorData;
  const [result] = await db.query(
    `UPDATE vendors SET name = ?, description = ?, address = ?, contact_person = ?, email_address = ?, phone_number = ?, updated_by = ? WHERE id = ?`,
    [name, description, address, contact_person, email_address, phone_number, updated_by, id]
  );
  return result.affectedRows > 0 ? { id, ...vendorData } : null;
}

export async function updateVendorPartial(id, fields) {
  const offerIds = fields.offers;
  delete fields.offers;

  const keys = Object.keys(fields);
  if (keys.length > 0) {
    const updates = keys.map((key) => `${key} = ?`).join(', ');
    const values = keys.map((key) => fields[key]);
    await db.query(`UPDATE vendors SET ${updates} WHERE id = ?`, [...values, id]);
  }

  if (Array.isArray(offerIds)) {
    await db.query(`DELETE FROM vendor_offers WHERE vendor_id = ?`, [id]);
    if (offerIds.length > 0) {
      const values = offerIds.map(catId => [id, catId]);
      await db.query(`INSERT INTO vendor_offers (vendor_id, asset_category_id) VALUES ?`, [values]);
    }
  }

  return { id, ...fields, ...(offerIds ? { offers: offerIds } : {}) };
}

export async function deleteVendorByID(id) {
  const [result] = await db.query('DELETE FROM vendors WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

export async function clearVendorOffers(vendorId) {
  await db.query('DELETE FROM vendor_offers WHERE vendor_id = ?', [vendorId]);
}

export async function insertVendorOffers(vendorId, categoryIds) {
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) return;
  const values = categoryIds.map(catId => [vendorId, catId]);
  await db.query('INSERT INTO vendor_offers (vendor_id, asset_category_id) VALUES ?', [values]);
}

export async function getVendorOffers(vendorId) {
  const [rows] = await db.query(
    `SELECT ac.id AS id, ac.name AS name
     FROM vendor_offers vo
     JOIN asset_categories ac ON vo.asset_category_id = ac.id
     WHERE vo.vendor_id = ?`,
    [vendorId]
  );
  return rows;
}

export async function getAllVendorOffersMap() {
  const [rows] = await db.query(
    `SELECT vo.vendor_id, ac.id AS category_id, ac.name AS category_name
     FROM vendor_offers vo
     JOIN asset_categories ac ON vo.asset_category_id = ac.id`
  );
  const offersMap = {};
  for (const row of rows) {
    if (!offersMap[row.vendor_id]) offersMap[row.vendor_id] = [];
    offersMap[row.vendor_id].push({ id: row.category_id, name: row.category_name });
  }
  return offersMap;
}
