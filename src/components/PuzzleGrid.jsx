import { useState, useMemo, useEffect } from "react";
import { buildJigsawPaths } from "../lib/jigsaw";
import "./PuzzleGrid.css";

function initials(name) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) || 1;
}

function useResponsiveColumns(desired) {
  const [cols, setCols] = useState(desired);
  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      if (w < 480) setCols(Math.max(2, Math.min(desired, 3)));
      else if (w < 860) setCols(Math.max(2, Math.min(desired, 5)));
      else setCols(desired);
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [desired]);
  return cols;
}

export default function PuzzleGrid({ members, columns = 3, groupKey = "grid", maxWidth = 900 }) {
  const [hovered, setHovered] = useState(null);
  const cols = useResponsiveColumns(columns);
  const rows = Math.max(1, Math.ceil(members.length / cols));

  const { pieces, width, height } = useMemo(
    () =>
      buildJigsawPaths(rows, cols, {
        cell: 100,
        margin: 5,
        seed: hashSeed(`${groupKey}-${rows}x${cols}`),
        ampFrac: 0.24,
      }),
    [rows, cols, groupKey]
  );

  const gradId = `puzzleNeon-${groupKey}`;

  return (
    <div
      className="puzzle-grid-wrap"
      style={{ aspectRatio: `${width} / ${height}`, maxWidth }}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="puzzle-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="55%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {pieces.map((p, i) => (
          <path
            key={i}
            d={p.d}
            className={`puzzle-path${hovered === i ? " is-hover" : ""}`}
            style={hovered === i ? { fill: `url(#${gradId})` } : undefined}
          />
        ))}
      </svg>

      <div
        className="puzzle-overlay"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {pieces.map((p, i) => {
          const member = members[i];
          if (!member) return <div key={i} className="puzzle-cell puzzle-cell-empty" />;
          return (
            <div
              key={i}
              className={`puzzle-cell${hovered === i ? " is-hover" : ""}`}
              tabIndex={0}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((h) => (h === i ? null : h))}
            >
              <div className="puzzle-avatar">
                {member.photo ? (
                  <img src={member.photo} alt={member.name} />
                ) : (
                  <span>{initials(member.name)}</span>
                )}
              </div>
              <p className="puzzle-name">{member.name}</p>
              <p className="puzzle-role">{member.role}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
