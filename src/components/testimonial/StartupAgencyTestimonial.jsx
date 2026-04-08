import { FreeMode, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
const Testimonial41 = "/images/team-member-female-1.webp";
const Testimonial42 = "/images/team-member-female-2.webp";
const Testimonial43 = "/images/team-member-male-2.webp";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

const StartupAgencyTestimonial = () => {
  return (
    <>
      <section className="testimonial__area-4 ">
        <div className="container g-0 line_4">
          <div className="line-col-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="row">
            <div className="col-xxl-12">
              <div className="testimonial__sec-title text-anim">
                <h2 className="sec-subtile-6">Testimonials</h2>
                <h3 className="sec-title-6 title-anim">What Our Clients Say</h3>
                <p>
                  Trusted by businesses who wanted to grow, scale, and stand out online.
                </p>
              </div>
            </div>
            <div className="testimonial__slider-4">
              <Swiper
                modules={[FreeMode, Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={3}
                freeMode={true}
                loop={true}
                speed={2000}
                navigation={{
                  prevEl: ".prev-button",
                  nextEl: ".next-button",
                }}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                pagination={{
                  el: ".pagination",
                  type: "fraction",
                }}
                className="swiper testimonial__slider-4"
              >
                <div className="swiper-wrapper">
                  <SwiperSlide>
                    <div className="testimonial__slide-4">
                      <Image priority width={85} height={85} className="testimonial__img-4" src={Testimonial41} alt="Testimonial Image" />
                      <div className="testimonial__info-4">
                        <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "1.5rem", marginBottom: "0.75rem", display: "block" }}></i>
                        <p>Nova Impact transformed our online presence. Our traffic and conversions improved dramatically within months. Their team delivered results that exceeded our expectations.</p>
                        <h4 className="testimonial__feedback-4" style={{ color: "#000" }}>Transformed our online presence</h4>
                        <h5 className="testimonial__name-4">Zoom Assurance</h5>
                        <h6 className="testimonial__role-4">Client</h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial__slide-4">
                      <Image priority width={85} height={85} className="testimonial__img-4" src={Testimonial42} alt="Testimonial Image" />
                      <div className="testimonial__info-4">
                        <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "1.5rem", marginBottom: "0.75rem", display: "block" }}></i>
                        <p>A professional and responsive team. They understood our needs and delivered beyond expectations. Working with Nova Impact felt like having a true growth partner by our side.</p>
                        <h4 className="testimonial__feedback-4" style={{ color: "#000" }}>Beyond expectations</h4>
                        <h5 className="testimonial__name-4">JBSWITCH</h5>
                        <h6 className="testimonial__role-4">Client</h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial__slide-4">
                      <Image priority width={85} height={85} className="testimonial__img-4" src={Testimonial43} alt="Testimonial Image" />
                      <div className="testimonial__info-4">
                        <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "1.5rem", marginBottom: "0.75rem", display: "block" }}></i>
                        <p>Excellent collaboration from start to finish. Clear strategy, great execution, and strong results. Nova Impact is more than an agency — they are a committed partner in our growth.</p>
                        <h4 className="testimonial__feedback-4" style={{ color: "#000" }}>Clear strategy, strong results</h4>
                        <h5 className="testimonial__name-4">Mutuelle Pro Santé</h5>
                        <h6 className="testimonial__role-4">Client</h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial__slide-4">
                      <Image priority width={85} height={85} className="testimonial__img-4" src={Testimonial41} alt="Testimonial Image" />
                      <div className="testimonial__info-4">
                        <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "1.5rem", marginBottom: "0.75rem", display: "block" }}></i>
                        <p>Nova Impact transformed our online presence. Our traffic and conversions improved dramatically within months. Their team delivered results that exceeded our expectations.</p>
                        <h4 className="testimonial__feedback-4" style={{ color: "#000" }}>Transformed our online presence</h4>
                        <h5 className="testimonial__name-4">Zoom Assurance</h5>
                        <h6 className="testimonial__role-4">Client</h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial__slide-4">
                      <Image priority width={85} height={85} className="testimonial__img-4" src={Testimonial42} alt="Testimonial Image" />
                      <div className="testimonial__info-4">
                        <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "1.5rem", marginBottom: "0.75rem", display: "block" }}></i>
                        <p>A professional and responsive team. They understood our needs and delivered beyond expectations. Working with Nova Impact felt like having a true growth partner by our side.</p>
                        <h4 className="testimonial__feedback-4" style={{ color: "#000" }}>Beyond expectations</h4>
                        <h5 className="testimonial__name-4">JBSWITCH</h5>
                        <h6 className="testimonial__role-4">Client</h6>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="testimonial__slide-4">
                      <Image priority width={85} height={85} className="testimonial__img-4" src={Testimonial43} alt="Testimonial Image" />
                      <div className="testimonial__info-4">
                        <i className="fa-solid fa-quote-left" style={{ color: "#FFC81A", fontSize: "1.5rem", marginBottom: "0.75rem", display: "block" }}></i>
                        <p>Excellent collaboration from start to finish. Clear strategy, great execution, and strong results. Nova Impact is more than an agency — they are a committed partner in our growth.</p>
                        <h4 className="testimonial__feedback-4" style={{ color: "#000" }}>Clear strategy, strong results</h4>
                        <h5 className="testimonial__name-4">Mutuelle Pro Santé</h5>
                        <h6 className="testimonial__role-4">Client</h6>
                      </div>
                    </div>
                  </SwiperSlide>
                </div>
                <div className="testimonial__btn-4">
                  <div
                    style={{ cursor: "pointer" }}
                    className="next-button swipper-btn"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    className="prev-button swipper-btn"
                  >
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                  <div className="pagination testimonial__pagination-4">
                    <div className="pag"></div>
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

export default StartupAgencyTestimonial;
