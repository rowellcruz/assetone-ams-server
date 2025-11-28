import * as notificationService from "../services/notificationService.js";

export const receiveNotifications = async (req, res) => {
  const user = req.user;
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (user) filters.userId = user.id;

  const notification = await notificationService.receiveNotifications(filters);
  res.json(notification);
};

export const createNotificationWithReceivers = async (req, res) => {
  const { module, message, userIds } = req.body;
  if (!module || !message || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "Module, message, and at least one userId are required" });
  }

  const notification = await notificationService.createNotification(module, message);
  const receivers = await notificationService.addReceivers(notification.id, userIds);

  res.json({
    notification,
    receivers,
  });
};

export const addReceivers = async (req, res) => {
  const { id } = req.params;
  const { userIds } = req.body;

  if (!id || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "Invalid notification ID or user IDs" });
  }

  const data = await notificationService.addReceivers(id, userIds);
  res.json(data);
};

export const markReceiverSeen = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  if (!id || !user?.id) {
    return res.status(400).json({ message: "Notification ID and user ID are required" });
  }

  const data = await notificationService.markReceiverSeen(id, user.id);
  res.json(data);
};
