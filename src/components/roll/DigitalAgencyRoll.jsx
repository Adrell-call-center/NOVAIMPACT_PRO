import { FreeMode, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";

const items = [
  "Website Creation", "SEO", "Meta Ads", "Google Ads",
  "Social Media", "Brand Identity", "Content Creation",
  "Lead Generation", "Strategy", "Performance Marketing",
  "Website Creation", "SEO", "Meta Ads", "Google Ads",
  "Social Media", "Brand Identity", "Content Creation",
  "Lead Generation", "Strategy", "Performance Marketing",
];

const DigitalAgencyRoll = () => {
  return (
    <>
      <section className="roll__area">
        <div className="roll__slider">
          <Swiper
            modules={[FreeMode, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            freeMode={true}
            loop={true}
            centeredSlides={true}
            allowTouchMove={false}
            speed={2000}
            autoplay={{ delay: 1, disableOnInteraction: true }}
            breakpoints={{
              640: { slidesPerView: 3 },
              800: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1300: { slidesPerView: 5 },
              1900: { slidesPerView: 8 },
            }}
          >
            {items.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="roll__slide">
                  <h2>{item}</h2>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default DigitalAgencyRoll;
