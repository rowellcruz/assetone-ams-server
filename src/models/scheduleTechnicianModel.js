const db = require("../config/db");

async function getScheduleTechniciansByOccurenceId(occurrenceId) {
  const [rows] = await db.execute(`
    SELECT st.user_id, u.id, u.first_name, u.last_name
    FROM schedule_technicians AS st
    JOIN users AS u ON st.user_id = u.id
    WHERE st.schedule_occurrence_id = ?
  `, [occurrenceId]);
  
  return rows;
}

module.exports = {
  getScheduleTechniciansByOccurenceId,
}