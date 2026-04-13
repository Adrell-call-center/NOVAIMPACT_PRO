import { useEffect } from "react";
import { Power1, gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";

gsap.registerPlugin(ScrollTrigger);

const DigitalAgencyCounter = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".counter_animation .counter__anim", { y: -100, opacity: 0 });
        if (device_width < 1023) {
          const counterArray = gsap.utils.toArray(
            ".counter_animation .counter__anim"
          );
          counterArray.forEach((item, i) => {
            let counterTl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top center+=200",
              },
            });
            counterTl.to(item, {
              y: 0,
              opacity: 1,
              ease: "bounce",
              duration: 1.5,
            });
          });
        } else {
          gsap.to(".counter_animation .counter__anim", {
            scrollTrigger: {
              trigger: ".counter_animation",
              start: "top center+=300",
            },
            y: 0,
            opacity: 1,
            ease: "bounce",
            duration: 1.5,
            stagger: {
              each: 0.3,
            },
          });
        }
        for (let i = 1; i < 5; i++) {
          gsap.from(gsap.utils.toArray(`.count${i}`), {
            textContent: 0,
            duration: 1,
            delay: 0.3,
            ease: Power1.easeIn,
            snap: { textContent: 1 },
            stagger: 1,
            scrollTrigger: {
              trigger: `.counter__number`,
            },
          });
        }
      });
      ScrollTrigger.refresh();
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="counter__area">
        <div className="container g-0 line pt-150">
          <span className="line-3"></span>

          <div className="row">
            <div className="col-xxl-12">
              <div className="counter__wrapper counter_animation">
                <div className="counter__item counter__anim">
                  <h2 className="counter__number">+340%</h2>
                  <p>
                    Average organic <br />
                    traffic growth
                  </p>
                  <span className="counter__border"></span>
                </div>
                <div className="counter__item counter__anim">
                  <h2 className="counter__number">50+</h2>
                  <p>
                    Projects <br />
                    delivered
                  </p>
                  <span className="counter__border"></span>
                </div>
                <div className="counter__item counter__anim">
                  <h2 className="counter__number">97%</h2>
                  <p>
                    Client <br />
                    satisfaction
                  </p>
                  <span className="counter__border"></span>
                </div>
                <div className="counter__item counter__anim">
                  <h2 className="counter__number">3×</h2>
                  <p>
                    More leads vs <br />
                    industry average
                  </p>
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

export default DigitalAgencyCounter;
