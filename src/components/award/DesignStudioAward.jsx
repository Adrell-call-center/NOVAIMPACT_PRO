import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Image from "next/image";
import Shape3 from "../../../public/assets/imgs/shape/3.png";

gsap.registerPlugin(ScrollTrigger);

const DesignStudioAward = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        let award_timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".award__text",
            start: "top center+=150",
          },
        });

        gsap.set(".award__text", {
          opacity: 0,
          y: -500,
        });
        award_timeline.to(".award__text", {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "bounce",
        });

        gsap.set(".award__text-2", { opacity: 0, y: -500 });

        award_timeline.to(
          ".award__text-2",
          {
            opacity: 1,
            y: 0,
            duration: 2,
            ease: "bounce",
          },
          "-=1.5"
        );

        award_timeline.to(
          ".award__text",
          {
            x: -100,
            duration: 2,
          },
          "-=1"
        );
        award_timeline.to(
          ".award__text-2",
          {
            x: -100,
            duration: 2,
          },
          "-=1"
        );
        award_timeline.to(
          ".award__text",
          {
            x: 0,
            duration: 2,
          },
          "-=1"
        );
        award_timeline.to(
          ".award__text-2",
          {
            x: 0,
            duration: 2,
          },
          "-=1"
        );
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="award__area pt-130 pb-140">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper pb-140">
                <h2 className="sec-title title-anim">
                  We’re nominated as Agency of the Year amongst best Digital
                  Agencies Worldwide.
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="award__left">
                <h4 className="award__text-2">award</h4>
                <h3 className="award__text">award</h3>
                <Image
                  priority
                  width={88}
                  height={70}
                  src={Shape3}
                  alt="Shape Image"
                  data-speed="1"
                  data-lag="0.2"
                />
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="award__right">
                <p>
                  We’re passionate about doing the best digital innovation we
                  can and pushing new technology to its limits. And we achieve
                  results we’re proud of beyond the realm.
                </p>
                <div className="award__list">
                  <div className="award__item">
                    <p>Dribbble</p>
                    <p>Nominee</p>
                    <p>2021</p>
                  </div>
                  <div className="award__item">
                    <p>Behance</p>
                    <p>Winner</p>
                    <p>2020</p>
                  </div>
                  <div className="award__item">
                    <p>Template UI</p>
                    <p>Nominee</p>
                    <p>2018</p>
                  </div>
                  <div className="award__item">
                    <p>Awwwards</p>
                    <p>Winner</p>
                    <p>2016</p>
                  </div>
                  <div className="award__item">
                    <p>Themeforest</p>
                    <p>Winner</p>
                    <p>2012</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DesignStudioAward;
