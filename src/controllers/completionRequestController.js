import * as completionRequestService from "../services/completionRequestService.js";

export const getCompletionRequests = async (req, res) => {
  const filters = {
    status: req.query.status,
  };

  const completionRequests = await completionRequestService.getAllCompletionRequests(filters);
  res.json(completionRequests);
};
