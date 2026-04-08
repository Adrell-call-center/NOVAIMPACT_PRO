import { useEffect, useRef } from "react";
import { gsap } from "gsap";
const Testimonial11 = "/images/team-member-female-1.webp";
const Testimonial12 = "/images/team-member-female-2.webp";
const Testimonial13 = "/images/team-member-male-2.webp";
import Image from "next/image";

const DigitalAgencyTestimonial = ({
  modalTestimonial1,
  modalTestimonial2,
  modalTestimonial3,
  modalClose1,
  modalClose2,
  modalClose3,
}) => {
  const testimonialArea = useRef();
  const modalTrigger1 = useRef();
  const modalTrigger2 = useRef();
  const modalTrigger3 = useRef();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let testimonial = testimonialArea.current;
      if (testimonial) {
        // Testimonial Modal 1
        var modal_testimonial = modalTestimonial1.current;
        var modal_trigger = modalTrigger1.current;
        var modal_close = modalClose1.current;

        modal_trigger.addEventListener("click", function () {
          modal_testimonial.classList.add("modal-show");
        });
        modal_close.addEventListener("click", function () {
          modal_testimonial.classList.remove("modal-show");
        });

        // Testimonial Modal 2
        var modal_testimonial_2 = modalTestimonial2.current;
        var modal_trigger_2 = modalTrigger2.current;
        var modal_close_2 = modalClose2.current;

        modal_trigger_2.addEventListener("click", function () {
          modal_testimonial_2.classList.add("modal-show");
        });
        modal_close_2.addEventListener("click", function () {
          modal_testimonial_2.classList.remove("modal-show");
        });

        // Testimonial Modal 3
        var modal_testimonial_3 = modalTestimonial3.current;
        var modal_trigger_3 = modalTrigger3.current;
        var modal_close_3 = modalClose1.current;

        modal_trigger_3.addEventListener("click", function () {
          modal_testimonial_3.classList.add("modal-show");
        });
        modal_close_3.addEventListener("click", function () {
          modal_testimonial_3.classList.remove("modal-show");
        });
      }
      imageMoving(testimonial, ".testimonial__img img");
    }
  }, [
    modalTestimonial1,
    modalTestimonial2,
    modalTestimonial3,
    modalClose1,
    modalClose2,
    modalClose3,
  ]);

  function imageMoving(wrapper, image_list) {
    let container = wrapper;
    try {
      if (container) {
        container.addEventListener("mousemove", (e) => {
          let tHero = gsap.context(() => {
            var x = e.clientX;
            var y = e.clientY;
            let viewportWidth = window.innerWidth;
            let center = viewportWidth / 2;
            let centerHeight = innerHeight / 2;

            if (x > center) {
              gsap.to(image_list, {
                x: 15,
                duration: 5,
                ease: "power4.out",
              });
            } else {
              gsap.to(image_list, {
                x: -15,
                duration: 5,
                ease: "power4.out",
              });
            }
            if (y > centerHeight) {
              gsap.to(image_list, {
                y: 15,
                duration: 5,
                ease: "power4.out",
              });
            } else {
              gsap.to(image_list, {
                y: -15,
                duration: 5,
                ease: "power4.out",
              });
            }
          });
          return () => tHero.revert();
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <section
        className="testimonial__area"
        style={{ position: "relative" }}
        ref={testimonialArea}
      >
        <div className="container g-0 line">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8">
              <div className="testimonial__wrapper">
                <div className="testimonial__item item-1">
                  <div className="button modal-trigger" ref={modalTrigger1}>
                    <div className="testimonial__img b-right">
                      <Image
                        priority
                        width={330}
                        height={440}
                        style={{ height: "auto" }}
                        src={Testimonial11}
                        alt="Testimonial Image"
                      />
                    </div>

                    <h2 className="testimonial__title">Zoom Assurance</h2>
                    <h3 className="testimonial__role">Client</h3>
                    <p className="testimonial__text">Nova Impact transformed our online presence. Our traffic and conversions improved dramatically within months.</p>
                  </div>
                </div>
                <div className="sec-title-wrapper text-anim">
                  <h4 className="sec-sub-title">Testimonials</h4>
                  <h5 className="sec-title title-anim">
                    What Our Clients Say
                  </h5>
                  <p>
                    Our happy customers give us impactfull and positive feedback
                    on our services, customer supports & etc.
                  </p>
                </div>
              </div>

              <div className="testimonial__item item-2">
                <div className="button modal-trigger-2" ref={modalTrigger2}>
                  <div className="testimonial__img b-left">
                    <Image
                      priority
                      width={220}
                      height={300}
                      src={Testimonial13}
                      alt="Testimonial Image"
                    />
                  </div>

                  <h2 className="testimonial__title">JBSWITCH</h2>
                  <h3 className="testimonial__role">Client</h3>
                  <p className="testimonial__text">A professional and responsive team. They understood our needs and delivered beyond expectations.</p>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <div className="testimonial__item item-3 img-">
                <div className="button modal-trigger-3" ref={modalTrigger3}>
                  <div className="testimonial__img b-left">
                    <Image
                      priority
                      width={260}
                      height={360}
                      src={Testimonial12}
                      alt="Testimonial Image"
                    />
                  </div>

                  <h2 className="testimonial__title">Mutuelle Pro Santé</h2>
                  <h3 className="testimonial__role">Client</h3>
                  <p className="testimonial__text">Excellent collaboration from start to finish. Clear strategy, great execution, and strong results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalAgencyTestimonial;
