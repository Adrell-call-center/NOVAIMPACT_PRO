import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollSmoother } from "@/plugins";
import Link from "next/link";
import Image from "next/image";
import One from "../../../public/assets/imgs/about/2/1.jpg";
import Brand1 from "../../../public/assets/imgs/brand/1.png";
import Brand2 from "../../../public/assets/imgs/brand/2.png";
import Brand3 from "../../../public/assets/imgs/brand/3.png";
import Brand4 from "../../../public/assets/imgs/brand/4.png";
import Brand5 from "../../../public/assets/imgs/brand/5.png";
import Brand6 from "../../../public/assets/imgs/brand/6.png";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const DesignStudioAbout = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.to(".about__img-2 img", {
          scale: 1.15,
          duration: 1,
          scrollTrigger: {
            trigger: ".about__img-2",
            start: "top bottom",
            markers: false,
            scrub: 1,
            end: "bottom center",
          },
        });
        ScrollSmoother.create({
          smooth: 1.35,
          effects: device_width < 1025 ? false : true,
          smoothTouch: false,
          normalizeScroll: false,
          ignoreMobileResize: true,
        });
      });
      return () => tHero.revert();
    }
  }, []);

  return (
    <>
      <section className="about__area-2">
        <div className="container pt-130 pb-110">
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper">
                <h2 className="sec-title title-anim">
                  We design and develop outstanding Digital <br /> Products and
                  digital-first Brands.
                </h2>
              </div>
              <div className="sec-text-wrapper">
                <div className="sec-text text-anim">
                  <p>
                    We help brands stand out through powerful, elegant visual
                    design. Our design philosophy is shaped by our experience
                    growing up at our father’s bookbindery. Surrounded by the
                    highest-quality materials and turn-of-the-century machines,
                    we observed the art of true craftsmanship firsthand.
                  </p>
                </div>
                <div className="sec-btn btn_wrapper">
                  <Link
                    className="wc-btn-pink btn-hover btn-item"
                    href="/about"
                  >
                    <span></span> Explore Us{" "}
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about__img-2 pb-130">
          <Image
            priority
            width={1720}
            style={{ height: "auto" }}
            src={One}
            alt="About Image"
            data-speed="0.2"
          />
        </div>

        <div className="container pb-140">
          <div className="row">
            <div className="col-xxl-12">
              <h2 className="brand__title-2 title-anim">
                We worked with global largest brands
              </h2>
              <div className="brand__list-2">
                <div className="brand__item-2 fade_bottom">
                  <Image
                    priority
                    width={97}
                    height={67}
                    src={Brand1}
                    alt="Brand Logo"
                  />
                </div>
                <div className="brand__item-2 fade_bottom">
                  <Image
                    priority
                    width={85}
                    height={67}
                    src={Brand2}
                    alt="Brand Logo"
                  />
                </div>
                <div className="brand__item-2 fade_bottom">
                  <Image
                    priority
                    width={114}
                    height={64}
                    src={Brand3}
                    alt="Brand Logo"
                  />
                </div>
                <div className="brand__item-2 fade_bottom">
                  <Image
                    priority
                    width={82}
                    height={70}
                    src={Brand4}
                    alt="Brand Logo"
                  />
                </div>
                <div className="brand__item-2 fade_bottom">
                  <Image
                    priority
                    width={115}
                    height={67}
                    src={Brand5}
                    alt="Brand Logo"
                  />
                </div>
                <div className="brand__item-2 fade_bottom">
                  <Image
                    priority
                    width={121}
                    height={63}
                    src={Brand6}
                    alt="Brand Logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DesignStudioAbout;
