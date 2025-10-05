import db from "../config/db.js";

// 1. Assets
export const getAssets = async (filters = {}) => {
  let query = `
    SELECT 
        a.type AS "Asset Type",
        COUNT(au.id) AS "Asset Unit Count",
        CONCAT(u_created.first_name, ' ', u_created.last_name) AS "Created By",
        a.created_at AS "Created At"
    FROM assets a
    LEFT JOIN asset_units au ON au.asset_id = a.id
    LEFT JOIN users u_created ON a.created_by = u_created.id
  `;

  const conditions = [];
  const values = [];

  if (filters.departmentId) {
    values.push(filters.departmentId);
    conditions.push(`a.department_id = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(
      `a.created_at BETWEEN $${values.length - 1} AND $${values.length}`
    );
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  query += `
    GROUP BY a.id, a.type, u_created.first_name, u_created.last_name, a.created_at
    ORDER BY a.type
  `;

  const { rows } = await db.query(query, values);
  return rows;
};

// 2. Asset Units
export const getAssetUnits = async (filters = {}, limit = 50) => {
  let query = `
    SELECT 
      unit_tag,
      serial_number,
      brand,
      condition,
      operational_status,
      acquisition_date,
      department_id
    FROM asset_units
  `;

  const conditions = [];
  const values = [];

  if (filters.assetId) {
    values.push(filters.assetId);
    conditions.push(`asset_id = $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`operational_status = $${values.length}`);
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  query += " ORDER BY condition DESC, acquisition_date ASC";
  query += ` LIMIT ${limit}`;

  const { rows } = await db.query(query, values);
  return rows;
};

// 3. Maintenance Schedules
export const getMaintenanceSchedules = async (filters = {}) => {
  let query = `
    SELECT 
      st.title AS "Title",
      so.scheduled_date as "Scheduled Date",
      so.status,
      so.completed_at as "Completion Date"
    FROM schedule_occurrences so
    LEFT JOIN schedule_templates st ON so.template_id = st.id
  `;

  const conditions = [];
  const values = [];

  if (filters.departmentId) {
    values.push(filters.departmentId);
    conditions.push(`st.department_id = $${values.length}`);
  }

  if (filters.from && filters.to) {
    values.push(filters.from, filters.to);
    conditions.push(`so.scheduled_date BETWEEN $${values.length - 1} AND $${values.length}`);
  }

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  query += " ORDER BY so.scheduled_date ASC";

  const { rows } = await db.query(query, values);
  return rows;
};

// 4. Procurement Process
export const getProcurements = async (filters = {}) => {
  let query = `
    SELECT 
      pt.id AS "Task Id",
      a.type AS "Asset",
      v.name AS "Vendor",
      pt.created_at AS "Task Start",
      pt.status AS "Status",
      pf.finalized_at AS "Task End"
    FROM procurement_tasks pt
    LEFT JOIN procurement_finalizations pf ON pf.task_id = pt.id
    LEFT JOIN assets a ON pt.asset_id = a.id
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
    conditions.push(`pf.status = $${values.length}`);
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
      a.type AS "Asset Type",
      d.name AS "Department",
      CONCAT(u.first_name, ' ', u.last_name) AS "Requested By",
      pr.requested_quantity AS "Requested Quantity",
      r.status
    FROM purchase_requests pr
    LEFT JOIN assets a ON pr.asset_id = a.id
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

  if (conditions.length) query += " WHERE " + conditions.join(" AND ");

  query += " ORDER BY pr.created_at DESC";

  const { rows } = await db.query(query, values);
  return rows;
};

export const getUsers = async (filters = {}) => {
  let query = `
    SELECT 
      CONCAT(u.first_name, ' ', u.last_name) AS name,
      u.role,
      d.name AS "Department Name"
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

  const { rows } = await db.query(query, values);
  return rows;
};

export const getDepartments = async () => {
  const query = `
    SELECT 
        d.name AS "Department Name",
        COALESCE(au.asset_unit_count, 0) AS "Asset Unit Count",
        COALESCE(pc.property_custodians, '') AS "Property Custodian(s)"
    FROM departments d
    LEFT JOIN (
        SELECT department_id, COUNT(*) AS asset_unit_count
        FROM asset_units
        GROUP BY department_id
    ) au ON au.department_id = d.id
    LEFT JOIN (
        SELECT department_id, STRING_AGG(CONCAT(first_name, ' ', last_name), ', ') AS property_custodians
        FROM users
        WHERE role = 'property_custodian'
        GROUP BY department_id
    ) pc ON pc.department_id = d.id
    ORDER BY d.name;
  `;

  const { rows } = await db.query(query);
  return rows;
};


// 9. Locations
export const getLocations = async () => {
  const query = `
    SELECT 
      CONCAT(l.name, ' - ', sl.name) AS "Location",
      COUNT(au.id) AS "Asset Unit Count",
      CONCAT(u.first_name, ' ', u.last_name) AS "Created By"
    FROM sub_locations sl
    JOIN locations l ON sl.location_id = l.id
    LEFT JOIN users u ON sl.created_by = u.id
    LEFT JOIN asset_units au ON au.sub_location_id = sl.id
    GROUP BY l.name, sl.name, u.first_name, u.last_name
    ORDER BY l.name, sl.name
  `;

  const { rows } = await db.query(query);
  return rows;
};


// 10. Vendors
export const getVendors = async () => {
  const { rows } = await db.query("SELECT FROM vendors");
  return rows;
};
