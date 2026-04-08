import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";

gsap.registerPlugin(ScrollTrigger);

const AboutCounter = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        gsap.set(".counter_animation .counter__anim", { y: -100, opacity: 0 });
        if (window.innerWidth < 1023) {
          gsap.utils.toArray(".counter_animation .counter__anim").forEach((item) => {
            gsap.timeline({ scrollTrigger: { trigger: item, start: "top center+=200" } })
              .to(item, { y: 0, opacity: 1, ease: "bounce", duration: 1.5 });
          });
        } else {
          gsap.to(".counter_animation .counter__anim", {
            scrollTrigger: { trigger: ".counter_animation", start: "top center+=300" },
            y: 0, opacity: 1, ease: "bounce", duration: 1.5,
            stagger: { each: 0.3 },
          });
        }
      });
      return () => tHero.revert();
    }
  }, []);

  return (
    <>
      <section className="counter__area">
        <div className="container g-0 line pb-140 pt-140">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-12">
              <div className="counter__wrapper-2 counter_animation">
                <div className="counter__item-2 counter__anim">
                  <h2 className="counter__number">50+</h2>
                  <p>Projects<br />Delivered</p>
                  <span className="counter__border"></span>
                </div>
                <div className="counter__item-2 counter__anim">
                  <h2 className="counter__number">30+</h2>
                  <p>Happy<br />Clients</p>
                  <span className="counter__border"></span>
                </div>
                <div className="counter__item-2 counter__anim">
                  <h2 className="counter__number">3</h2>
                  <p>Countries<br />Served</p>
                  <span className="counter__border"></span>
                </div>
                <div className="counter__item-2 counter__anim">
                  <h2 className="counter__number">97%</h2>
                  <p>Client<br />Satisfaction</p>
                  <span className="counter__border"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutCounter;
