import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "@/plugins";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link.js";
import ArrowDownBig from "../../../public/assets/imgs/icon/arrow-down-big.png";
const Hero1bg = "/images/hero-background.webp";
import Image from "next/image.js";

const DigitalAgencyHero = () => {
  const heroTitle = useRef();
  const heroSubTitle = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        gsap.set(".experience", {
          y: 50,
          opacity: 0,
        });
        let split_hero__title = new SplitText(heroTitle.current, {
          type: "chars",
        });
        let split_hero__subtitle = new SplitText(heroSubTitle.current, {
          type: "chars words",
        });

        gsap.from(split_hero__title.chars, {
          duration: 1,
          x: 70,
          autoAlpha: 0,
          stagger: 0.1,
        });
        gsap.from(
          split_hero__subtitle.words,
          { duration: 1, x: 50, autoAlpha: 0, stagger: 0.05 },
          "-=1"
        );

        gsap.to(
          ".experience",
          {
            y: 0,
            opacity: 1,
            duration: 2,
            ease: "power2.out",
          },
          "-=1.5"
        );
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="hero__area ">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="hero__content animation__hero_one">
                <Link href="/service">
                  Your Partner for a Powerful Online Presence{" "}
                  <span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Link>
                <div className="hero__title-wrapper">
                  <h1 className="hero__title" ref={heroTitle}>
                    NOVA IMPACT
                  </h1>
                </div>
                <p className="hero__sub-title" ref={heroSubTitle} style={{ position: "relative", right: "auto", bottom: "auto", marginTop: "-25px", maxWidth: "600px" }}>
                  From website creation to the deployment of your SEO and advertising campaigns, Nova Impact supports you in converting, retaining, and expanding your reach.
                </p>
                <Image
                  priority
                  width={170}
                  style={{ height: "auto" }}
                  src={ArrowDownBig}
                  alt="Arrow Down Icon"
                />
                <div className="experience">
                  <p>
                    From website creation to digital campaigns — solutions tailored to your business goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Image
          priority
          width={1920}
          height={1080}
          style={{ width: "auto", height: "auto" }}
          src={Hero1bg}
          alt="image"
          className="hero1_bg"
        />
      </section>
    </>
  );
};

export default DigitalAgencyHero;
