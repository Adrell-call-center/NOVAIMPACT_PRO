import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, ScrollSmoother } from "@/plugins";
import Link from "next/link";
import Image from "next/image";
const About11 = "/images/about-team-meeting.webp";
const About12 = "/images/nova-impact-ltd-office-agency-london-marketing-agency-london-1.jpg.webp";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const DigitalAgencyAbout = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
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
      <section className="about__area">
        <div className="container line g-0 pt-140 pb-130">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-12">
              <div className="about__title-wrapper">
                <h3 className="sec-title title-anim">
                  We unlock the potential of your business online
                </h3>
              </div>

              <div className="about__content-wrapper">
                <div className="about__img">
                  <div className="img-anim about__img_left">
                    <Image
                      priority
                      width={800}
                      height={1067}
                      style={{ width: "auto", height: "auto" }}
                      src={About11}
                      alt="About Image"
                      data-speed="0.3"
                    />
                  </div>

                  <div className="about__img-right">
                    <Image
                      priority
                      width={220}
                      height={293}
                      style={{ height: "auto" }}
                      src={About12}
                      alt="About Image Right"
                      data-speed="0.5"
                    />
                    <div className="shape">
                      <div className="secondary" data-speed="0.9"></div>
                      <div className="primary"></div>
                    </div>
                  </div>
                </div>

                <div className="about__content text-anim">
                  <p>
                    At Nova Impact, we combine creativity, technology, and data-driven marketing to build digital experiences that convert visitors into customers. Based in London and Marseille, we work with ambitious brands across the UK, France, Morocco, and internationally.
                  </p>
                  <p>
                    Whether you need a high-performance website, a full SEO strategy, paid advertising campaigns, or a complete brand identity — we have the expertise to deliver measurable results. Every project starts with a clear goal and ends with a stronger business.
                  </p>
                  <p>
                    We believe in full transparency, long-term partnerships, and one standard for every project: does it grow your business? That's the question behind every decision we make.
                  </p>

                  <div className="cursor-btn btn_wrapper">
                    <Link
                      className="btn-item wc-btn-primary btn-hover"
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
        </div>
      </section>
    </>
  );
};

export default DigitalAgencyAbout;
