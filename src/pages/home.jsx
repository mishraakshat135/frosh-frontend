
import Hero from "./hero"
import Events from "./Events"
import About from "./aboutUs"
import Map from "./map"
import Sponsors from "./sponsors"
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation()
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white scroll-smooth">
      <>
        <section id="home" data-cursor="#22d3ee">
          <Hero showIntro={location.state?.showIntro ?? false} />
        </section>

        <section id="events" data-cursor="#f97316">
          <Events />
        </section>

        <section id="about" data-cursor="#a855f7" >
          <About />
        </section>

        <section id="map" data-cursor="#22c55e">
          <Map />
        </section>

        <section id="sponsors" data-cursor="#facc15">
          <Sponsors />
        </section>
      </>
    </main>

  )
}
