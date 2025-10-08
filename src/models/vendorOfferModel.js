import db from "../config/db.js";

export async function addVendorOffers(vendorId, assetCategoryIds) {
  if (!Array.isArray(assetCategoryIds) || assetCategoryIds.length === 0) return [];

  const values = assetCategoryIds.map((id) => `(${vendorId}, ${id})`).join(", ");

  const query = `
    INSERT INTO vendor_offers (vendor_id, asset_category_id)
    VALUES ${values}
    RETURNING *;
  `;

  const { rows } = await db.query(query);
  return rows;
}
