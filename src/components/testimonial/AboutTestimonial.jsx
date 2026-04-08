import { FreeMode, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const AboutTestimonial = () => {
  return (
    <>
      <section className="testimonial__area-2">
        <div className="container g-0 line pb-140">
          <span className="line-3"></span>

          <div className="row g-0">
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="testimonial__video">
                <video autoPlay muted loop>
                  <source src="assets/video/testimonial.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
              <div className="testimonial__slider-wrapper-2">
                <div className="testimonial__slider">
                  <Swiper
                    modules={[FreeMode, Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    freeMode={true}
                    loop={true}
                    speed={2000}
                    navigation={{
                      nextEl: ".next-button",
                      prevEl: ".prev-button",
                    }}
                  >
                    <SwiperSlide>
                      <div className="testimonial__slide">
                        <div className="testimonial__inner-2">
                          <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "2rem", marginBottom: "1rem", display: "block" }}></i>
                          <p className="testimonial__text-2">
                            Nova Impact transformed our online presence. Our traffic and conversions improved dramatically within months. Their team understood our goals and delivered results that exceeded our expectations.
                          </p>
                          <h2 className="testimonial__title-2" style={{ color: "#000" }}>
                            Transformed our online presence
                          </h2>
                          <h3 className="testimonial__author">Zoom Assurance</h3>
                          <h4 className="testimonial__role">Client</h4>
                        </div>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="testimonial__slide">
                        <div className="testimonial__inner-2">
                          <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "2rem", marginBottom: "1rem", display: "block" }}></i>
                          <p className="testimonial__text-2">
                            A professional and responsive team. They understood our needs and delivered beyond expectations. Working with Nova Impact felt like having a true growth partner by our side.
                          </p>
                          <h2 className="testimonial__title-2" style={{ color: "#000" }}>
                            Beyond expectations
                          </h2>
                          <h3 className="testimonial__author">JBSWITCH</h3>
                          <h4 className="testimonial__role">Client</h4>
                        </div>
                      </div>
                    </SwiperSlide>

                    <SwiperSlide>
                      <div className="testimonial__slide">
                        <div className="testimonial__inner-2">
                          <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "2rem", marginBottom: "1rem", display: "block" }}></i>
                          <p className="testimonial__text-2">
                            Excellent collaboration from start to finish. Clear strategy, great execution, and strong results. Nova Impact is more than an agency — they are a committed partner in our growth.
                          </p>
                          <h2 className="testimonial__title-2" style={{ color: "#000" }}>
                            Clear strategy, strong results
                          </h2>
                          <h3 className="testimonial__author">Mutuelle Pro Santé</h3>
                          <h4 className="testimonial__role">Client</h4>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>

                <div className="testimonial__pagination">
                  <div style={{ cursor: "pointer" }} className="prev-button">
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                  <div style={{ cursor: "pointer" }} className="next-button">
                    <i className="fa-solid fa-arrow-left"></i>
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

export default AboutTestimonial;
