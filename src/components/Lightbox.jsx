import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./Lightbox.css";

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, photos.length, onClose, onNavigate]);

  if (index === null || index === undefined) return null;
  const photo = photos[index];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button
        className="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close full image"
      >
        <X size={22} />
      </button>

      <button
        className="lightbox-nav lightbox-prev"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + photos.length) % photos.length);
        }}
        aria-label="Previous photo"
      >
        <ChevronLeft size={26} />
      </button>

      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.label || "Frosh event photo"} />
        {photo.label && <figcaption>{photo.label}</figcaption>}
      </figure>

      <button
        className="lightbox-nav lightbox-next"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % photos.length);
        }}
        aria-label="Next photo"
      >
        <ChevronRight size={26} />
      </button>
    </div>
  );
}
