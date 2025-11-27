import * as notificationModel from "../models/notificationModel.js";

export async function receiveNotifications(filters ={}) {
  return notificationModel.getNotifications(filters);
}

export async function createNotification(module, message) {
  return notificationModel.createNotification(module, message);
}

export async function addReceivers(notificationId, userIds = []) {
  return notificationModel.createReceivers(notificationId, userIds);
}

export async function markReceiverSeen(notificationId, userId) {
  return notificationModel.updateNotificationReceiver(notificationId, userId);
}
