import { motion, useScroll, useTransform } from "framer-motion";
import logo from "../assets/logo.webp";

export default function LogoSplit() {

    const { scrollY } = useScroll();

    const leftX = useTransform(
        scrollY,
        [0, 400],
        [0, -900]
    );

    const rightX = useTransform(
        scrollY,
        [0, 400],
        [0, 900]
    );

    const scale = useTransform(
        scrollY,
        [0, 150, 400],
        [1, 1.05, 1]
    );


    const opacity = useTransform(
        scrollY,
        [250, 450],
        [1, 0]
    );

    const glow = useTransform(
        scrollY,
        [0, 200, 400],
        [
            "drop-shadow(0 0 0px rgba(34,211,238,0))",
            "drop-shadow(0 0 35px rgba(34,211,238,.9))",
            "drop-shadow(0 0 0px rgba(34,211,238,0))"
        ]
    );

    return (

        <section className="fixed inset-0 z-[999] pointer-events-none flex items-center justify-center">
            <motion.div className=" absolute w-[500px] h-[500px] rounded-full  bg-cyan-400/20 blur-[180px] "
                style={{
                    opacity
                }}
            />

            <div className="relative w-[700px] h-[260px]">

                <motion.img src={logo} className="absolute inset-0 w-full h-full object-contain"
                    style={{
                        clipPath: "inset(0 50% 0 0)",
                        x: leftX,
                        scale,
                        opacity,
                        filter: glow
                    }}
                />

                <motion.img src={logo} className="absolute inset-0 w-full h-full object-contain"
                    style={{
                        clipPath: "inset(0 0 0 50%)",
                        x: rightX,
                        scale,
                        opacity,
                        filter: glow
                    }}
                />
            </div>
        </section>

    )
}