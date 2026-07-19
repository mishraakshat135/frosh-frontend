import SponsorBg from "../assets/SponsorBg.webp";
import "./sponsors.css";

import cornitos from "../assets/sponsors/cornitos.jpeg";
import decathlon from "../assets/sponsors/decathlon.jpeg";
import verka from "../assets/sponsors/verka.jpeg";
import looksSalon from "../assets/sponsors/looks-salon.jpeg";
import baskinRobbins from "../assets/sponsors/baskin-robbins.jpeg";
import redbull from "../assets/sponsors/redbull.jpeg";

const mainSponsors = [
  { name: "Coca-Cola", src: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" },
  { name: "Vivo", src: "https://commons.wikimedia.org/wiki/Special:FilePath/Vivo_logo_2019.svg" },
];

const associateSponsors = [
  { name: "Baskin Robbins", src: baskinRobbins },
  { name: "Decathlon", src: decathlon },
  { name: "Verka", src: verka },
  { name: "Looks Salon", src: looksSalon },
  { name: "Red Bull", src: redbull },
  { name: "Cornitos", src: cornitos },
];

export default function Sponsors() {
  // Rendered twice back-to-back so a translateX(-50%) loop is seamless
  const loopedSponsors = [...associateSponsors, ...associateSponsors];

  return (
    <section
      id="sponsors"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center px-6 py-28 text-white md:px-12"
      style={{ backgroundImage: `url(${SponsorBg})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.49),rgba(0,0,0,0.28),rgba(0,0,0,0.49))]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.55em] text-cyan-200/80">
            Our Sponsors
          </p>
          <h2 className="mt-5 mb-16 text-4xl font-black uppercase tracking-[0.12em] md:text-6xl">
            Powered by the people behind the lights.
          </h2>
        </div>

        {/* Main Sponsors */}
        <div className="mb-20 flex flex-wrap items-center justify-center gap-10">
          {mainSponsors.map((sponsor) => (
            <div key={sponsor.name} className="sponsor-main-card">
              <img src={sponsor.src} alt={`${sponsor.name} logo`} />
            </div>
          ))}
        </div>

        {/* Associate Sponsors — auto-scrolling carousel */}
        <div>
          <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-cyan-100/60">
            Associate Sponsors
          </p>
          <div className="sponsor-carousel">
            <div className="sponsor-track">
              {loopedSponsors.map((sponsor, i) => (
                <div key={`${sponsor.name}-${i}`} className="sponsor-card">
                  <img src={sponsor.src} alt={`${sponsor.name} logo`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
