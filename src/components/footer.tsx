
import { useState, useEffect } from "react";
import SoftAurora from "./SoftAurora/SoftAurora";
import { FaInstagram, FaLinkedinIn, FaYoutube, FaEnvelope } from "react-icons/fa";

export default function Home() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      
      {/* Spacer to reveal footer */}
      <div style={{ height: "30vh", backgroundColor: "#0a0a0a", position: "fixed", bottom:0 ,zIndex: 1 }}></div>

      {/* Footer with Aurora Background */}
      <footer style={{ 
        padding: "40px 30px 20px", 
        position: "relative", 
        zIndex: 0,
        minHeight: "0vh",
        overflow: "hidden",
        backgroundColor: "#0a0a0a"
      }}>
        {/* Aurora Background - Only in Footer */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0
        }}>
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={1.0}
            color1="#0b1440"
            color2="#22d3ee"
            noiseFrequency={2.5}
            noiseAmplitude={1.0}
            bandHeight={0.5}
            bandSpread={1.0}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1.0}
            enableMouseInteraction={true}
            mouseInfluence={0.25}
          />
        </div>

        {/* Footer Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
          className="flex flex-col md:flex-row items-center justify-center md:gap-10"
            // style={{
            //   display: "grid",
            //   gridTemplateColumns: "1fr auto 1fr",
            //   alignItems: "center",
            //   gap: "30px",
            //   maxWidth: "1200px",
            //   margin: "0 auto",
            // }}
          >
            {/* Contact Info - Left Side */}
            <div 
            className ="text-left md:mr-55"
            //style={{ textAlign: "left", margin: "0 80px 0 20px" }}
            >
              <h1 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 12px", color: "#5ee1e6" }}>
                Contact Us
              </h1>
              
              <div className="contact-line" style={{ margin: "2px 0" }}>
                <span style={{ fontSize: "15px", color: "#fff" }}>
                  <span className="contact-name">Snehil Jhawar</span>
                  <span className="contact-separator"> </span>
                  <span className="contact-number">+91 90572 41613</span>
                </span>
              </div>
              
              <div className="contact-line" style={{ margin: "2px 0" }}>
                <span style={{ fontSize: "15px", color: "#fff" }}>
                  <span className="contact-name">Nandini</span>
                  <span className="contact-separator"> </span>
                  <span className="contact-number">+91 70090 36797</span>
                </span>
              </div>
              
              <div className="contact-line" style={{ margin: "2px 0" }}>
                <span style={{ fontSize: "15px", color: "#fff" }}>
                  <span className="contact-name">Vanshaj Kaushik</span>
                  <span className="contact-separator"> </span>
                  <span className="contact-number">+91 84398 18347</span>
                </span>
              </div>
            </div>

            {/* Logo - Center */}
            <div
              className="text-center flex flex-column items-cneter mr-45"
            // style={{ 
            //   textAlign: "center",
            //   display: "flex",
            //   flexDirection: "column",
            //   alignItems: "center",
            //   margin: "0 0 0 120px"
            // }}
            >
              <img
                src="/Logo.webp"
                alt="Frosh Logo 2026"
                style={{ width: "280px" }}
                className="logo-glow"
              />
            </div>

            {/* Hyperlinks - Right Side - STRAIGHT HORIZONTAL LINE */}
            <div
              className="flex flex-row justify-center items-center gap-3 flex-nowrap"
            >
              <a
                href="https://www.instagram.com/froshtiet"
                target="_blank"
                aria-label="Instagram"
                className="social-icon social-icon--instagram"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://in.linkedin.com/company/frosh-tiet"
                target="_blank"
                aria-label="LinkedIn"
                className="social-icon social-icon--linkedin"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.youtube.com/c/FroshTIET"
                target="_blank"
                aria-label="YouTube"
                className="social-icon social-icon--youtube"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
              <a
                href="mailto:frosh@thapar.edu"
                aria-label="Email"
                className="social-icon social-icon--mail"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          <p style={{ margin: "36px 0 4px", fontSize: "14px", color: "#ccc", textAlign: "center" }}>
            &copy; Frosh&apos;26
          </p>
          <p style={{ margin: "4px 0", fontSize: "13px", color: "#999", textAlign: "center" }}>
            Made with <span style={{ color: "#e63946" }}>&hearts;</span> by Frosh Team
          </p>

          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "16px 0 0" }} />
        </div>
      </footer>
        {showButton && (
        <button onClick={scrollToTop} className="back-to-top">
          ↑
        </button>
      )}

    </>
  );
}