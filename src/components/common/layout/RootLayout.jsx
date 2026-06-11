import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Header3 from "@/components/header/Header3";
import Footer3 from "@/components/footer/Footer3";

const CommonAnimation = dynamic(() => import("../CommonAnimation"), { ssr: false });
const ScrollSmootherComponents = dynamic(() => import("../ScrollSmootherComponents"), { ssr: false });
const CursorAnimation = dynamic(() => import("../CursorAnimation"), { ssr: false });
const Switcher = dynamic(() => import("../Switcher"), { ssr: false });
const ScrollTop = dynamic(() => import("../ScrollTop"), { ssr: false });

export default function RootLayout({
  children,
  header = "",
  footer = "",
  defaultMode = "",
}) {
  const [hasFinePointer, setHasFinePointer] = useState(false);
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nova-theme-mode") || defaultMode;
    }
    return defaultMode;
  });

  const cursor1 = useRef();
  const cursor2 = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasFinePointer(
        window.matchMedia("(min-width: 1201px) and (pointer: fine)").matches
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (mode === "dark") {
        document.querySelector("body").classList.add("dark");
      } else {
        document.querySelector("body").classList.remove("dark");
      }
      localStorage.setItem("nova-theme-mode", mode);
    }
  }, [mode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleThemeChange = (e) => {
        setMode(e.detail);
      };
      window.addEventListener("theme-change", handleThemeChange);
      return () => window.removeEventListener("theme-change", handleThemeChange);
    }
  }, []);

  return (
    <>
      <CommonAnimation />
      <div className="has-smooth" id="has_smooth"></div>
      <ScrollSmootherComponents />
      {hasFinePointer && (
        <>
          <div className="cursor" id="team_cursor">
            Drag
          </div>
          <CursorAnimation cursor1={cursor1} cursor2={cursor2} />
        </>
      )}
      <Switcher
        setMode={setMode}
        mode={mode}
        cursor1={cursor1}
        cursor2={cursor2}
      />
      <ScrollTop />
      <Header3 />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          {children}
          {footer !== "none" && <Footer3 />}
        </div>
      </div>
    </>
  );
}
