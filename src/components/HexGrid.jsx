import { buildHexLayout } from "../lib/hexLayout";
import "./HexGrid.css";

function initials(name) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function HexGrid({ members, maxWidth = 780 }) {
  const { centers, hexW, hexH, width, height } = buildHexLayout(members.length);

  return (
    <div
      className="hex-grid-wrap"
      style={{ aspectRatio: `${width} / ${height}`, maxWidth }}
    >
      {members.map((member, i) => {
        const { x, y } = centers[i];
        const left = ((x - hexW / 2) / width) * 100;
        const top = ((y - hexH / 2) / height) * 100;
        const w = (hexW / width) * 100;
        const h = (hexH / height) * 100;

        return (
          <div
            key={`${member.name}-${i}`}
            className="hex-cell"
            tabIndex={0}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}%`,
              height: `${h}%`,
            }}
          >
            <div className="hex-shape">
              <div className="hex-inner">
                <div className="hex-avatar">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} />
                  ) : (
                    <span>{initials(member.name)}</span>
                  )}
                </div>
                <p className="hex-name">{member.name}</p>
                <p className="hex-role">{member.role}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
