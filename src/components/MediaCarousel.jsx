import { useEffect, useRef, useState } from "react";
import "./MediaCarousel.css";

// Circular "frame carousel": 12 photos arranged as wedges around a ring that
// spins continuously. Whichever wedge is passing the top "gate" blooms
// (scales up + brightens) and shows its caption. If more than 12 photos are
// given, every full rotation swaps in the next batch of 12 automatically.
export default function MediaCarousel({ photos }) {
  const rigRef = useRef(null);
  const wheelRef = useRef(null);
  const capLabelRef = useRef(null);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const wheel = wheelRef.current;
    const rig = rigRef.current;
    const capLabel = capLabelRef.current;
    if (!wheel || !rig || !capLabel) return;

    const COUNT = 12;
    const ARC = 24; // degrees of photo actually drawn per slot
    const SLOT = 360 / COUNT; // degrees between slot centres
    const FOCUS_RANGE = (SLOT / 2) * 0.9;
    const OUTER_R = 270;
    const INNER_R = 138;

    const ALL_PHOTOS = photos && photos.length ? photos : [];

    const BATCHES = [];
    for (let i = 0; i + COUNT <= ALL_PHOTOS.length; i += COUNT) {
      BATCHES.push(ALL_PHOTOS.slice(i, i + COUNT));
    }
    const leftover = ALL_PHOTOS.length % COUNT;
    if (leftover !== 0) {
      const msg = `⚠ ${ALL_PHOTOS.length} photos given — that's ${leftover} short of a multiple of 12. The last ${leftover} photo(s) are ignored. Add ${
        COUNT - leftover
      } more, or remove ${leftover}.`;
      console.warn(msg);
      setWarning(msg);
    } else {
      setWarning("");
    }
    if (BATCHES.length === 0) BATCHES.push(ALL_PHOTOS.slice(0, COUNT));

    let currentBatch = 0;

    function applyBatch(batchIdx) {
      const set = BATCHES[batchIdx];
      if (!set) return;
      segments.forEach((s, i) => {
        const photo = set[i];
        if (!photo) return;
        s.el.style.backgroundImage = `url(${photo.src})`;
        s.label = photo.label;
      });
    }

    const arcRad = (ARC * Math.PI) / 180;
    const outerW = 2 * OUTER_R * Math.sin(arcRad / 2);
    const innerW = 2 * INNER_R * Math.sin(arcRad / 2);
    const boxH = OUTER_R - INNER_R;
    const innerHalfPct = (innerW / 2 / outerW) * 100;
    const clip = `polygon(${50 - innerHalfPct}% 100%, ${50 + innerHalfPct}% 100%, 100% 0%, 0% 0%)`;
    const restCenterY = -(OUTER_R + INNER_R) / 2;
    const centerTargetY = restCenterY;

    const segments = [];
    wheel.innerHTML = "";
    for (let i = 0; i < COUNT; i++) {
      const baseAngle = i * SLOT;
      const spoke = document.createElement("div");
      spoke.className = "mc-spoke";
      spoke.style.transform = `rotate(${baseAngle}deg)`;

      const seg = document.createElement("div");
      seg.className = "mc-segment";
      seg.style.width = outerW + "px";
      seg.style.height = boxH + "px";
      seg.style.left = -outerW / 2 + "px";
      seg.style.top = -OUTER_R + "px";
      seg.style.transformOrigin = "50% 50%";
      seg.style.clipPath = clip;

      const sheen = document.createElement("div");
      sheen.className = "mc-sheen";
      const edge = document.createElement("div");
      edge.className = "mc-edge";
      seg.appendChild(sheen);
      seg.appendChild(edge);
      spoke.appendChild(seg);
      wheel.appendChild(spoke);
      segments.push({ el: seg, baseAngle, label: "" });
    }

    applyBatch(currentBatch);

    function smoothstep(t) {
      return t * t * (3 - 2 * t);
    }

    let rotation = 0;
    let totalRotation = 0;
    const speed = 8; // degrees per second
    let paused = false;
    let last = performance.now();
    let rafId;

    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    rig.addEventListener("mouseenter", onEnter);
    rig.addEventListener("mouseleave", onLeave);

    function frame(now) {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused) {
        const delta = speed * dt;
        rotation = (rotation + delta) % 360;
        totalRotation += delta;
        const turnsDone = Math.floor(totalRotation / 360);
        const targetBatch = turnsDone % BATCHES.length;
        if (targetBatch !== currentBatch) {
          currentBatch = targetBatch;
          applyBatch(currentBatch);
        }
      }
      wheel.style.transform = `rotate(${rotation}deg)`;

      let bestT = -1,
        bestIdx = 0;
      segments.forEach((s, idx) => {
        let abs = (s.baseAngle + rotation) % 360;
        if (abs > 180) abs -= 360;
        const t = Math.max(0, 1 - Math.abs(abs) / FOCUS_RANGE);
        const e = smoothstep(t);
        const dy = (centerTargetY - restCenterY) * e;
        const scale = 1 + 0.12 * e;
        const brightness = 0.8 + 0.55 * e;
        const saturate = 0.9 + 0.5 * e;
        const z = Math.round(1000 + e * 6000);

        s.el.style.transform = `translateY(${dy}px) scale(${scale})`;
        s.el.style.filter = `saturate(${saturate}) brightness(${brightness})`;
        s.el.style.clipPath = clip;
        s.el.style.zIndex = z;
        s.el.style.boxShadow =
          e > 0.4 ? `0 ${18 * e}px ${46 * e}px rgba(0,0,0,${0.45 * e})` : "none";

        if (e > bestT) {
          bestT = e;
          bestIdx = idx;
        }
      });

      if (bestT > 0.72) {
        if (
          (capLabel.dataset.idx != bestIdx || capLabel.dataset.batch != currentBatch) &&
          segments[bestIdx]
        ) {
          capLabel.dataset.idx = bestIdx;
          capLabel.dataset.batch = currentBatch;
          capLabel.textContent = segments[bestIdx].label;
          capLabel.classList.add("show");
        }
      } else if (bestT < 0.4) {
        capLabel.classList.remove("show");
      }

      rafId = requestAnimationFrame(frame);
    }

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      rig.removeEventListener("mouseenter", onEnter);
      rig.removeEventListener("mouseleave", onLeave);
    };
  }, [photos]);

  return (
    <div className="mc-stage">
      {warning && <div className="mc-warn-banner">{warning}</div>}
      <div className="mc-rig" ref={rigRef}>
        <div className="mc-gate" />
        <div className="mc-wheel" ref={wheelRef} />
      </div>
      <div className="mc-caption">
        <span className="mc-label" ref={capLabelRef} />
      </div>
      <div className="mc-hint">Hover to hold the frame</div>
    </div>
  );
}
