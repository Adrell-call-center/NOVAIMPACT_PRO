import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "@/plugins";
import Link from "next/link.js";
import Home7sh1 from "../../../public/assets/imgs/bg/arrow-long.png";
import Image from "next/image.js";

gsap.registerPlugin(ScrollTrigger);

const DesignStudioHero = () => {
  const btnWrapper = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        let heading_title = new SplitText(".sec-title-3", { type: "chars" });
        let heading_char = heading_title.chars;

        gsap.from(heading_char, {
          rotate: 20,
          ease: "back.out",
          opacity: 0,
          duration: 2,
          stagger: 0.1,
        });

        gsap.from(
          ".hero2-shape img",
          {
            xPercent: -100,
            duration: 1,
          },
          "-=4.5"
        );

        gsap.from(
          ".hero__text-2 p",
          {
            opacity: 0,
            x: -30,
            duration: 1.5,
          },
          "-=5"
        );
        gsap.from(
          btnWrapper.current,
          {
            opacity: 0,
            y: -70,
            ease: "bounce",
            duration: 1.5,
          },
          "-=5"
        );
        let arr1 = gsap.utils.toArray("#btn_wrapper");
        let arr2 = gsap.utils.toArray(".btn_wrapper");
        const all_buttons = arr1.concat(arr2);

        all_buttons.forEach((btn) => {
          if (!btn.classList.contains("hero__button")) {
            gsap.from(btn, {
              scrollTrigger: {
                trigger: btn,
                start: "top center+=150",
                markers: false,
              },
              opacity: 0,
              y: -70,
              ease: "bounce",
              duration: 1.5,
            });
          }
        });
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="hero__area-2">
        <div className="hero__inner-2">
          <div className="sec-title-wrapper">
            <h2 className="sec-title-3 bg-shape">
              We Design <br />
              Unique
            </h2>
            <h2 className="sec-title-3">
              Digital <br />
              Experience
            </h2>
          </div>
          <div className="hero__text-2">
            <p>
              Thinking, writing and planning with brand are just a of what we
              do. For more than 10 years, It’s more competitive space for
              agency.
            </p>
            <div className="hero__button btn_wrapper" ref={btnWrapper}>
              <Link href="/service" className="wc-btn-pink btn-hover btn-item">
                <span></span>
                Explore <br />
                our services <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="hero2-shape">
          <Image
            priority
            style={{ width: "auto", height: "auto" }}
            src={Home7sh1}
            alt="BG Shape"
          />
        </div>
      </section>
    </>
  );
};

export default DesignStudioHero;
