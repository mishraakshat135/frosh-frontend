import ElectricBorder from "./ElectricBorder";

function initials(name) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function MemberCard({ name, role, photo, color = "#22d3ee" }) {
  return (
    <ElectricBorder color={color} speed={0.6} chaos={0.06} borderRadius={18} className="h-full">
      <div className="flex h-full w-40 flex-col items-center gap-3 rounded-[18px] bg-white/5 px-4 py-6 text-center backdrop-blur-md sm:w-44">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-lg font-bold text-cyan-100">
          {photo ? (
            <img src={photo} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span>{initials(name)}</span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-white">{name}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">{role}</p>
        </div>
      </div>
    </ElectricBorder>
  );
}
