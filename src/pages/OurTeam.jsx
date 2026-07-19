import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import HexGrid from "../components/HexGrid";
import SplashCursor from "../components/SplashCursor";
import { faculty } from "../data/facultyData";
import { teamGroups } from "../data/teamData";
import "./ourTeam.css";

export default function OurTeam() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "team" ? "team" : "faculty";
  const [tab, setTab] = useState(initialTab);

  return (
    <div className="team-screen">
      <SplashCursor
        RAINBOW_MODE={false}
        COLOR="#d946ef"
        DENSITY_DISSIPATION={3.2}
        VELOCITY_DISSIPATION={2.4}
        SPLAT_RADIUS={0.22}
        CURL={3}
        SPLAT_FORCE={7500}
      />
      <div className="video-layer">
        <video
          autoPlay muted loop playsInline
          src="/media/stellar-scroll-60fps.mp4"
          style={{ transform: "translateZ(0) scale(1.015)" }}
        />
      </div>
      <div className="cosmic-wash team-wash" />
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 50 }, (_, i) => ({
          id: i,
          left: `${(i * 41.3) % 100}%`,
          top: `${(i * 67.7) % 100}%`,
          size: 1 + (i % 3),
          delay: `${(i % 9) * -0.55}s`,
        })).map((s) => (
          <i key={s.id} style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }} />
        ))}
      </div>

      <div className="team-content">
        <div className="mx-auto w-full max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl transition hover:border-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-300">
              The People Behind Frosh
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] md:text-6xl">
              Team &amp; Faculty
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60 md:text-base">
              Hover a piece to meet the person behind it — every card here helped put Frosh together.
            </p>
          </div>

          <div className="mb-16 mt-10 flex justify-center gap-4">
            <button
              onClick={() => setTab("faculty")}
              className={`rounded-full px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] transition ${
                tab === "faculty"
                  ? "bg-cyan-400 text-[#05030d] shadow-[0_0_30px_rgba(34,211,238,0.45)]"
                  : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Faculty
            </button>
            <button
              onClick={() => setTab("team")}
              className={`rounded-full px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] transition ${
                tab === "team"
                  ? "bg-cyan-400 text-[#05030d] shadow-[0_0_30px_rgba(34,211,238,0.45)]"
                  : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              Team
            </button>
          </div>

          {tab === "faculty" && (
            <div>
              <h3 className="mb-10 text-center text-2xl font-black uppercase tracking-[0.1em] md:text-3xl">
                Faculty
              </h3>
              <HexGrid members={faculty} maxWidth={640} />
            </div>
          )}

          {tab === "team" && (
            <div className="flex flex-col gap-24">
              {teamGroups.map((group) => {
                const maxWidth =
                  group.key === "mentors" ? 1400 : group.key === "core" ? 820 : 480;
                return (
                  <div key={group.key}>
                    <h3 className="mb-10 text-center text-2xl font-black uppercase tracking-[0.1em] md:text-3xl">
                      {group.label}{" "}
                      <span className="text-cyan-300">({group.members.length})</span>
                    </h3>
                    <HexGrid members={group.members} maxWidth={maxWidth} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
