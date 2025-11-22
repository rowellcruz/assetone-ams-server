import * as pendingRegistrationModel from "../models/pendingRegistrationModel.js";

export async function getPendingRegistrations() {
  return await pendingRegistrationModel.getAllPending();
}