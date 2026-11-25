export function parseDate(value) {
  if (value == null || value instanceof Date) return value;
  if (typeof value !== 'string' || !/^\d{2}-\d{2}-\d{4}$/.test(value)) return new Date(NaN);
  const [day, month, year] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : new Date(NaN);
}

export function formatDate(date) {
  if (!(date instanceof Date)) return date;
  return date.toISOString().slice(0, 10).split('-').reverse().join('-');
}

export function todayStart() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}
