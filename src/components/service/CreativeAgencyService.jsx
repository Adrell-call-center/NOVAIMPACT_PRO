import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollSmoother } from "@/plugins";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const CreativeAgencyService = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        let animation_services_7 = gsap.utils.toArray(
          ".animation_service_7 .service__item-7"
        );
        gsap.set(animation_services_7, {
          opacity: 0,
          x: -30,
        });

        if (animation_services_7) {
          if (device_width < 1023) {
            animation_services_7.forEach((item, i) => {
              gsap.to(item, {
                scrollTrigger: {
                  trigger: item,
                  start: "top center+=200",
                  markers: false,
                },
                opacity: 1,
                x: -0,
                ease: "power2.out",
                duration: 2,
                stagger: {
                  each: 0.4,
                },
              });
            });
          } else {
            gsap.to(".animation_service_7 .service__item-7", {
              scrollTrigger: {
                trigger: ".animation_service_7",
                start: "top center+=200",
                markers: false,
              },
              opacity: 1,
              x: 0,
              ease: "power2.out",
              duration: 2,
              stagger: {
                each: 0.4,
              },
            });
          }
        }
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="service__area-7 pt-130">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="service__items-7 animation_service_7">
                <div className="service__item-7">
                  <Link href="/service-details">
                    <h3 className="service__title-7">
                      Branding <span>design</span>
                    </h3>
                  </Link>
                  <p>
                    We help brands stand out through aweful, elegant visual
                    design. Our design mainly philosophy.
                  </p>
                  <ul>
                    <li>+ Logo Design</li>
                    <li>+ Advertisement</li>
                    <li>+ Promotion</li>
                  </ul>
                </div>
                <div className="service__item-7">
                  <Link href="/service-details">
                    <h3 className="service__title-7">
                      Interactive <span>Design</span>{" "}
                    </h3>
                  </Link>
                  <p>
                    We help brands stand out through aweful, elegant visual
                    design. Our design mainly philosophy.
                  </p>
                  <ul>
                    <li>+ Logo Design</li>
                    <li>+ Advertisement</li>
                    <li>+ Promotion</li>
                  </ul>
                </div>
                <div className="service__item-7">
                  <Link href="/service-details">
                    <h3 className="service__title-7">
                      Web & Mobile <span>Development</span>{" "}
                    </h3>
                  </Link>
                  <p>
                    We help brands stand out through aweful, elegant visual
                    design. Our design mainly philosophy.
                  </p>
                  <ul>
                    <li>+ Logo Design</li>
                    <li>+ Advertisement</li>
                    <li>+ Promotion</li>
                  </ul>
                </div>
                <div className="service__item-7">
                  <Link href="/service-details">
                    <h3 className="service__title-7">
                      Digital <span> Marketing</span>{" "}
                    </h3>
                  </Link>
                  <p>
                    We help brands stand out through aweful, elegant visual
                    design. Our design mainly philosophy.
                  </p>
                  <ul>
                    <li>+ Logo Design</li>
                    <li>+ Advertisement</li>
                    <li>+ Promotion</li>
                  </ul>
                </div>
                <div className="service__item-7">
                  <Link href="/service-details">
                    <h3 className="service__title-7">
                      Business <span>Strategy</span>
                    </h3>
                  </Link>
                  <p>
                    We help brands stand out through aweful, elegant visual
                    design. Our design mainly philosophy.
                  </p>
                  <ul>
                    <li>+ Logo Design</li>
                    <li>+ Advertisement</li>
                    <li>+ Promotion</li>
                  </ul>
                </div>
                <div className="service__item-7">
                  <Link href="/service-details">
                    <h3 className="service__title-7">
                      Illustration <span>Modelling</span>{" "}
                    </h3>
                  </Link>
                  <p>
                    We help brands stand out through aweful, elegant visual
                    design. Our design mainly philosophy.
                  </p>
                  <ul>
                    <li>+ Logo Design</li>
                    <li>+ Advertisement</li>
                    <li>+ Promotion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreativeAgencyService;
