import { useEffect } from "react";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";

gsap.registerPlugin(ScrollTrigger);

import "swiper/css";
import "swiper/css/free-mode";

const DigitalAgencyWorkflow = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        gsap.set(".fade_left", { x: -20, opacity: 0 });
        gsap.to(".fade_left", {
          scrollTrigger: { trigger: ".fade_left", start: "top center+=300" },
          x: 0, opacity: 1, ease: "power2.out", duration: 1,
          stagger: { each: 0.2 },
        });
      });
      return () => tHero.revert();
    }
  }, []);

  const steps = [
    {
      step: "step 01", number: "01", title: "Discovery",
      desc: "We start by understanding your business, your audience, and your goals — asking the right questions to build the right strategy.",
    },
    {
      step: "step 02", number: "02", title: "Strategy",
      desc: "We design a clear, data-driven action plan covering the channels, formats, and timelines that will deliver the best results for your business.",
    },
    {
      step: "step 03", number: "03", title: "Creation",
      desc: "Our team builds the assets — website, visuals, ads, or content — with precision and creativity, always aligned with your brand identity.",
    },
    {
      step: "step 04", number: "04", title: "Launch",
      desc: "We deploy your campaigns and digital tools, ensuring every element is tested, optimized, and ready to perform from day one.",
    },
    {
      step: "step 05", number: "05", title: "Optimization",
      desc: "We monitor results in real time and continuously optimize — adjusting what's needed to improve performance and maximize ROI.",
    },
    {
      step: "step 06", number: "06", title: "Growth",
      desc: "With results validated, we scale what works — expanding reach, increasing conversions, and building long-term digital momentum for your brand.",
    },
  ];

  return (
    <>
      <section className="workflow__area">
        <div className="container g-0 line pt-140 pb-140">
          <div className="line-3"></div>
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper">
                <h2 className="sec-sub-title title-anim">Our Process</h2>
                <h3 className="sec-title title-anim">How we work</h3>
              </div>
            </div>

            <div className="col-xxl-12 workflow__slider">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={0}
                slidesPerView={1}
                freemode="true"
                loop={true}
                speed={2000}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
              >
                <div className="swiper-wrapper">
                  {steps.map((s, i) => (
                    <SwiperSlide key={i}>
                      <div className="workflow__slide fade_left">
                        <h4 className="workflow__step">{s.step}</h4>
                        <h5 className="workflow__number">{s.number}</h5>
                        <h6 className="workflow__title">{s.title}</h6>
                        <p>{s.desc}</p>
                      </div>
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalAgencyWorkflow;
