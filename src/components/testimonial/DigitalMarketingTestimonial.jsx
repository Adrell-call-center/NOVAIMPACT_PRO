import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import { Navigation, FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

gsap.registerPlugin(ScrollTrigger);

const DigitalMarketingTestimonial = () => {
  const testimonialArea = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let tHero = gsap.context(() => {
        gsap.set(".testimonial__slide-3", { opacity: 0, y: 40 });

        gsap.to(".testimonial__slide-3", {
          scrollTrigger: {
            trigger: ".testimonial__area-3",
            start: "top center+=200",
            markers: false,
          },
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 1,
          stagger: {
            each: 0.2,
          },
        });
      });
      return () => tHero.revert();
    }
  }, []);

  const testimonials = [
    {
      quote:
        "Nova Impact transformed our online presence. Our traffic and conversions improved dramatically within months. They truly understand digital strategy and execution.",
      name: "Karim B.",
      role: "CEO, E-Commerce Brand",
    },
    {
      quote:
        "A professional and responsive team. They understood our needs from day one and delivered a website that perfectly represents our brand. Highly recommended!",
      name: "Sophie L.",
      role: "Marketing Director",
    },
    {
      quote:
        "Excellent collaboration from start to finish. Clear strategy, great execution, and strong results. Our social media campaigns now generate real leads.",
      name: "Youssef M.",
      role: "Founder, Startup",
    },
    {
      quote:
        "Working with Nova Impact was a game-changer. They brought creativity, technical expertise, and a genuine understanding of our target audience.",
      name: "Claire D.",
      role: "Brand Manager",
    },
    {
      quote:
        "From website redesign to Meta Ads management, Nova Impact delivered beyond our expectations. The ROI speaks for itself — we saw a 3x return in the first quarter.",
      name: "Antoine R.",
      role: "Managing Director, Agency",
    },
  ];

  return (
    <>
      <section
        className="testimonial__area-3"
        ref={testimonialArea}
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="testimonial__sec-title text-anim" style={{ marginBottom: "60px" }}>
                <h2 className="sec-sub-title">Testimonials</h2>
                <h3 className="sec-title title-anim">What Our Clients Say</h3>
              </div>
              <div>
                <Swiper
                  modules={[Navigation, FreeMode]}
                  spaceBetween={0}
                  slidesPerView={1}
                  freeMode={true}
                  loop={true}
                  speed={2000}
                  navigation={{
                    prevEl: ".prev-button",
                    nextEl: ".next-button",
                  }}
                  className="testimonial__slider-3"
                >
                  <div className="swiper-wrapper">
                    {testimonials.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="testimonial__slide-3">
                          <p>{item.quote}</p>
                          <h2 className="client__name-3">{item.name}</h2>
                          <h3 className="client__role-3">{item.role}</h3>
                        </div>
                      </SwiperSlide>
                    ))}
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    className="next-button swipper-btn"
                  >
                    <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    className="prev-button swipper-btn"
                  >
                    <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
                  </div>
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingTestimonial;
