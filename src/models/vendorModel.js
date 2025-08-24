import db from '../config/db.js';

export async function getAllVendors(filters = {}) {
  const result = await db.query('SELECT * FROM vendors');
  return result.rows;
}

export async function getVendorByID(id) {
  const result = await db.query('SELECT * FROM vendors WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createVendor(vendorData) {
  const {
    name,
    description,
    address,
    contact_person,
    email_address,
    phone_number,
    created_by,
    updated_by,
  } = vendorData;

  const result = await db.query(
    `INSERT INTO vendors 
       (name, description, address, contact_person, email_address, phone_number, created_by, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [name, description, address, contact_person, email_address, phone_number, created_by, updated_by]
  );

  return { id: result.rows[0].id, ...vendorData };
}

export async function deleteVendorsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
  const result = await db.query(`DELETE FROM vendors WHERE id IN (${placeholders})`, ids);
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
    [name, description, address, contact_person, email_address, phone_number, updated_by, id]
  );

  return result.rowCount > 0 ? { id, ...vendorData } : null;
}

export async function updateVendorPartial(id, fields) {
  const offerIds = fields.offers;
  delete fields.offers;

  const keys = Object.keys(fields);

  if (keys.length > 0) {
    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map((key) => fields[key]);
    values.push(id);

    await db.query(`UPDATE vendors SET ${updates} WHERE id = $${values.length}`, values);
  }

  if (Array.isArray(offerIds)) {
    await db.query(`DELETE FROM vendor_offers WHERE vendor_id = $1`, [id]);

    if (offerIds.length > 0) {
      const values = [];
      const placeholders = offerIds
        .map((catId, i) => {
          values.push(id, catId);
          return `($${values.length - 1}, $${values.length})`;
        })
        .join(', ');

      await db.query(`INSERT INTO vendor_offers (vendor_id, asset_id) VALUES ${placeholders}`, values);
    }
  }

  return { id, ...fields, ...(offerIds ? { offers: offerIds } : {}) };
}

export async function deleteVendorByID(id) {
  const result = await db.query('DELETE FROM vendors WHERE id = $1', [id]);
  return result.rowCount > 0;
}

export async function clearVendorOffers(vendorId) {
  await db.query('DELETE FROM vendor_offers WHERE vendor_id = $1', [vendorId]);
}

export async function insertVendorOffers(vendorId, assetIds) {
  if (!Array.isArray(assetIds) || assetIds.length === 0) return;

  const values = [];
  const placeholders = assetIds
    .map((assetId, i) => {
      values.push(vendorId, assetId);
      return `($${values.length - 1}, $${values.length})`;
    })
    .join(', ');

  await db.query(`INSERT INTO vendor_offers (vendor_id, asset_id) VALUES ${placeholders}`, values);
}

export async function getVendorOffers(vendorId) {
  const result = await db.query(
    `SELECT ac.id AS id, ac.type AS type
     FROM vendor_offers vo
     JOIN assets ac ON vo.asset_id = ac.id
     WHERE vo.vendor_id = $1`,
    [vendorId]
  );
  return result.rows;
}

export async function getAllVendorOffersMap() {
  const result = await db.query(
    `SELECT vo.vendor_id, ac.id AS asset_id, ac.type AS asset_name
     FROM vendor_offers vo
     JOIN assets ac ON vo.asset_id = ac.id`
  );

  const offersMap = {};
  for (const row of result.rows) {
    if (!offersMap[row.vendor_id]) offersMap[row.vendor_id] = [];
    offersMap[row.vendor_id].push({ id: row.asset_id, name: row.asset_name });
  }
  return offersMap;
}
