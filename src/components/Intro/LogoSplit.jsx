import { motion } from "framer-motion";
import logo from "../../assets/logo.webp";

export default function LogoSplit() {
    return (
        <div className="relative w-180 h-60">


            <motion.div className=" absolute left-1/2 top-1/2 w-112.5 h-112.5 rounded-full -translate-x-1/2 -translate-y-1/2  bg-cyan-400/20 blur-[180px] "
                initial={{
                    scale: 0,
                    opacity: 0,
                }}
                animate={{
                    scale: [0, 1.2, 1],
                    opacity: [0, .8, .45],
                }}
                transition={{
                    duration: 2.3,
                }} />

            <motion.img src={logo} className="absolute inset-0 w-full h-full object-contain"

                style={{
                    clipPath: "inset(0 50% 0 0)"
                }}

                initial={{
                    x: -1600,
                }}

                animate={{
                    x: [-1600, 0, 0], scale: [1, 1.05, 1],
                    filter: [
                        "drop-shadow(0 0 0px rgba(34,211,238,0))",
                        "drop-shadow(0 0 25px rgba(34,211,238,.8))",
                        "drop-shadow(0 0 45px rgba(34,211,238,1))",
                        "drop-shadow(0 0 25px rgba(34,211,238,.8))",
                    ]
                }}

                transition={{
                    duration: 2, times: [0, .88, 1], ease: "easeOut"
                }}
            />

            <motion.img src={logo} className="absolute inset-0 w-full h-full object-contain"

                style={{
                    clipPath: "inset(0 0 0 50%)"
                }}

                initial={{
                    x: 1600,
                }}

                animate={{
                    x: [1600, 0, 0], scale: [1, 1.05, 1],
                    filter: [
                        "drop-shadow(0 0 0px rgba(34,211,238,0))",
                        "drop-shadow(0 0 25px rgba(34,211,238,.8))",
                        "drop-shadow(0 0 45px rgba(34,211,238,1))",
                        "drop-shadow(0 0 25px rgba(34,211,238,.8))",
                    ]
                }}

                transition={{
                    duration: 2, times: [0, .88, 1], ease: "easeOut"
                }}
            />

            <motion.div className=" absolute inset-0  bg-white rounded-full  "

                initial={{
                    opacity: 0
                }}

                animate={{
                    opacity: [0, 0, 1, 0]
                }}

                transition={{
                    delay: 1.7,
                    duration: .35
                }}
            />

            <motion.div className=" absolute left-1/2 top-1/2 w-24 h-24 rounded-ful  borde   border-cyan-30  -translate-x-1/2 -translate-y-1/2 "
                initial={{
                    scale: 0,
                    opacity: 0
                }}

                animate={{
                    scale: [0, 12],
                    opacity: [1, 0]
                }}

                transition={{
                    delay: 1.72,
                    duration: .8
                }}

            />

        </div>
    )
}