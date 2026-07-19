
import Hero from "./hero"
import Events from "./Events"
import About from "./aboutUs"
import Map from "./map"
import Sponsors from "./sponsors"


export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white scroll-smooth">
      <>
        <section id="home" data-cursor="#22d3ee">
          <Hero />
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
