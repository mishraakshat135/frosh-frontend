import './App.css'
import Login from './pages/login'
import { Routes, Route, useLocation } from "react-router-dom";
import Hero from "./pages/hero";
import Home from "./pages/home";

import Events from "./pages/Events"
import MyTickets from "./pages/MyTickets"
import Navbar from "./components/navbar";
import Map from "./pages/map";
import About from "./pages/aboutUs";
import Sponsors from "./pages/sponsors";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/cursor"
import Footer from "./components/footer"
import CampusMap from "./pages/CampusMap"
import ScrollToTop from "./components/ScrollToTop";
import OurTeam from "./pages/OurTeam";
import Media from "./pages/Media";

function App() {
  const location = useLocation()
  const hideNavbar = location.pathname === "/"
  return (
    <>
    <Cursor />
    <ScrollToTop />
    <SmoothScroll />
    {!hideNavbar && <Navbar />}
     <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/events" element={<Events />}/>
      <Route path="/map" element={<Map />} />
      <Route path="/about" element={<About />} />
      <Route path="/sponsors" element={<Sponsors />} />
      <Route path="/mytickets" element={<MyTickets />} />
      <Route path="/campusmap" element={<CampusMap />} />
      <Route path="/team" element={<OurTeam />} />
      <Route path="/media" element={<Media />} />
    </Routes>
    <Footer />
    </>
  )
}

export default App
