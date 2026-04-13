import { useEffect } from "react";
import { gsap } from "gsap";

const ScrollSmootherComponents = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let mounted = true;
      let tHero;
      import("@/plugins").then(({ ScrollTrigger, ScrollSmoother }) => {
        if (!mounted) return;
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
        let device_width = window.innerWidth;
        tHero = gsap.context(() => {
          ScrollSmoother.create({
            smooth: 1,
            effects: device_width < 1025 ? false : true,
            smoothTouch: false,
            normalizeScroll: false,
            ignoreMobileResize: true,
          });
        });
      });
      return () => {
        mounted = false;
        tHero?.revert();
      };
    }
  }, []);
  return <div></div>;
};

export default ScrollSmootherComponents;
