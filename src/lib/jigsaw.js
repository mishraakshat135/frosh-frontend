// Generates true interlocking jigsaw-piece SVG paths for a rows x cols grid.
// Ported from a Python prototype (see /home/claude/gen_puzzle.py during design)
// and rendered/verified visually before porting.

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function offsetProfile(t, amp) {
  const bump = amp * Math.exp(-(((t - 0.5) / 0.085) ** 2));
  const neck =
    amp *
    0.28 *
    (Math.exp(-(((t - 0.355) / 0.05) ** 2)) + Math.exp(-(((t - 0.645) / 0.05) ** 2)));
  return bump - neck;
}

function edgePoints(sign, length, ampFrac, n = 22) {
  const amp = ampFrac * length;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const off = sign * offsetProfile(t, amp);
    pts.push([t * length, off]);
  }
  return pts;
}

function fmt(pts) {
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

/**
 * @param {number} rows
 * @param {number} cols
 * @param {object} opts
 * @returns {{ pieces: {row:number, col:number, d:string}[], width:number, height:number, cell:number }}
 */
export function buildJigsawPaths(rows, cols, opts = {}) {
  const { cell = 100, margin = 0, seed = 7, ampFrac = 0.24 } = opts;
  const rand = mulberry32(seed);
  const width = cols * cell + margin * 2;
  const height = rows * cell + margin * 2;

  const hSign = Array.from({ length: Math.max(rows - 1, 0) }, () =>
    Array.from({ length: cols }, () => (rand() < 0.5 ? 1 : -1))
  );
  const vSign = Array.from({ length: rows }, () =>
    Array.from({ length: Math.max(cols - 1, 0) }, () => (rand() < 0.5 ? 1 : -1))
  );

  const hEdgeAbsPoints = (r, c) => {
    const x0 = margin + c * cell;
    const yB = margin + (r + 1) * cell;
    const sign = hSign[r][c];
    return edgePoints(sign, cell, ampFrac).map(([t, off]) => [x0 + t, yB + off]);
  };

  const vEdgeAbsPoints = (r, c) => {
    const y0 = margin + r * cell;
    const xB = margin + (c + 1) * cell;
    const sign = vSign[r][c];
    return edgePoints(sign, cell, ampFrac).map(([t, off]) => [xB + off, y0 + t]);
  };

  const pieces = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = margin + c * cell;
      const y0 = margin + r * cell;
      const x1 = x0 + cell;
      const y1 = y0 + cell;

      const d = [`M ${x0.toFixed(2)},${y0.toFixed(2)}`];

      if (r === 0) {
        d.push(`L ${x1.toFixed(2)},${y0.toFixed(2)}`);
      } else {
        const pts = hEdgeAbsPoints(r - 1, c);
        d.push("L " + fmt(pts.slice(1)));
      }

      if (c === cols - 1) {
        d.push(`L ${x1.toFixed(2)},${y1.toFixed(2)}`);
      } else {
        const pts = vEdgeAbsPoints(r, c);
        d.push("L " + fmt(pts.slice(1)));
      }

      if (r === rows - 1) {
        d.push(`L ${x0.toFixed(2)},${y1.toFixed(2)}`);
      } else {
        const pts = hEdgeAbsPoints(r, c).slice().reverse();
        d.push("L " + fmt(pts.slice(1)));
      }

      if (c === 0) {
        d.push(`L ${x0.toFixed(2)},${y0.toFixed(2)}`);
      } else {
        const pts = vEdgeAbsPoints(r, c - 1).slice().reverse();
        d.push("L " + fmt(pts.slice(1)));
      }

      d.push("Z");
      pieces.push({ row: r, col: c, d: d.join(" ") });
    }
  }

  return { pieces, width, height, cell };
}
