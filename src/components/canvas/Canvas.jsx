import { faMagnifyingGlass, faXmark, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import logoWhite2 from "../../../public/assets/imgs/logo/footer-logo-white.png";
import Shape11 from "../../../public/assets/imgs/shape/11.png";
import Shape12 from "../../../public/assets/imgs/shape/12.png";
import Image from "next/image";

const Canvas = ({ bladeMode = "", ofCanvasArea }) => {
  const [accordion, setAccordion] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const headerTitle = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("nova-theme-mode");
      setIsDark(savedMode === "dark" || document.body.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const newMode = isDark ? "light" : "dark";
    setIsDark(!isDark);
    localStorage.setItem("nova-theme-mode", newMode);

    if (newMode === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    window.dispatchEvent(new CustomEvent("theme-change", { detail: newMode }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        let rootParent = headerTitle.current.children;
        for (let i = 0; i < rootParent.length; i++) {
          let firstParent = rootParent[i].children;
          for (let j = 0; j < firstParent.length; j++) {
            if (firstParent[j].className.includes("header_title")) {
              let arr = firstParent[j].children[0].textContent.split("");
              let spanData = "";
              for (let k = 0; k < arr.length; k++) {
                if (arr[k] == " ") {
                  spanData += `<span style='width:2vw;'>${arr[k]}</span>`;
                } else {
                  spanData += `<span>${arr[k]}</span>`;
                }
              }
              let result = '<div class="menu-text">' + spanData + "</div>";
              firstParent[j].children[0].innerHTML = result;
            }
          }
        }
      }, 10);
    }
  }, []);

  const openData = (data) => {
    setAccordion(data);
  };

  const closeCanvas = () => {
    ofCanvasArea.current.style.opacity = "0";
    ofCanvasArea.current.style.visibility = "hidden";
    if (bladeMode) {
      let header_bg = bladeMode;
      header_bg.style.setProperty("mix-blend-mode", "exclusion");
    }
  };

  return (
    <>
      <div className="offcanvas__area" ref={ofCanvasArea}>
        <div className="offcanvas__body">
          <div className="offcanvas__left">
            <div className="offcanvas__logo">
              <Link href="/">
                <Image
                  priority
                  width={160}
                  height={45}
                  style={{ width: "auto", height: "45px", objectFit: "contain" }}
                  src={logoWhite2}
                  alt="Nova Impact Logo"
                />
              </Link>
            </div>
            <div className="offcanvas__social">
              <p className="social-title">Follow Us</p>
              <ul>
                <li><a href="https://www.instagram.com/novaimpact.io/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://x.com/ImpactNova_io" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
                <li><a href="https://www.linkedin.com/company/nova-impact-io/posts/?feedView=all" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </div>
            <div className="offcanvas__links">
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/faq">FAQs</Link></li>
              </ul>
            </div>
          </div>

          <div className="offcanvas__mid">
            {/* Mobile-only logo inside menu panel */}
            <div className="offcanvas__mobile-logo" style={{ padding: "24px 24px 0", display: "none" }}>
              <Link href="/" onClick={closeCanvas}>
                <Image
                  priority
                  width={140}
                  height={40}
                  src={logoWhite2}
                  alt="Nova Impact Logo"
                  style={{ width: "auto", height: "36px", objectFit: "contain" }}
                />
              </Link>
            </div>
            <div className="offcanvas__menu-wrapper">
              <nav className="offcanvas__menu">
                <ul className="menu-anim title" ref={headerTitle}>

                  {/* HOME */}
                  <li>
                    <div className="header_title">
                      <Link href="/">HOME</Link>
                    </div>
                  </li>

                  {/* SERVICES */}
                  <li>
                    <div className="header_title d-flex">
                      <Link href="/service">SERVICES</Link>
                      <div className="accordian-btn">
                        {accordion === 2 ? (
                          <a onClick={() => openData(0)}>-</a>
                        ) : (
                          <a onClick={() => openData(2)}>+</a>
                        )}
                      </div>
                    </div>
                    <ul
                      className="sub_title"
                      style={accordion === 2 ? { display: "" } : { display: "none" }}
                    >
                      <li><Link href="/service-details/website-creation">Website Creation</Link></li>
                      <li><Link href="/service-details/social-media-management">Social Media Management</Link></li>
                      <li><Link href="/service-details/content-creation">Content Creation</Link></li>
                      <li><Link href="/service-details/meta-ads">Meta Ads (Facebook & Instagram)</Link></li>
                      <li><Link href="/service-details/google-ads">Google Ads</Link></li>
                      <li><Link href="/service-details/seo">SEO (Search Engine Optimization)</Link></li>
                      <li><Link href="/service-details/brand-identity">Brand Identity</Link></li>
                      <li><Link href="/service-details/comparator-creation">Comparator Creation</Link></li>
                      <li><Link href="/service-details/consulting-support">Consulting & Support</Link></li>
                    </ul>
                  </li>

                  {/* PORTFOLIO */}
                  <li>
                    <div className="header_title">
                      <Link href="/portfolio">PORTFOLIO</Link>
                    </div>
                  </li>

                  {/* ABOUT */}
                  <li>
                    <div className="header_title">
                      <Link href="/about">ABOUT</Link>
                    </div>
                  </li>

                  {/* BLOG */}
                  <li>
                    <div className="header_title">
                      <Link href="/blog">BLOG</Link>
                    </div>
                  </li>

                  {/* CONTACT */}
                  <li>
                    <div className="header_title">
                      <Link href="/contact">CONTACT</Link>
                    </div>
                  </li>

                </ul>
              </nav>

            </div>
          </div>

          <div className="offcanvas__right">
            <div className="offcanvas__search">
              <form action="#">
                <input type="text" name="search" placeholder="Search keyword" />
                <button>
                  <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                </button>
              </form>
            </div>
            <div className="offcanvas__contact">
              <p className="offcanvas-contact-title">Get in touch</p>
              <ul>
                <li>
                  <a href="tel:+447477884817">+44 7477 884817</a>
                </li>
                <li>
                  <a href="tel:+33980801417">+33 980 801 417</a>
                </li>
                <li>
                  <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>
                </li>
                <li>Marseille · London · Agadir</li>
              </ul>
            </div>
            {/* Theme Toggle */}
            <div style={{ marginTop: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
              <FontAwesomeIcon icon={faSun} style={{ color: isDark ? "#555" : "#FFC81A", fontSize: "18px" }} />
              <button
                onClick={toggleTheme}
                style={{
                  width: "52px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "none",
                  background: isDark ? "#FFC81A" : "#333",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.3s",
                }}
              >
                <span style={{
                  position: "absolute",
                  top: "3px",
                  left: isDark ? "26px" : "3px",
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.3s",
                }} />
              </button>
              <FontAwesomeIcon icon={faMoon} style={{ color: isDark ? "#FFC81A" : "#555", fontSize: "18px" }} />
            </div>

            <Image
              priority
              style={{ width: "auto", height: "auto" }}
              src={Shape11}
              alt="shape"
              className="shape-1"
            />
            <Image
              priority
              style={{ width: "auto", height: "auto" }}
              src={Shape12}
              alt="shape"
              className="shape-2"
            />
          </div>

          <div className="offcanvas__close">
            <button type="button" onClick={closeCanvas}>
              <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Canvas;
