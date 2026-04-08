import { Navigation, Pagination, Autoplay, EffectFade } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Portfilio31 from "../../../public/assets/imgs/portfolio/3/1.jpg";
import Portfilio32 from "../../../public/assets/imgs/portfolio/3/2.jpg";
import Portfilio33 from "../../../public/assets/imgs/portfolio/3/3.jpg";
import Portfilio34 from "../../../public/assets/imgs/portfolio/3/4.jpg";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const DigitalMarketingProtfolio = () => {
  return (
    <>
      <section className="portfolio__area-3">
        <div className="container pt-100 pb-150">
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper">
                <h2 className="sec-sub-title title-anim">
                  Featured <br />
                  Work
                </h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-12 portfolio__slider-3">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                effectfade="true"
                loop={true}
                speed={1500}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  prevEl: ".pp-prev",
                  nextEl: ".pp-next",
                }}
                pagination={{ el: ".swiper-pagination", type: "fraction" }}
              >
                <div className="swiper-wrapper">
                  <SwiperSlide>
                    <div className="portfolio__slide-3">
                      <Link href="/service-details">
                        <h3 className="portfolio__title-3">
                          Benjon <span>Website</span> 2012
                        </h3>
                        <Image
                          priority
                          width={550}
                          style={{ height: "auto" }}
                          src={Portfilio32}
                          alt="Portfolio Image"
                        />
                      </Link>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="portfolio__slide-3">
                      <Link href="/service-details">
                        <h3 className="portfolio__title-3">
                          Benjon <span>Website</span> 2012
                        </h3>
                        <Image
                          priority
                          width={550}
                          style={{ height: "auto" }}
                          src={Portfilio31}
                          alt="Portfolio Image"
                        />
                      </Link>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="portfolio__slide-3">
                      <Link href="/service-details">
                        <h3 className="portfolio__title-3">
                          Benjon <span>Website</span> 2012
                        </h3>
                        <Image
                          priority
                          width={550}
                          style={{ height: "auto" }}
                          src={Portfilio33}
                          alt="Portfolio Image"
                        />
                      </Link>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="portfolio__slide-3">
                      <Link href="/service-details">
                        <h3 className="portfolio__title-3">
                          Benjon <span>Website</span> 2012
                        </h3>
                        <Image
                          priority
                          width={550}
                          style={{ height: "auto" }}
                          src={Portfilio34}
                          alt="Portfolio Image"
                        />
                      </Link>
                    </div>
                  </SwiperSlide>
                </div>

                <div className="swiper-pagination"></div>

                <div className="swiper-btn">
                  <div style={{ cursor: "pointer" }} className="pp-prev">
                    <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                  </div>
                  <div style={{ cursor: "pointer" }} className="pp-next">
                    <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
                  </div>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingProtfolio;
