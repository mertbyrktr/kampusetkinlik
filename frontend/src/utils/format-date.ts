export function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}