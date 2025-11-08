import * as borrowLogService from "../services/borrowLogService.js";

export const getBorrowLogs = async (req, res) => {
  const filters = {};
  if (req.query.custodianId) filters.custodianId = req.query.custodianId;
  const log = await borrowLogService.getBorrowLog(filters);
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
  const { item_unit_id, remarks } = req.body;
  const log = await borrowLogService.logReturn(item_unit_id, remarks);
  res.status(201).json(log);
};
