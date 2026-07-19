import { useEffect, useState } from "react";
import LogoSplit from "./LogoSplit";
import { motion } from "framer-motion"


export default function Intro() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    
    <motion.div initial={{x:0,y:0}} 
    animate={{
        x:[0,-6,6,-4,4,-2,2,0],
        y:[0,2,-2,2,-2,1,-1,0],
    }}

    transition={{
        delay:1.72,
        duration:.45,
    }}
      className=" fixed inset-0 z-9999 overflow-hidden  bg-black flex items-center justify-center">
    
      <div className=" absolute w-225 h-225 rounded-full  bg-cyan-500/10 blur-[220px]"/>

<div className="relative z-30">
    <LogoSplit />
</div>
    </motion.div>
  )
}