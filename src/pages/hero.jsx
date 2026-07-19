import { useEffect, useRef, useState } from 'react';
import Intro from "../components/Intro/Intro";
import LogoSplit from "../components/LogoSplits"
import Events from "./Events"
import About from "./aboutUs"
import Map from "./map"
import Sponsors from "./sponsors"
import { gsap, ScrollTrigger } from "../lib/gsap"

const user = JSON.parse(localStorage.getItem("user"));
const FRAME_COUNT = 66;
const FRAME_PATH = (i) => `/frames_2/frame_${String(i).padStart(6, '0')}.webp`;

export default function Hero({ scrollHeight = '400vh', showIntro = false }) {
    const wrapperRef = useRef(null);
    const canvasRef = useRef(null)
    const imagesRef = useRef([]);
    const currentFrameRef = useRef(0)
    const frameRef = useRef(0)
    const heroRef = useRef(null)
    const [playIntro, setPlayIntro] = useState(showIntro);
    useEffect(() => {
        gsap.from(canvasRef.current, {
            opacity: 0,
            duration: 1.2,
        })
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current
        const ctx = canvas.getContext('2d');

        function drawFrame(index) {
            const img = imagesRef.current[index]
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.naturalWidth / img.naturalHeight;

            let drawWidth, drawHeight, offsetX, offsetY;
            if (imgRatio > canvasRatio) {
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawFrame(currentFrameRef.current);
        }



        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = FRAME_PATH(i);
            if (i === 1) img.onload = () => drawFrame(0);
            imagesRef.current[i - 1] = img;
        }

        const trigger = ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: "top top",
            end: 'bottom bottom',
            pin: heroRef.current,
            scrub: true,
            onEnter:()=>{
                window.lenis.options.duration = 3;
            },
            onLeave: ()=>{
                window.lenis.options.duration = 3;
            },
            scrub: true,
            onUpdate: (self) => {
                const frameIndex = Math.floor(
                    self.progress * (FRAME_COUNT - 1)
                )
                currentFrameRef.current = frameIndex;
                frameRef.current = frameIndex;

                drawFrame(frameIndex)
            }
        })

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            trigger.kill()
            window.removeEventListener("resize", resizeCanvas)
            ScrollTrigger.getAll().forEach(trigger => trigger.kill())
        }
    }, [playIntro])

    return (
        <>
           {playIntro && (
  <Intro
    onComplete={() => setPlayIntro(false)}
  />
)}
            <LogoSplit />
            <section ref={wrapperRef} className="relative" style={{ height: scrollHeight }}>
                <div ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                    <canvas ref={canvasRef} className="h-full w-full" />
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-[65vh]"
                        style={{ background: 'linear-gradient(to top, #000 0%, #000 22%, rgba(0,0,0,0.85) 40%, transparent 100%)' }}
                    />
                </div>
            </section>
        </>
    )
}