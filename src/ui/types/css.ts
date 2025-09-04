export type CssSize = number | string;

export function toCssSize(v?: CssSize) {
  return typeof v === "number" ? `${v}px` : v;
}