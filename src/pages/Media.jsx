import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CircularGallery from "../components/CircularGallery/CircularGallery";
import Lightbox from "../components/Lightbox";
import { mediaPhotos } from "../data/mediaPhotos";
import "./media.css";

export default function Media() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const galleryItems = useMemo(
    () => mediaPhotos.map(photo => ({ image: photo.src, text: photo.label || "" })),
    []
  );

  return (
    <div className="media-screen">
      <div className="video-layer">
        <video
          autoPlay muted loop playsInline
          src="/media/stellar-scroll-60fps.mp4"
          style={{ transform: "translateZ(0) scale(1.015)" }}
        />
      </div>
      <div className="media-wash" />
      <div className="starfield" aria-hidden="true">
        {Array.from({ length: 50 }, (_, i) => ({
          id: i,
          left: `${(i * 41.3) % 100}%`,
          top: `${(i * 67.7) % 100}%`,
          size: 1 + (i % 3),
          delay: `${(i % 9) * -0.55}s`,
        })).map((s) => (
          <i key={s.id} style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }} />
        ))}
      </div>

      <div className="media-content">
        <div className="mx-auto w-full max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl transition hover:border-cyan-300 hover:text-cyan-200"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-300">
              Moments From Frosh
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] md:text-6xl">
              Media
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60 md:text-base">
              Drag to spin through the reel — hover a photo to bring it into focus, click to open it full size.
            </p>
          </div>

          <div className="media-circular-stage">
            <CircularGallery
              items={galleryItems}
              bend={3}
              textColor="#faf6ee"
              borderRadius={0.06}
              font="bold 22px 'Space Grotesk', sans-serif"
              scrollEase={0.06}
              onItemClick={(i) => setActiveIndex(i)}
            />
          </div>
        </div>
      </div>

      {activeIndex !== null && (
        <Lightbox
          photos={mediaPhotos}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={(next) => setActiveIndex(next)}
        />
      )}
    </div>
  );
}
