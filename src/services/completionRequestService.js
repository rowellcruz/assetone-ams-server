import * as completionRequestModel from "../models/completionRequestModel.js";

export async function getAllCompletionRequests(filters = {}) {
  return await completionRequestModel.getAllCompletionRequests(filters);
}
