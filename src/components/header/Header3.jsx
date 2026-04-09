import { useEffect, useRef, useState } from "react";
import Canvas from "../canvas/Canvas";
import Link from "next/link";
import LogoWhite from "../../../public/assets/imgs/logo/footer-logo-white.png";
import MenuWhite from "../../../public/assets/imgs/icon/menu-white.png";
import Image from "next/image";

export default function Header3() {
  const [topScroll, setTopScroll] = useState(0);

  const ofCanvasArea = useRef();
  const headerArea = useRef();

  const handleTopScroll = () => {
    const position = window.pageYOffset;
    setTopScroll(position);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleTopScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleTopScroll);
    };
  }, []);
  if (typeof window !== "undefined") {
    let device_width = window.innerWidth;
    if (device_width < 1365) {
      let header_bg = headerArea.current;
      if (header_bg) {
        if (topScroll > 20) {
          header_bg.style.background = "#121212";
          header_bg.style.setProperty("mix-blend-mode", "unset");
        } else {
          header_bg.style.background = "transparent";
          header_bg.style.setProperty("mix-blend-mode", "exclusion");
        }
      }
    }
  }
  const openCanvas = () => {
    ofCanvasArea.current.style.opacity = "1";
    ofCanvasArea.current.style.visibility = "visible";
    let header_bg = headerArea.current;
    header_bg.style.setProperty("mix-blend-mode", "unset");
  };
  return (
    <>
      <header className="header__area" ref={headerArea}>
        <div className="header__inner">
          <div className="header__logo">
            <Link href="/">
              <Image
                priority
                width={160}
                height={45}
                className="logo-primary"
                src={LogoWhite}
                alt="Nova Impact Logo"
                style={{ width: "auto", height: "45px", objectFit: "contain" }}
              />
              <Image
                priority
                width={160}
                height={45}
                className="logo-secondary"
                src={LogoWhite}
                alt="Nova Impact Logo"
                style={{ width: "auto", height: "36px", objectFit: "contain" }}
              />
            </Link>
          </div>
          <div className="header__nav-icon">
            <button onClick={openCanvas} id="open_offcanvas">
              <Image
                priority
                width={22}
                height={22}
                src={MenuWhite}
                alt="Menubar Icon"
              />
            </button>
          </div>
          <div className="header__support">
            <div className="header__social-links" style={{ display: "flex", gap: "16px", alignItems: "center", marginRight: "20px" }}>
              <a href="https://www.youtube.com/@novaimpactagency" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "16px", transition: "color 0.2s" }}>
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://www.instagram.com/novaimpact.io/" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "16px", transition: "color 0.2s" }}>
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://x.com/ImpactNova_io" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "16px", transition: "color 0.2s" }}>
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/company/nova-impact-io/posts/?feedView=all" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "16px", transition: "color 0.2s" }}>
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
            <p>
              Contact us <a href="tel:+447477884817">+44 7477 884817</a>
            </p>
          </div>
        </div>
        <Canvas bladeMode={headerArea.current} ofCanvasArea={ofCanvasArea} />
      </header>
    </>
  );
}
