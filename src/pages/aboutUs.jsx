import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AboutBg from "../assets/AboutBg.webp";
import about1 from "../assets/about1.webp";
import about2 from "../assets/about2.webp";
import Logo from "../../public/Logo.webp"
import { faculty } from "../data/facultyData";
import { teamGroups } from "../data/teamData";
import Folder from "../components/Folder";

export default function About() {
  const navigate = useNavigate();
  const teamCount = teamGroups.reduce((sum, g) => sum + g.members.length, 0);

  return (
    <section id="about" className="relative flex min-h-screen flex-col items-center bg-cover bg-center px-6 py-28 text-white md:px-12" style={{ backgroundImage: `url(${AboutBg})` }}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.49),rgba(0,0,0,0.28),rgba(0,0,0,0.49))]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <h2 className="mt-5 text-4xl font-black uppercase tracking-[0.12em] md:text-6xl">
            Our Story
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/66 md:text-base">
            Frosh is the official Admissions Cell of Thapar Institute dedicated to making the first-year experience unforgettable. We host events, guide freshers, and foster a welcoming campus environment.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/team?tab=faculty")}
              className="rounded-full bg-cyan-400 px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#05030d] shadow-[0_0_30px_rgba(34,211,238,0.45)] transition hover:-translate-y-1 hover:shadow-[0_0_48px_rgba(34,211,238,0.6)]"
            >
              Meet the Faculty
            </button>
            <button
              onClick={() => navigate("/team?tab=team")}
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/80 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/10 hover:text-cyan-100"
            >
              Meet the Team
            </button>
          </div>
        </div>

        {/* <button
          onClick={() => navigate("/media")}
          className="group relative min-h-140 overflow-visible text-left cursor-pointer"
          aria-label="View Media"
        >
          <motion.figure
            whileHover={{ y: -14, rotate: -2, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="absolute left-0 top-30 w-[64%] overflow-hidden rounded-lg border border-amber-200/45 bg-black/35 p-3 shadow-[0_0_55px_rgba(251,191,36,0.18),0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            <img src={about1} className="h-50 w-full rounded-md object-cover" />
          </motion.figure>

          <motion.figure
            whileHover={{ y: -14, rotate: 2, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="absolute bottom-24 right-0 w-[58%] overflow-hidden rounded-lg border border-cyan-200/45 bg-black/35 p-3 shadow-[0_0_55px_rgba(34,211,238,0.18),0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
          >
            <img src={about2}  className="h-50 w-full rounded-md object-cover" />
          </motion.figure>

          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="rounded-full bg-cyan-400 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#05030d] shadow-[0_0_30px_rgba(34,211,238,0.5)]">
              View All Media
            </span>
          </span>
        </button> */}


        <div className=" absolute right-70 top-30 " >
          <div
            className="absolute -inset-10 -z-10 rounded-full blur-3xl opacity-60"
            style={{
              background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)'
            }}
          ></div>
          <Folder 
            items={[
              <img src={about1} alt="Frosh event" className="h-full w-full object-cover rounded-[10px]" />,
              <img 
              src={about2} alt="Frosh event" className="h-full w-full object-cover rounded-[10px]" />,
              
              <div
                key="p3"
                className="folder-logo-paper"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/media");
                }}
              >
                <img className="-mt-3" src={Logo} alt="Frosh 2026" />
                {/* <span className="">View Media</span> */}
              </div>,
              // <img 
              //  src={Logo} alt="Frosh event" className="h-full w-full object-cover rounded-[10px]" />,

            ]}
            size={3} color="#22d3ee" className="custom-folder drop-shadow-[0_0_25px_rgba(34,211,238,0.5)]" />

        </div>



      </div>


    </section>
  );
}
