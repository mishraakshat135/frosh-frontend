import React, { useCallback, useEffect, useRef, useState } from "react";
import BorderGlow from "../components/map components/border";
import SplitText from "../components/map components/splittext";
import locations from "../data/locations.json"

/* ============================================================
   TYPES
============================================================ */
interface Location {
  id: string;
  name: string;
  x: number; // % of map image width
  y: number; // % of map image height
  eyebrow?: string;
  images: string[]; // one image = no arrows; 2+ = gallery with dots
  description?: string;
  facts?: Record<string, string>;
}

/* ============================================================
   LOCATION DATA
   ------------------------------------------------------------
   This is the ONE place you edit to add a building/block.
   x / y are a % of the map image (0–100).
============================================================ */ 



/* ============================================================
   COMPONENT
============================================================ */
export default function CampusMap() {
  const LOCATIONS: Location[] = locations;

  const mapFrameRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  const [hovered, setHovered] = useState<Location | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const currentImages = activeLocation?.images?.length ? activeLocation.images : ["campus-map.webp"];
  const hasGallery = currentImages.length > 1;

  const showTooltip = useCallback((e: React.MouseEvent | React.FocusEvent, loc: Location) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ left: rect.left + rect.width / 2, top: rect.top });
    setHovered(loc);
  }, []);

  const hideTooltip = useCallback(() => setHovered(null), []);

  const openModal = useCallback((loc: Location) => {
    setActiveLocation(loc);
    setImageIndex(0);
    setIsModalOpen(true);
    setHovered(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Reset active location after modal closes
    setTimeout(() => {
      setActiveLocation(null);
    }, 300);
  }, []);

  const showNextImage = useCallback(() => {
    if (currentImages.length < 2) return;
    setImageIndex((i) => (i + 1) % currentImages.length);
  }, [currentImages.length]);

  const showPrevImage = useCallback(() => {
    if (currentImages.length < 2) return;
    setImageIndex((i) => (i - 1 + currentImages.length) % currentImages.length);
  }, [currentImages.length]);

  // Lock body scroll while modal is open, focus the close button
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      modalCloseRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Escape closes modal, arrow keys navigate gallery
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showNextImage();
      if (e.key === "ArrowLeft") showPrevImage();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, closeModal, showNextImage, showPrevImage]);

  // Hide tooltip on scroll / resize
  useEffect(() => {
    window.addEventListener("scroll", hideTooltip, { passive: true });
    window.addEventListener("resize", hideTooltip);
    return () => {
      window.removeEventListener("scroll", hideTooltip);
      window.removeEventListener("resize", hideTooltip);
    };
  }, [hideTooltip]);

  return (
    <>
      <style>{`
        .cm-root {
          --mist:        #0b0c13;
          --panel:       #FFFFFF;
          --ink:         #1F2A1C;
          --ink-muted:   #5B6B54;
          --maroon:      #8C1D40;
          --maroon-dark: #6B1631;
          --gold:        #C9A227;
          --line:        #D6DECB;

          --font-display: "Fraunces", serif;
          --font-body:    "Inter", system-ui, sans-serif;
          --font-mono:    "JetBrains Mono", monospace;

          --radius-lg: 20px;
          --radius-sm: 10px;
          --shadow-lg: 0 30px 60px -20px rgba(31, 42, 28, 0.35);

          background: var(--mist);
          color: var(--ink);
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
          min-height: 100%;
        }
        .cm-root * { box-sizing: border-box; }

        .cm-page-header {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px 24px;
          text-align: center;
        }
        .cm-eyebrow {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--maroon);
          margin-bottom: 10px;
        }
        .cm-page-header h1 {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 5vw, 52px);
          margin: 0 0 10px;
          color: var(--ink);
        }
        .cm-subhead {
          font-size: 15px;
          color: var(--ink-muted);
          margin: 0;
        }

        .cm-map-shell {
          max-width: 1400px;
          margin: 0 auto 64px;
          padding: 0 24px;
        }
        .cm-map-frame {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          line-height: 0;
        }
        .cm-map-image {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
        }

        /* Override BorderGlow styles to work with our map */
        .cm-map-border-glow {
          --card-bg: #0b0c13 !important;
          border: 1px solid var(--line) !important;
          box-shadow: var(--shadow-lg) !important;
        }
        .cm-map-border-glow .border-glow-inner {
          border-radius: 20px !important;
          overflow: hidden !important;
        }

        .cm-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 34px;
          height: 34px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          z-index: 10;
        }
        .cm-marker-dot {
          position: relative;
          z-index: 2;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--maroon);
          border: 3px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          transition: transform 0.18s ease, background 0.18s ease;
        }
        .cm-marker-pulse {
          position: absolute;
          z-index: 1;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--maroon);
          opacity: 0.55;
          animation: cm-pulse 2.2s ease-out infinite;
        }
        @keyframes cm-pulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .cm-marker:hover .cm-marker-dot,
        .cm-marker:focus-visible .cm-marker-dot,
        .cm-marker.is-active .cm-marker-dot {
          transform: scale(1.25);
          background: var(--gold);
        }
        .cm-marker:focus-visible { outline: none; }
        .cm-marker:focus-visible .cm-marker-dot {
          box-shadow: 0 0 0 4px rgba(140, 29, 64, 0.35), 0 2px 6px rgba(0,0,0,0.35);
        }
        @media (prefers-reduced-motion: reduce) {
          .cm-marker-pulse { animation: none; opacity: 0.25; }
        }

        .cm-tooltip {
          position: fixed;
          z-index: 57.5;
          transform: translate(-50%, calc(-100% - 20px));
          background: var(--ink);
          color: #fff;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          white-space: nowrap;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .cm-tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: var(--ink);
        }
        .cm-tooltip-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
        }
        .cm-tooltip-hint {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .cm-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 97.5;
          background: rgba(20, 26, 17, 0.55);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.22s ease;
        }
        .cm-modal-overlay.is-open {
          opacity: 1;
          visibility: visible;
        }
        .cm-modal-card {
          position: relative;
          width: min(760px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          background: var(--panel);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          display: grid;
          grid-template-columns: 1fr 1fr;
          transform: translateY(18px) scale(0.97);
          transition: transform 0.25s ease;
        }
        .cm-modal-overlay.is-open .cm-modal-card {
          transform: translateY(0) scale(1);
        }
        .cm-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2.5;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.9);
          color: var(--ink);
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .cm-modal-close:hover { background: var(--maroon); color: #fff; }

        .cm-modal-media {
          position: relative;
          background: var(--mist);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .cm-modal-media img {
          width: 100%;
          height: auto;
          border-radius: var(--radius-sm);
        }

        .cm-modal-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.9);
          color: var(--ink);
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .cm-modal-arrow:hover { background: var(--maroon); color: #fff; }
        .cm-modal-arrow.cm-prev { left: 10px; }
        .cm-modal-arrow.cm-next { right: 10px; }

        .cm-modal-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          gap: 6px;
        }
        .cm-modal-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(31, 42, 28, 0.3);
        }
        .cm-modal-dot.is-active {
          background: var(--maroon);
        }

        .cm-modal-body {
          padding: 36px 32px 32px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .cm-modal-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--maroon);
        }
        .cm-modal-body h2 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          margin: 0;
          color: var(--ink);
        }
        .cm-modal-body p {
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--ink-muted);
          margin: 0;
        }
        .cm-modal-facts {
          margin: 8px 0 0;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 8px 14px;
          font-size: 13px;
        }
        .cm-modal-facts dt {
          font-family: var(--font-mono);
          color: var(--gold);
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
          align-self: start;
          padding-top: 2px;
        }
        .cm-modal-facts dd {
          margin: 0;
          color: var(--ink);
        }

        /* SplitText styles */
        .split-parent {
          display: inline-block;
          width: 100%;
        }
        .split-char {
          display: inline-block;
          will-change: transform, opacity;
        }

        @media (max-width: 680px) {
          .cm-modal-card { grid-template-columns: 1fr; max-height: 92vh; }
          .cm-modal-body { padding: 24px 22px 28px; }
          .cm-marker { width: 28px; height: 28px; }
          .cm-marker-dot, .cm-marker-pulse { width: 13px; height: 13px; }
        }
      `}</style>

      <div className="cm-root mt-20">
        <header className="cm-page-header">
          <span className="cm-eyebrow">Thapar Institute of Engineering &amp; Technology</span>
          <h1>Campus Map</h1>
          <p className="cm-subhead">Hover a marker for a quick look, click it to open the full record.</p>
        </header>

        <main className="cm-map-shell">
          <BorderGlow
            className="cm-map-border-glow"
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#0b0c13"
            borderRadius={20}
            glowRadius={40}
            glowIntensity={1.0}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            fillOpacity={0.3}
          >
            <div className="cm-map-frame" ref={mapFrameRef}>
              <img
                src="/campus_images/campus-map.webp"
                alt="Thapar Institute campus map"
                className="cm-map-image"
                draggable={false}
              />

              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  className={`cm-marker${activeLocation?.id === loc.id && isModalOpen ? " is-active" : ""}`}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  aria-haspopup="dialog"
                  aria-label={`${loc.name} — show details`}
                  onMouseEnter={(e) => showTooltip(e, loc)}
                  onMouseLeave={hideTooltip}
                  onFocus={(e) => showTooltip(e, loc)}
                  onBlur={hideTooltip}
                  onClick={() => openModal(loc)}
                >
                  <span className="cm-marker-dot" />
                  <span className="cm-marker-pulse" aria-hidden="true" />
                </button>
              ))}
            </div>
          </BorderGlow>
        </main>

        {/* Hover tooltip */}
        {hovered && (
          <div
            className="cm-tooltip"
            role="status"
            style={{ left: tooltipPos.left, top: tooltipPos.top }}
          >
            <span className="cm-tooltip-name">{hovered.name}</span>
            <span className="cm-tooltip-hint">click for details</span>
          </div>
        )}

        {/* Detail modal */}
        <div
          className={`cm-modal-overlay${isModalOpen ? " is-open" : ""}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="cm-modal-card" role="dialog" aria-modal="true" aria-labelledby="cmModalTitle">
            <button className="cm-modal-close" ref={modalCloseRef} aria-label="Close" onClick={closeModal}>
              &times;
            </button>
            <div className="cm-modal-media">
              <img src={currentImages[imageIndex]} alt={activeLocation?.name ?? ""} />

              {hasGallery && (
                <>
                  <button className="cm-modal-arrow cm-prev" aria-label="Previous image" onClick={showPrevImage}>
                    &#8249;
                  </button>
                  <button className="cm-modal-arrow cm-next" aria-label="Next image" onClick={showNextImage}>
                    &#8250;
                  </button>
                  <div className="cm-modal-dots">
                    {currentImages.map((_, i) => (
                      <span key={i} className={`cm-modal-dot${i === imageIndex ? " is-active" : ""}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="cm-modal-body">
              <span className="cm-modal-eyebrow">{activeLocation?.eyebrow ?? ""}</span>
              
              {/* Location name with SplitText effect */}
              <SplitText
                key={activeLocation?.id || 'modal-title'}
                text={activeLocation?.name ?? ""}
                tag="h2"
                className="cm-modal-title"
                textAlign="left"
                delay={30}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 30, rotateX: -10 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                threshold={0.1}
                rootMargin="-50px"
                triggerOnMount={true}
              />
              
              <p>{activeLocation?.description ?? ""}</p>
              <dl className="cm-modal-facts">
                {Object.entries(activeLocation?.facts ?? {}).map(([label, value]) => (
                  <React.Fragment key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}