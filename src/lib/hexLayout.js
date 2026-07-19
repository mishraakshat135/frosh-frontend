// Arranges N items into a hexagon "pyramid": row 0 has 1 hex, row 1 has 2,
// row 2 has 3, etc., each row centered so hexes nest into the row above —
// exactly like a honeycomb. If N isn't a perfect triangular number, the
// final row is simply shorter.

const SQRT3 = Math.sqrt(3);

export function buildHexLayout(count, gapFrac = 0.12) {
  const hexW = SQRT3; // flat-to-flat width, unit size = 1 (center-to-vertex)
  const hexH = 2; // vertex-to-vertex height
  const horizSpacing = hexW * (1 + gapFrac);
  const vertSpacing = hexH * 0.75 * (1 + gapFrac * 0.6);

  const rows = [];
  let remaining = count;
  let r = 0;
  while (remaining > 0) {
    const c = Math.min(r + 1, remaining);
    rows.push(c);
    remaining -= c;
    r += 1;
  }

  const maxRowWidth = Math.max(...rows) * horizSpacing;
  const totalHeight = (rows.length - 1) * vertSpacing + hexH;

  const centers = [];
  rows.forEach((cnt, ri) => {
    const rowWidth = cnt * horizSpacing;
    const xStart = (maxRowWidth - rowWidth) / 2;
    const y = ri * vertSpacing + hexH / 2;
    for (let ci = 0; ci < cnt; ci++) {
      const x = xStart + ci * horizSpacing + horizSpacing / 2;
      centers.push({ x, y });
    }
  });

  return {
    centers,
    hexW,
    hexH,
    width: maxRowWidth,
    height: totalHeight,
  };
}
