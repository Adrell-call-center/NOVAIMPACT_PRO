import { useEffect, useRef } from "react";
import Link from "next/link.js";
import Image from "next/image.js";
import animationWordCome from "@/lib/utils/animationWordCome";

const heroImg = "/images/about-hero.webp";

const AboutHero = () => {
  const wordAnim = useRef();
  useEffect(() => {
    animationWordCome(wordAnim.current);
  }, []);
  return (
    <>
      <section className="hero__about">
        <div className="container g-0 line">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-12">
              <div className="hero__about-content">
                <h1 className="hero-title animation__word_come" ref={wordAnim}>
                  A vision driven by innovation, performance, and growth.
                </h1>
                <div className="hero__about-info">
                  <div className="hero__about-btn">
                    <div className="btn_wrapper">
                      <Link
                        href="/contact"
                        className="wc-btn-primary btn-hover btn-item"
                      >
                        <span></span> Book <br />
                        a Call
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="hero__about-text title-anim">
                    <p>
                      We help businesses build a powerful digital presence through strategy, creative design, and performance marketing tailored to their goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row hero__about-row">
            <div className="col-xxl-12">
              <div className="hero__about-video">
                <Image
                  priority
                  width={1600}
                  height={800}
                  style={{ width: "100%", height: "auto" }}
                  src={heroImg}
                  alt="Nova Impact digital agency team collaborating on strategy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHero;
