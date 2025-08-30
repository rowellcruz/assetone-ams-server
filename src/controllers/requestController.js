import * as requestService from "../services/requestService.js";

export const createRequest = async (req, res) => {
  const createdRequest = await requestService.createRequest(req.body);
  res.status(201).json(createdRequest);
};
