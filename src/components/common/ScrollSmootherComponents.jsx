import { useEffect } from "react";
import { gsap } from "gsap";

const ScrollSmootherComponents = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@/plugins").then(({ ScrollSmoother }) => {
        gsap.registerPlugin(ScrollSmoother);
        let device_width = window.innerWidth;
        let tHero = gsap.context(() => {
          ScrollSmoother.create({
            smooth: 1,
            effects: device_width < 1025 ? false : true,
            smoothTouch: false,
            normalizeScroll: false,
            ignoreMobileResize: true,
          });
        });
      });
    }
  }, []);
  return <div></div>;
};

export default ScrollSmootherComponents;
