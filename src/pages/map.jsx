import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Navigation, TicketCheck } from "lucide-react";
import { useRef } from "react";
import MapBg from "../assets/MapBg.webp";
import mapImage from "../assets/map.webp";
import { useNavigate } from "react-router-dom";

export default function Map() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const x = useTransform(scrollYProgress, [0, 0.48, 1], ["72vw", "0vw", "-72vw"]);
    const opacity = useTransform(scrollYProgress, [0, 0.22, 0.76, 1], [0, 1, 1, 0]);
    const rotate = useTransform(scrollYProgress, [0, 0.48, 1], [8, 0, -8]);
    const navigate = useNavigate()

    return (
        <section id="map" ref={sectionRef} className="relative flex min-h-[130vh] items-center justify-center overflow-hidden bg-cover bg-center px-5 py-28 text-white"
            style={{
                backgroundImage: `url(${MapBg})`,
            }}
        >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.29),rgba(0,0,0,0.10),rgba(0,0,0,0.29))]" />
            <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black to-transparent" />

            <motion.div style={{ x, opacity, rotate }} className="relative z-10 w-full max-w-4xl rounded-lg border border-cyan-200/55 bg-black/54 p-6 backdrop-blur-2xl shadow-[0_0_70px_rgba(34,211,238,0.24),0_28px_90px_rgba(0,0,0,0.62)] md:p-9">
                <div className="pointer-events-none absolute -inset-px rounded-lg bg-linear-to-r from-cyan-200/35 via-transparent to-amber-200/35 opacity-70" />
                <p className="text-xs mb-9 uppercase tracking-[0.5em] text-cyan-100/80">
                    Click the Map for better experience
                </p>
                <img onClick={()=> navigate("/campusmap")} src={mapImage} className="h-85 w-full rounded-md  opacity-90 saturate-125" />
            </motion.div>
        </section>
    )
}
