export function useGHIData(rawData, days, from, to) {
  const sorted = [...rawData].sort((a, b) => a.Date.localeCompare(b.Date));

  let filtered;
  if (from && to) {
    filtered = sorted.filter((r) => r.Date >= from && r.Date <= to);
  } else if (days) {
    filtered = sorted.slice(-days);
  } else {
    filtered = sorted;
  }

  const values = filtered.map((r) => r.GHI);
  const max = values.length ? Math.max(...values) : 0;
  const min = values.length ? Math.min(...values) : 0;
  const avg = values.length
    ? values.reduce((s, v) => s + v, 0) / values.length
    : 0;

  return {
    data: filtered,
    stats: { max, min, avg },
    peakIndex: filtered.findIndex((r) => r.GHI === max),
  };
}