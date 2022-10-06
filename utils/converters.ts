export function covertGeometryToString(area: number[][]): string {
  return `(${(area || [])
    .map((point: number[]) => `(${point.join(",")})`)
    .join(",")})`;
}
