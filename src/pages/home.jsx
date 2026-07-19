import { useEffect, useState } from "react";
import Hero from "./hero";
import Events from "./Events";
import About from "./aboutUs";
import Map from "./map";
import Sponsors from "./sponsors";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showIntro") === "true";

    if (shouldShow) {
      setShowIntro(true);

      // Remove it immediately so refresh won't show it again
      sessionStorage.removeItem("showIntro");
    }
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white scroll-smooth">
      <section id="home">
        <Hero showIntro={showIntro} />
      </section>

      <section id="events">
        <Events />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="map">
        <Map />
      </section>

      <section id="sponsors">
        <Sponsors />
      </section>
    </main>
  );
}