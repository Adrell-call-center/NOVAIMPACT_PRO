import { useEffect, useRef, useState } from "react";
import { Navigation, Thumbs, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Portfolio11 from "../../../public/assets/imgs/portfolio/1/1.jpg";
import Portfolio12 from "../../../public/assets/imgs/portfolio/1/2.jpg";
import Portfolio13 from "../../../public/assets/imgs/portfolio/1/3.jpg";
import Portfolio14 from "../../../public/assets/imgs/portfolio/1/4.jpg";
import Link from "next/link";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import animationCharCome from "@/lib/utils/animationCharCome";

const PortfolioElementV5 = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);
  return (
    <>
      <section className="portfolio-v5 portfolio__project">
        <div className="container line">
          <div className="line-3"></div>
          <div className="row pt-130 pb-100">
            <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                  Awesome <br />
                  Projects
                </h2>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
              <div className="blog__text">
                <p>
                  Crafting new bright brands, unique visual systems and digital
                  experience focused on a wide range of original collabs.{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-12">
              <div className="pp-title-wrap">
                <h2 className="pp-title">
                  Selected <br /> Work
                </h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-9 col-xl-9 col-lg-9 col-md-8">
              <div className="pp-slider-wrapper">
                <Swiper
                  modules={[Navigation, Thumbs]}
                  spaceBetween={10}
                  loop={true}
                  navigation={{
                    nextEl: ".pp-next",
                    prevEl: ".pp-prev",
                  }}
                  thumbs={{
                    swiper:
                      thumbsSwiper && !thumbsSwiper.destroyed
                        ? thumbsSwiper
                        : null,
                  }}
                >
                  <div className="swiper-wrapper">
                    <SwiperSlide>
                      <div className="pp-slide">
                        <div className="pp-slide-img">
                          <Link href="/portfolio-details">
                            <Image
                              priority
                              width={520}
                              style={{ height: "auto" }}
                              src={Portfolio11}
                              alt="Portfolio Thumbnail"
                            />
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="pp-slide">
                        <div className="pp-slide-img">
                          <Link href="/portfolio-details">
                            <Image
                              priority
                              width={520}
                              style={{ height: "auto" }}
                              src={Portfolio12}
                              alt="Portfolio Thumbnail"
                            />
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="pp-slide">
                        <div className="pp-slide-img">
                          <Link href="/portfolio-details">
                            <Image
                              priority
                              width={520}
                              style={{ height: "auto" }}
                              src={Portfolio13}
                              alt="Portfolio Thumbnail"
                            />
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="pp-slide">
                        <div className="pp-slide-img">
                          <Link href="/portfolio-details">
                            <Image
                              priority
                              width={520}
                              style={{ height: "auto" }}
                              src={Portfolio14}
                              alt="Portfolio Thumbnail"
                            />
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  </div>
                </Swiper>

                <div
                  style={{ cursor: "pointer" }}
                  className="pp-next swipper-btn"
                >
                  prev
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  className="pp-prev swipper-btn"
                >
                  Next
                </div>
              </div>
            </div>

            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4">
              <Swiper
                // modules={[Thumbs, FreeMode]}
                spaceBetween={10}
                // loop={true}
                slidespreview={1}
                // freeMode={true}
                // watchSlidesProgress
                allowTouchMove={false}
                className="portfolio__project-thumbs"
                onSwiper={setThumbsSwiper}
              >
                <SwiperSlide>
                  <div className="pp-slide-thumb">
                    <h3 className="pp-slide-title">Apple book cover</h3>
                    <p>March 2021</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="pp-slide-thumb">
                    <h3 className="pp-slide-title">Apple book cover</h3>
                    <p>March 2021</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="pp-slide-thumb">
                    <h3 className="pp-slide-title">Apple book cover</h3>
                    <p>March 2021</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="pp-slide-thumb">
                    <h3 className="pp-slide-title">Apple book cover</h3>
                    <p>March 2021</p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioElementV5;
