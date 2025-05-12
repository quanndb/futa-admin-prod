export function formatToLocalDateTime(isoString: string): string {
  const [datePart, timePart] = isoString.split("T");

  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  return `${hour}:${minute} ${day}/${month}/${year}`;
}

export function formatToLocalDateTimeWithTimeZone(isoString: string): string {
  const date = new Date(isoString);

  const localDateTime = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).format(date);

  return localDateTime.replace(",", "");
}

export function formatDateToYYYYMMDD(date: Date | undefined): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
