function initials(name) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function PuzzlePiece({ member, hasRight, hasBottom, zIndex }) {
  return (
    <div className="puzzle-piece" style={{ zIndex }} tabIndex={0}>
      {hasRight && <span className="puzzle-knob puzzle-knob-right" aria-hidden="true" />}
      {hasBottom && <span className="puzzle-knob puzzle-knob-bottom" aria-hidden="true" />}

      <div className="puzzle-piece-inner">
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
    </div>
  );
}
