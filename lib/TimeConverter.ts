// int (min) -> hour min

export const intToHour = (min: number) => {
  const hours = Math.floor(min / 60);
  return hours;
};

export const intToMin = (min: number) => {
  const minutes = min % 60;
  return minutes;
};

export function calculateTimeDifference(
  startTime: string,
  endTime: string
): number {
  // Hàm helper để tạo đối tượng Date mà không bị ảnh hưởng bởi múi giờ
  function createDateFromTime(time: string): Date {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    const date = new Date(1970, 0, 1); // Tạo ngày cố định để không bị ảnh hưởng bởi ngày
    date.setHours(hours, minutes, seconds, 0);
    return date;
  }

  const start = createDateFromTime(startTime);
  const end = createDateFromTime(endTime);

  // Tính sự chênh lệch giữa 2 mốc thời gian (tính bằng mili giây)
  let diffInMillis = end.getTime() - start.getTime();

  // Nếu sự chênh lệch là âm, tức là mốc thời gian end trước start, thêm 24 giờ vào
  if (diffInMillis < 0) {
    diffInMillis += 24 * 60 * 60 * 1000; // 24 giờ tính bằng mili giây
  }

  // Chuyển mili giây thành giờ và làm tròn đến 1 chữ số thập phân
  const diffInHours = (diffInMillis / (1000 * 60 * 60)).toFixed(1);

  return parseFloat(diffInHours);
}

export function formatTime(time: string): string {
  // Tách giờ và phút từ thời gian
  const [hours, minutes] = time.split(":");

  // Trả về định dạng "HH:mm"
  return `${hours}:${minutes}`;
}

export function normalizeTimeInput(time: string): string {
  if (time === "24:00") return "23:59:59";
  const [hh, mm] = time.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
}
