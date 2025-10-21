import db from "../config/db.js";

async function getScheduleTechniciansByOccurrenceId(occurrenceId) {
  const { rows } = await db.query(
    `
    SELECT st.user_id, u.id, u.first_name, u.last_name
    FROM schedule_technicians AS st
    JOIN users AS u ON st.user_id = u.id
    WHERE st.occurrence_id = $1
  `,
    [occurrenceId]
  );

  return rows;
}

async function addTechniciansToOccurrence(occurrenceId, technicianIds = []) {
  if (!Array.isArray(technicianIds) || technicianIds.length === 0) return;

  const values = [];
  const params = [];

  technicianIds.forEach((tid, i) => {
    params.push(`($${i * 2 + 1}, $${i * 2 + 2})`);
    values.push(occurrenceId, tid);
  });

  const query = `
    INSERT INTO schedule_technicians (occurrence_id, user_id)
    VALUES ${params.join(", ")}
  `;

  await db.query(query, values);
}

export { getScheduleTechniciansByOccurrenceId, addTechniciansToOccurrence };
