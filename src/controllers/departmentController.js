import * as departmentService from "../services/departmentService.js";
import * as requestService from "../services/requestService.js";

export const getDepartments = async (req, res) => {
  const filters = {
    departmentId: req.query.departmentId,
  };

  const departments = await departmentService.getAllDepartments(filters);
  res.json(departments);
};

export const getAvailableTechnicians = async (req, res) => {
  const {id} = req.params;
  const departments = await departmentService.getAvailableTechnicians(id);
  res.json(departments);
};

export const getDepartmentByID = async (req, res) => {
  const { id } = req.params;
  const department = await departmentService.getDepartmentByID(id);
  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json(department);
};

export const getPurchaseRequests = async (req, res) => {
  const { id } = req.params;
  const department = await requestService.getPurchaseRequestsById(id);
  res.json(department);
};

export const createDepartment = async (req, res) => {
  const createdDepartment = await departmentService.createDepartment(req.body);
  res.status(201).json(createdDepartment);
};

export const createPurchaseRequest = async (req, res) => {
  const { departmentId } = req.params;
  const requestData = { ...req.body, department_id: departmentId };

  const createdPurchaseRequest =
    await requestService.createRequest(requestData);

  res.status(201).json(createdPurchaseRequest);
};


export const deleteDepartmentsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await departmentService.deleteDepartmentsByIDs(ids);
  res.json({ message: "Departments deleted successfully" });
};

export const replaceDepartment = async (req, res) => {
  const { id } = req.params;
  const updatedDepartment = await departmentService.updateFullDepartment(
    id,
    req.body
  );
  if (!updatedDepartment) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json(updatedDepartment);
};

export const distributeUnits = async (req, res) => {
  const { id } = req.params;
  const updated = await departmentService.distributeUnits(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Unit not found");
  }
  res.json(updated);
};

export const updateDepartmentPartial = async (req, res) => {
  const { id } = req.params;
  const updatedDepartment = await departmentService.updateDepartmentPartial(
    id,
    req.body
  );
  if (!updatedDepartment) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json(updatedDepartment);
};

export const deleteDepartmentByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await departmentService.deleteDepartmentByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json({ message: "Department deleted successfully" });
};
