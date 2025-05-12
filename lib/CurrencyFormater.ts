export function formatCurrencyVND(
  amount: number | string | null | undefined
): string {
  const value = Number(amount);
  if (isNaN(value)) return "0 ₫";
  return value.toLocaleString("vi-VN") + " ₫";
}
