const completionRequestModel = require("../models/completionRequestModel");

async function getAllCompletionRequests(filters = {}) {
  return await completionRequestModel.getAllCompletionRequests(filters);
}

module.exports = {
  getAllCompletionRequests,
};
