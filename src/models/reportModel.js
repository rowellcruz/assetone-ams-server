import db from "../config/db.js";

// 1. Items
export const getItems = async (filters = {}) => {
  const values = [];
  let query = `
    SELECT 
        i.name AS "Item",
        COUNT(iu.id) AS "Unit Count"
    FROM items i
    LEFT JOIN item_units iu ON iu.item_id = i.id
  `;

  if (filters.status && filters.status !== "*") {
    values.push(filters.status);
    query += ` AND iu.status = $${values.length}`;
  }

  query += `
    LEFT JOIN users u_created ON i.created_by = u_created.id
  `;

  const where = [];
  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    where.push(
      `i.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (where.length) query += ` WHERE ${where.join(" AND ")}`;

  query += `
    GROUP BY i.id, i.name
    ORDER BY i.created_at DESC
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

// 2. Item Units
export const getItemUnits = async (filters = {}, limit = 50) => {
  let query = `
    SELECT 
      iu.unit_tag AS "Unit Tag",
      iu.status AS "Status",
      iu.purchase_date AS "Purchase Date",
      d.name AS "Issued Department"
    FROM item_units iu
    LEFT JOIN departments d ON iu.owner_department_id = d.id
  `;

  const conditions = [];
  const values = [];

  if (filters.itemId) {
    values.push(filters.itemId);
    conditions.push(`iu.item_id = $${values.length}`);
  }

  if (filters.status && filters.status !== "*") {
    values.push(filters.status);
    conditions.push(`iu.status = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `iu.purchase_date BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY iu.purchase_date DESC";
  query += ` LIMIT ${limit}`;

  const { rows } = await db.query(query, values);
  return rows;
};

// 3. Maintenance Schedules
export const getMaintenanceSchedules = async (filters = {}) => {
  let query = `
    SELECT 
      st.description AS "Title",
      so.scheduled_date AS "Scheduled Date",
      so.status,
      so.completed_at AS "Completion Date"
    FROM schedule_occurrences so
    LEFT JOIN schedule_templates st ON so.template_id = st.id
  `;

  const conditions = [];
  const values = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`so.status = $${values.length}`);
  }

  if (filters.departmentId) {
    values.push(filters.departmentId);
    conditions.push(`st.department_id = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `so.scheduled_date BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY so.scheduled_date ASC";

  const { rows } = await db.query(query, values);
  return rows;
};

// 4. Procurement
export const getProcurements = async (filters = {}) => {
  let query = `
    SELECT 
      pt.id AS "Task Id",
      i.name AS "Item",
      v.name AS "Vendor",
      pt.created_at AS "Task Start",
      pt.status AS "Status",
      pf.finalized_at AS "Task End"
    FROM procurement_tasks pt
    LEFT JOIN procurement_finalizations pf ON pf.task_id = pt.id
    LEFT JOIN items i ON pt.item_id = i.id
    LEFT JOIN vendors v ON pf.final_vendor_id = v.id
  `;

  const conditions = [];
  const values = [];

  if (filters.vendorId) {
    values.push(filters.vendorId);
    conditions.push(`pt.vendor_id = $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`pt.status = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `pt.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY pt.created_at DESC";

  const { rows } = await db.query(query, values);
  return rows;
};

// 5. Purchase Requests
export const getPurchaseRequests = async (filters = {}) => {
  let query = `
    SELECT 
      i.name AS "Item",
      d.name AS "Department",
      CONCAT(u.first_name, ' ', u.last_name) AS "Requested By",
      pr.requested_quantity AS "Requested Quantity",
      r.status,
      pr.created_at
    FROM purchase_requests pr
    LEFT JOIN items i ON pr.item_id = i.id
    LEFT JOIN users u ON pr.requested_by = u.id
    LEFT JOIN departments d ON pr.department_id = d.id
    LEFT JOIN requests r ON pr.request_id = r.id
  `;

  const conditions = [];
  const values = [];

  if (filters.departmentId) {
    values.push(filters.departmentId);
    conditions.push(`pr.department_id = $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`r.status = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `pr.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY pr.created_at DESC";

  const { rows } = await db.query(query, values);
  return rows;
};

// 6. Users
export const getUsers = async (filters = {}) => {
  let query = `
    SELECT 
      CONCAT(u.first_name, ' ', u.last_name) AS name,
      u.role,
      d.name AS "Department Name",
      u.created_at
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
  `;

  const conditions = [];
  const values = [];

  if (filters.role) {
    values.push(filters.role);
    conditions.push(`u.role = $${values.length}`);
  }

  if (filters.departmentId) {
    values.push(filters.departmentId);
    conditions.push(`u.department_id = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `u.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY u.first_name, u.last_name";

  const { rows } = await db.query(query, values);
  return rows;
};

// 7. Activity Logs
export const getActivityLogs = async (filters = {}) => {
  let query = `SELECT * FROM activity_log`;
  const conditions = [];
  const values = [];

  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`user_id = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC";

  const { rows } = await db.query(query, values);
  return rows;
};

// 8. Departments
export const getDepartments = async (filters = {}) => {
  let query = `
    SELECT 
      d.name AS "Department Name",
      COALESCE(
        STRING_AGG(CONCAT(u.first_name, ' ', u.last_name), ', ' ORDER BY u.first_name),
        'No Assigned Custodian'
      ) AS "Property Custodians"
    FROM departments d
    LEFT JOIN users u 
      ON u.department_id = d.id 
      AND u.role = 'property_custodian'
  `;

  const conditions = [];
  const values = [];

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `d.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  query += `
    GROUP BY d.id, d.name, d.created_at
    ORDER BY d.created_at DESC
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

// 9. Locations
export const getLocations = async (filters = {}) => {
  let query = `
    SELECT 
      l.name AS "Location",
      sl.name AS "Area",
      COUNT(iu.id) AS "Unit Count"
    FROM sub_locations sl
    LEFT JOIN locations l ON sl.location_id = l.id
    LEFT JOIN item_units iu ON iu.sub_location_id = sl.id
  `;

  const conditions = [];
  const values = [];

  if (filters.locationId) {
    values.push(filters.locationId);
    conditions.push(`sl.location_id = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `sl.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  query += `
    GROUP BY sl.id, sl.name, l.name, sl.created_at
    ORDER BY sl.created_at DESC
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

// 10. Vendors
export const getVendors = async (filters = {}) => {
  let query = `
    SELECT 
      v.name AS "Vendor Name",
      v.contact_person AS "Contact Person",
      v.contact_phone AS "Phone",
      v.contact_email AS "Email"
    FROM vendors v
  `;

  const conditions = [];
  const values = [];

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `v.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    conditions.push(`v.name ILIKE $${values.length}`);
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY v.created_at DESC";

  const { rows } = await db.query(query, values);
  return rows;
};

export const getDepartmentAssetsReportData = async (filters = {}) => {
  let query = `
    SELECT
      iu.unit_tag AS "Unit Tag",
      i.name AS "Item Name",
      iu.status AS "Status",
      iu.purchase_date AS "Purchase Date"
    FROM item_units iu
    LEFT JOIN items i ON iu.item_id = i.id
  `;

  const conditions = [];
  const values = [];

  if (filters.departmentId !== undefined) {
    if ([null, "null", 0, "0"].includes(filters.departmentId)) {
      conditions.push(`iu.owner_department_id IS NULL`);
    } else {
      conditions.push(`iu.owner_department_id = $${values.length + 1}`);
      values.push(filters.departmentId);
    }
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `iu.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY iu.created_at DESC";

  const { rows } = await db.query(query, values);
  return rows;
};
