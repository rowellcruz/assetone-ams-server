import * as borrowLogService from "../services/borrowLogService.js";

export const getBorrowLogs = async (req, res) => {
  
  const user = req.user;
  const filters = {};
  if (req.query.logId) filters.logId = req.query.logId;
  if (req.query.custodianId) filters.custodianId = req.query.custodianId;
  if (req.query.status) filters.status = req.query.status;
  if (user.department_id === null || user.department_id === undefined)
    filters.custodianId = null;
  if (user.department_id) filters.custodianId = user.department_id;

  const log = await borrowLogService.getBorrowLog(filters);
  res.status(201).json(log);
};

export const getBorrowLogById = async (req, res) => {
  const { id } = req.params;
  const log = await borrowLogService.getBorrowLogById(id);
  res.status(201).json(log);
};

export const getBorrowLogByItemUnitId = async (req, res) => {
  const { id } = req.params;
  const log = await borrowLogService.getBorrowLogByItemUnitId(id);
  res.status(201).json(log);
};

export const getItemUnitLastBorrowLog = async (req, res) => {
  const { id } = req.params;
  const log = await borrowLogService.getItemUnitLastBorrowLog(id);
  res.status(201).json(log);
};

export const logBorrow = async (req, res) => {
  const { item_unit_id, borrowed_by, purpose, due_date } = req.body;
  const user = req.user;
  const log = await borrowLogService.logBorrow(
    item_unit_id,
    borrowed_by,
    user.id,
    purpose,
    due_date
  );
  res.status(201).json(log);
};

export const logReturn = async (req, res) => {
  const { id } = req.params;
  const { remarks } = req.params;
  const log = await borrowLogService.logReturn(id, remarks);
  res.status(201).json(log);
};
