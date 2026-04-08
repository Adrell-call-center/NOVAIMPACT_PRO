import { useEffect, useRef, useState } from "react";
import allNavData from "../../../data/navData.json";
import Preloader from "@/components/preloader/Preloader";
import CommonAnimation from "../CommonAnimation";
import ScrollSmootherComponents from "../ScrollSmootherComponents";
import CursorAnimation from "../CursorAnimation";
import Switcher from "../Switcher";
import ScrollTop from "../ScrollTop";
import Header1 from "@/components/header/Header1";
import Footer1 from "@/components/footer/Footer1";
import Header2 from "@/components/header/Header2";
import Header3 from "@/components/header/Header3";
import Header4 from "@/components/header/Header4";
import Header5 from "@/components/header/Header5";
import Footer2 from "@/components/footer/Footer2";
import Footer3 from "@/components/footer/Footer3";
import Footer4 from "@/components/footer/Footer4";
import Footer5 from "@/components/footer/Footer5";

const HeaderContent = ({ header, navData }) => {
  if (header == "header1") {
    return <Header1 navData={navData} />;
  } else if (header == "header2") {
    return <Header2 navData={navData} />;
  } else if (header == "header3") {
    return <Header3 />;
  } else if (header == "header4") {
    return <Header4 navData={navData} />;
  } else if (header == "header5") {
    return <Header5 />;
  } else if (header == "none") {
    return "";
  } else {
    return <Header3 />;
  }
};
const FooterContent = ({ footer }) => {
  if (footer == "footer1") {
    return <Footer1 />;
  } else if (footer == "footer2") {
    return <Footer2 />;
  } else if (footer == "footer3") {
    return <Footer3 />;
  } else if (footer == "footer4") {
    return <Footer4 />;
  } else if (footer == "footer5") {
    return <Footer5 />;
  } else if (footer == "none") {
    return "";
  } else {
    return <Footer3 />;
  }
};

export default function RootLayout({
  children,
  header = "",
  footer = "",
  defaultMode = "",
}) {
  const [mode, setMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nova-theme-mode") || defaultMode;
    }
    return defaultMode;
  });
  const [navData, setNavData] = useState({});

  const cursor1 = useRef();
  const cursor2 = useRef();
  useEffect(() => {
    setNavData(allNavData);
    if (typeof window !== "undefined") {
      if (mode == "dark") {
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
      <CommonAnimation>
        <div className="has-smooth" id="has_smooth"></div>
        <ScrollSmootherComponents />
        <div className="cursor" id="team_cursor">
          Drag
        </div>
        <Preloader />
        <CursorAnimation cursor1={cursor1} cursor2={cursor2} />
        <Switcher
          setMode={setMode}
          mode={mode}
          cursor1={cursor1}
          cursor2={cursor2}
        />
        <ScrollTop />
        <HeaderContent header={header} navData={navData} />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            {children}
            <FooterContent footer={footer} />
          </div>
        </div>
      </CommonAnimation>
    </>
  );
}
