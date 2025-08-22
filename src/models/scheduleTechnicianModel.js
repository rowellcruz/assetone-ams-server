import db from "../config/db.js";

async function getScheduleTechniciansByOccurrenceId(occurrenceId) {
  const { rows } = await db.query(`
    SELECT st.user_id, u.id, u.first_name, u.last_name
    FROM schedule_technicians AS st
    JOIN users AS u ON st.user_id = u.id
    WHERE st.schedule_occurrence_id = $1
  `, [occurrenceId]);
  
  return rows;
}

export { getScheduleTechniciansByOccurrenceId };
