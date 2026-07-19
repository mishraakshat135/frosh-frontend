const SQRT3 = Math.sqrt(3);

const DIRECTIONS = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function buildHexLayout(count, gapFrac = 0.12) {
  const size = 1;

  const hexW = SQRT3 * size;
  const hexH = 2 * size;

  const positions = [];

  // Center hex
  positions.push({ q: 0, r: 0 });

  let ring = 1;

  while (positions.length < count) {
    // Start at top-left corner of ring
    let q = -ring;
    let r = ring;

    for (let side = 0; side < 6; side++) {
      const dir = DIRECTIONS[side];

      for (let step = 0; step < ring; step++) {
        if (positions.length >= count) break;

        positions.push({ q, r });

        q += dir.q;
        r += dir.r;
      }
    }

    ring++;
  }

  const spacing = 1 + gapFrac;

  const centers = positions.map(({ q, r }) => ({
    x: SQRT3 * (q + r / 2) * spacing,
    y: 1.5 * r * spacing,
  }));

  const xs = centers.map((c) => c.x);
  const ys = centers.map((c) => c.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX + hexW;
  const height = maxY - minY + hexH;

  const normalized = centers.map((c) => ({
    x: c.x - minX + hexW / 2,
    y: c.y - minY + hexH / 2,
  }));

  return {
    centers: normalized,
    width,
    height,
    hexW,
    hexH,
  };
}