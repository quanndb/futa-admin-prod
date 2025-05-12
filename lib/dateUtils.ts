/**
 * Trả về số giờ giữa hai thời điểm (dương nếu A sau B, âm nếu A trước B)
 * @param a - Thời điểm A (Date | string)
 * @param b - Thời điểm B (Date | string)
 * @returns số giờ (float)
 */
export function getHourDifference(a: Date | string, b: Date | string): number {
  const dateA = new Date(a);
  const dateB = new Date(b);
  const diffMs = dateA.getTime() - dateB.getTime();
  const diffHours = diffMs / (1000 * 60 * 60); // ms → hours
  return diffHours;
}

export function isBeforeNow(date: Date | string): boolean {
  const now = new Date();
  const input = typeof date === "string" ? new Date(date) : date;
  return input.getTime() < now.getTime();
}

export function isAfterNow(date: Date | string): boolean {
  const now = new Date();
  const input = typeof date === "string" ? new Date(date) : date;
  return input.getTime() > now.getTime();
}

export function nowIsBefore20Min(date: Date | string): boolean {
  const now = new Date();
  const inputDate = typeof date === "string" ? new Date(date) : date;

  // Add `min` minutes to the input date
  const adjustedDate = new Date(inputDate.getTime() + 20 * 60 * 1000);

  // Check if now is after the adjusted date
  return now < adjustedDate;
}

export function isBeforeNow24h(date: Date | string): boolean {
  const now = new Date();
  const inputDate = typeof date === "string" ? new Date(date) : date;

  // Get the current time minus 24 hours
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Check if the input date is before the time 24 hours ago
  return inputDate < twentyFourHoursAgo;
}

export function isAfterNow24h(date: Date | string): boolean {
  const now = new Date();
  const inputDate = typeof date === "string" ? new Date(date) : date;

  // Get the current time minus 24 hours
  const afterTwentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Check if the input date is before the time 24 hours ago
  return inputDate > afterTwentyFourHours;
}
