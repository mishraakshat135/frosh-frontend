import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Menu, X, LogOut, ChevronDown, User } from "lucide-react"
import Logo from "../../public/media/frosh-logo.png"
import PillLinks from "./PillLinks.jsx"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home");
  const [hidden, setHidden] = useState(false)
  const location = useLocation()
  const navigate = useNavigate();

  const links = useMemo(
    () => [
      { name: "Home", path: "/home", section: "home" },
      { name: "Events", path: "/events", section: "events" },
      { name: "About Us", path: "/about", section: "about" },
      { name: "Map", path: "/map", section: "map" },
      { name: "Sponsors", path: "/sponsors", section: "sponsors" }
    ],
    []
  )

  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    const pathSection = links.find((link) => link.path === location.pathname)?.section
    if (location.pathname !== "/home") {
      setActiveSection(pathSection || "")
      return;
    }

    const sections = links
      .map((link) => document.getElementById(link.section))
      .filter((el) => el && el.offsetHeight > 0)

    const updateActiveSection = () => {
      const readingLine = window.innerHeight * 0.42
      const current =
        sections.find((section) => {
          const rect = section.getBoundingClientRect()
          return rect.top <= readingLine && rect.bottom >= readingLine
        }) || sections[0]

      if (current?.id) {
        setActiveSection(current.id)
      }
    };

    let frameId = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(updateActiveSection)
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    };
  }, [links, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setMenuOpen(false)
    navigate("/")
  }


  useEffect(() => {
    let previousY = window.scrollY;
    let frameId = 0;

    const updateVisibility = () => {
      const currentY = window.scrollY
      const isMovingDown = currentY > previousY && currentY > 160;
      setHidden(isMovingDown && !menuOpen)
      previousY = currentY
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frameId)
      frameId = window.requestAnimationFrame(updateVisibility)
    };

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [menuOpen])

  useEffect(() => {
    if (location.pathname !== "/home" || !location.hash) 
      return;

    const id = location.hash.replace("#", "")
    const section = document.getElementById(id)
    if (section) {
      setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
    }
  }, [location.hash, location.pathname])

  const handleNav = (event, link) => {
    setMenuOpen(false)

    if (location.pathname === "/home") {
      event.preventDefault()
      const section = document.getElementById(link.section)
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" })
        window.history.replaceState(null, "", `/home#${link.section}`)
        setActiveSection(link.section)
      }
      return
    }

    if (link.section !== "home") {
      event.preventDefault()
      navigate(`/home#${link.section}`)
    }
  };

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 z-50 w-[92%] max-w-6xl -translate-x-1/2 transition duration-500 ${hidden ? "-translate-y-28 opacity-0" : "translate-y-0 opacity-100"}`}>
        <nav className="relative flex h-16 items-center justify-between rounded-full border border-white/10 bg-white/6 backdrop-blur-3xl px-5 shadow-[0_8px_50px_rgba(0,0,0,0.45)] overflow-visible" >
          <div className="absolute inset-0 bg-linear-to-r from-cyan-400/5 via-transparent to-orange-500/5 pointer-events-none" />

          <NavLink to="/home" className="relative z-10 flex items-center gap-3 group">
              <img className="w-15" src={Logo} />
          </NavLink>

          <div
            className="hidden lg:flex items-center relative z-10"
            style={{ '--base': '#22d3ee', '--pill-bg': '#00000', '--hover-text': '#faf6ee', '--pill-text': '#22d3ee' }}
          >
            <PillLinks
              activeSection={activeSection}
              items={links.map((link) => ({
                name: link.name,
                section: link.section,
                to: location.pathname === "/home" ? `/home#${link.section}` : link.path,
                onClick: (event) => handleNav(event, link)
              }))}
            />
          </div>

          <div className="relative hidden lg:flex items-center z-10">

            <button onClick={() => setProfileOpen(!profileOpen)} className=" flex items-center gap-1.5 rounded-full border  border-white/10  bg-white/5 px-3 py-1.5  text-white backdrop-blur-xl hover:border-cyan-400/40  hover:bg-white/10 transition ">
              <User size={15} />

              <span className="text-xs">
                {user?.username || "Profile"}
              </span>

              <ChevronDown size={14} className={`transition ${profileOpen ? "rotate-180" : ""}`}/>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 rounded-2xl border  border-white/10  bg-black/60 backdrop-blur-2xl p-2 shadow-2xl">
                <button onClick={handleLogout} className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3  text-red-400  hover:bg-red-500/10">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}

          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden relative z-10 text-white">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {menuOpen && (
          <div
            className="mt-4 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl p-6 lg:hidden ">
            <div className="flex flex-col gap-6">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={location.pathname === "/home" ? `/home#${link.section}` : link.path}
                  onClick={(event) => handleNav(event, link)}
                  className={`uppercase tracking-[0.25em] transition 
                      ${activeSection === link.section
                      ? "text-cyan-300"
                      : "text-white/70 hover:text-white"
                    }`}>
                  {link.name}
                </NavLink>
              ))}
              <hr className="border-white/10" />

              <button onClick={handleLogout} className="flex items-center gap-3  text-red-400 uppercase tracking-[0.25em]  hover:text-red-300">
                <LogOut size={18} />
                Logout
              </button>

            </div>
          </div>
        )}
      </header>
    </>
  )
}
