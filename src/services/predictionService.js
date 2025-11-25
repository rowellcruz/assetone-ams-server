import * as predictionModel from "../models/predictionModel.js";

function computeIntervals(recent) {
  const intervals = [];
  for (let i = 0; i < recent.length - 1; i++) {
    const current = new Date(recent[i].completed_at);
    const previous = new Date(recent[i + 1].completed_at);
    const diffDays = (current - previous) / (1000 * 60 * 60 * 24);
    if (!isNaN(diffDays) && diffDays >= 0) intervals.push(diffDays);
  }
  return intervals;
}

function calculateTrendRisk(history) {
  if (!history || history.length === 0) return null;

  history.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
  const recent = history.slice(0, 6);

  let pmCount = 0;
  let cmCount = 0;
  let downtimeCount = 0;
  let totalDowntime = 0;
  let conditionValues = [];

  for (let h of recent) {
    if (h.occurrence_type === "PM") pmCount++;
    else if (h.occurrence_type === "CM") cmCount++;

    if (h.started_at && h.completed_at) {
      totalDowntime +=
        (new Date(h.completed_at) - new Date(h.started_at)) / 1000 / 3600;
      downtimeCount++;
    }

    if (h.condition !== null && h.condition !== undefined) {
      conditionValues.push(h.condition);
    }
  }

  const intervals = computeIntervals(recent);
  const totalCount = recent.length;

  // Frequency
  const freqRecent =
    intervals.length > 0
      ? Math.round(intervals.slice(0, 3).reduce((a, b) => a + b) / Math.min(3, intervals.length))
      : null;

  const freqBaseline =
    intervals.length > 3
      ? Math.round(
          intervals
            .slice(3, 6)
            .reduce((a, b) => a + b) / Math.min(3, intervals.length - 3)
        )
      : freqRecent;

  const freqScore =
    freqRecent && freqBaseline && freqBaseline > 0
      ? Math.min(1, freqBaseline / freqRecent)
      : 0;

  // Condition Drop — corrected formula
  const currentCondition = conditionValues[0] ?? null;
  const lastCondition =
    conditionValues.length > 1
      ? conditionValues[conditionValues.length - 1]
      : currentCondition;

  const conditionDrop =
    currentCondition !== null && lastCondition !== null
      ? lastCondition - currentCondition
      : 0;

  const conditionScore =
    conditionDrop > 0 ? Math.min(1, conditionDrop / 20) : 0;

  // Downtime
  const downtimeAvg = totalDowntime / (downtimeCount || 1);
  const downtimeScore = downtimeAvg > 24 ? 1 : downtimeAvg / 24;

  // CM
  const cmRatio = cmCount / totalCount;
  const cmScore = cmRatio;

  const riskScore =
    0.25 * freqScore +
    0.35 * conditionScore +
    0.2 * downtimeScore +
    0.2 * cmScore;

  // Reasons
  const topReasons = [];

  if (conditionScore > 0.3) {
    topReasons.push(
      `Condition dropped from ${lastCondition} → ${currentCondition} (${conditionDrop} pts)`
    );
  }

  if (freqScore > 0.3 && freqRecent && freqBaseline) {
    topReasons.push(
      `Maintenance interval shrinking: now every ${freqRecent} days vs ${freqBaseline} days`
    );
  }

  if (downtimeScore > 0.3) {
    topReasons.push(
      `Downtime rising: avg ${downtimeAvg.toFixed(1)}h across ${downtimeCount} events`
    );
  }

  if (cmScore > 0.3) {
    topReasons.push(
      `Corrective maintenance increasing: ${cmCount}/${totalCount} recent tasks`
    );
  }

  const suggestions = [];

  if (conditionScore > 0.3) {
    suggestions.push(
      `Focused inspection recommended — ${conditionDrop}pt condition loss detected.`
    );
  }

  if (freqScore > 0.3 && freqRecent) {
    suggestions.push(
      `Interval compression detected. Current gap: ${freqRecent} days. Check loading or misuse.`
    );
  }

  if (downtimeScore > 0.3) {
    suggestions.push(
      `Downtime rising. Avg ${downtimeAvg.toFixed(
        1
      )}h. Review root causes before next cycle.`
    );
  }

  if (cmScore > 0.3) {
    suggestions.push(
      `High corrective ratio (${cmCount}/${totalCount}). Reinforce proactive checks.`
    );
  }

  if (suggestions.length === 0) {
    suggestions.push("No immediate actions required. Trends stable.");
  }

  return {
    risk_score: Math.round(riskScore * 100),
    top_reasons: topReasons,
    suggestions: suggestions,
  };
}

export async function predictNextMaintenance(filter = {}) {
  const rows = await predictionModel.getMaintenanceHistory(filter);
  if (!rows.length) return [];

  const grouped = {};
  rows.forEach((r) => {
    if (!grouped[r.item_unit_id]) grouped[r.item_unit_id] = [];
    grouped[r.item_unit_id].push(r);
  });

  const predictions = [];

  for (const [unitId, history] of Object.entries(grouped)) {
    const trend = calculateTrendRisk(history);
    predictions.push({
      item_unit_id: parseInt(unitId),
      ...trend,
    });
  }

  return predictions;
}
