import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";

gsap.registerPlugin(ScrollTrigger);

const ShowcaseParallaxHero = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".fade_bottom", { y: 30, opacity: 0 });

        if (device_width < 1023) {
          const fadeArray = gsap.utils.toArray(".fade_bottom");
          fadeArray.forEach((item, i) => {
            let fadeTl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top center+=200",
              },
            });
            fadeTl.to(item, {
              y: 0,
              opacity: 1,
              ease: "power2.out",
              duration: 1.5,
            });
          });
        } else {
          gsap.to(".fade_bottom", {
            scrollTrigger: {
              trigger: ".fade_bottom",
              start: "top center+=300",
              markers: false,
            },
            y: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 1,
            stagger: {
              each: 0.2,
            },
          });
        }
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <div class="showcase__top-16">
        <div class="title-left">
          <h2 class="sec-title-16 fade_bottom">
            {" "}
            Work <br /> Life <span>Design</span> <br /> Studio{" "}
          </h2>
          <div
            class="showcase_16_hover"
            style={{ backgroundImage: "url(assets/imgs/home-7/a1.jpg)" }}
          ></div>
        </div>
        <div class="title-right">
          <p class="fade_bottom">
            View the full case study of our recent featured and awesome global
            branding agency that powers the most creative works of our recent
            featured
          </p>
        </div>
      </div>
    </>
  );
};

export default ShowcaseParallaxHero;
