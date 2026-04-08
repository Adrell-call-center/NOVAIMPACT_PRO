import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
import Award1 from "../../../public/assets/imgs/awards/awards-01.png";
import Award2 from "../../../public/assets/imgs/awards/awards-02.png";
import Award3 from "../../../public/assets/imgs/awards/awards-03.png";
import Award4 from "../../../public/assets/imgs/awards/awards-04.png";
import Award5 from "../../../public/assets/imgs/awards/awards-05.png";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const ModernAgencyWork2 = () => {
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
      <div className="awards__area-8 pb-130 sp-x">
        <h6 className="text-end about-sub-right">awards</h6>
        <div className="section_wrapper b-100">
          <h4 className="react_border">
            <span>04</span>
          </h4>
        </div>
        <div className="row">
          <div className="col-lg-5">
            <div className="awards__content">
              <h2 className="awards__content__title fade_bottom">
                It’s our <br />
                glory for <br />
                <Link href="/portfolio" className="hover_wrap">
                  awards
                  <span
                    className="hover_img"
                    style={{
                      backgroundImage:
                        "url(assets/imgs/portfolio/detail/7.jpg)",
                    }}
                  ></span>
                </Link>
              </h2>
              <p>
                {
                  "We're passionate about doing the best digital innovation and we achieve results we're proud of."
                }
              </p>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="awards__wrapper">
              <div className="awards__border">
                <div className="awards__items fade_bottom">
                  <span className="number">x2</span>
                  <h4 className="title">
                    Awwwards Interior <br /> Excellence
                  </h4>
                  <Image
                    priority
                    width={67}
                    style={{ height: "auto" }}
                    src={Award2}
                    alt=""
                  />
                  <h5 className="date">2017</h5>
                </div>
                <div className="awards__items fade_bottom">
                  <span className="number">x1</span>
                  <h4 className="title">
                    FWA, <br /> Site of the Day
                  </h4>
                  <Image
                    priority
                    width={93}
                    style={{ height: "auto" }}
                    src={Award5}
                    alt=""
                  />
                  <h5 className="date">2015</h5>
                </div>
                <div className="awards__items fade_bottom">
                  <span className="number">x3</span>
                  <h4 className="title">
                    Architect Design <br /> Awards
                  </h4>
                  <Image
                    priority
                    width={131}
                    style={{ height: "auto" }}
                    src={Award1}
                    alt=""
                  />
                  <h5 className="date">2020</h5>
                </div>
                <div className="awards__items fade_bottom">
                  <span className="number">x2</span>
                  <h4 className="title">
                    Advance High <br /> Technology
                  </h4>
                  <Image
                    priority
                    width={89}
                    style={{ height: "auto" }}
                    src={Award3}
                    alt=""
                  />
                  <h5 className="date">2021</h5>
                </div>
                <div className="awards__items fade_bottom">
                  <span className="number">x2</span>
                  <h4 className="title">
                    Awwwards Interior <br /> Excellence
                  </h4>
                  <Image
                    priority
                    width={67}
                    style={{ height: "auto" }}
                    src={Award2}
                    alt=""
                  />
                  <h5 className="date">2017</h5>
                </div>
                <div className="awards__items fade_bottom">
                  <span className="number">x1</span>
                  <h4 className="title">
                    Digital Agencies <br /> Worldwide
                  </h4>
                  <Image
                    priority
                    width={93}
                    style={{ height: "auto" }}
                    src={Award4}
                    alt=""
                  />
                  <h5 className="date">2015</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernAgencyWork2;
