import db from "../config/db.js";

async function getNotifications(filters = {}) {
  let query = `
    SELECT 
      n.*, nr.user_id, nr.seen_at
    FROM notifications n
    LEFT JOIN notification_receivers nr ON nr.notification_id = n.id
  `;

  
  const conditions = [];
  const values = [];

  if (filters.userId) {
    conditions.push(`nr.user_id = $${values.length + 1}`);
    values.push(filters.userId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows || [];
}

async function createNotification(module, message) {
  const { rows } = await db.query(
    `INSERT INTO notifications 
     (module, message) 
     VALUES ($1, $2) 
     RETURNING *`,
    [module, message]
  );

  return rows[0];
}

async function createReceivers(notification_id, userIds) {
  const receivers = await Promise.all(
    userIds.map(userId =>
      db.query(
        `INSERT INTO notification_receivers (notification_id, user_id) 
         VALUES ($1, $2) 
         RETURNING *`,
        [notification_id, userId]
      ).then(res => res.rows[0])
    )
  );
  return receivers;
}

async function updateNotificationReceiver(notification_id, user_id) {
  const { rows } = await db.query(
    `UPDATE notification_receivers 
     SET seen_at = now()
     WHERE notification_id = $1 AND user_id = $2
     RETURNING *`,
    [notification_id, user_id]
  );

  return rows[0];
}

export {
    getNotifications,
    createNotification,
    createReceivers,
    updateNotificationReceiver
}
