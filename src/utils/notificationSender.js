import * as notificationService from "../services/notificationService.js";
import * as mailer from "../utils/mailer.js";
import * as userModel from "../models/userModel.js";

export async function sendNotification(module, message, userIds) {
  const notification = await notificationService.createNotification(
    module,
    message
  );

  const receivers = await notificationService.addReceivers(
    notification.id,
    userIds
  );

  for (const userId of userIds) {
    const user = await userModel.getUserDataById(userId);

    await mailer.sendUnitTransferMessage(user.email, user.firstName);
  }
  
  return {
    notification,
    receivers,
  };
}
