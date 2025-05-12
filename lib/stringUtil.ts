export function toCamelCase(snakeStr: string): string {
  return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
