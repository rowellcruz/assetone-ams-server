import * as requestModel from "../models/requestModel.js";

export async function createRequest(requestData) {
  return await requestModel.createRequest(requestData);
}
