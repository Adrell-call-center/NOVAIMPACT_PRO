import { useEffect, useRef } from "react";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { gsap } from "gsap";
import Team11 from "../../../public/assets/imgs/team/1.jpg";
import Team12 from "../../../public/assets/imgs/team/2.jpg";
import Team13 from "../../../public/assets/imgs/team/3.jpg";
import Team14 from "../../../public/assets/imgs/team/4.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import Link from "next/link.js";
import Image from "next/image.js";
import animationCharCome from "@/lib/utils/animationCharCome";

const Team1 = () => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);
  if (typeof window !== "undefined") {
    document.addEventListener("mousemove", mousemoveHandler);
  }
  function mousemoveHandler(e) {
    let team_cursor = document.getElementById("team_cursor");
    const target = e.target;
    let tHero = gsap.context(() => {
      let tl = gsap.timeline({
        defaults: {
          x: e.clientX,
          y: e.clientY,
        },
      });
      let t2 = gsap.timeline({
        defaults: {
          x: e.clientX,
          y: e.clientY,
        },
      });

      // Team Page Team Cursor
      if (target.closest(".team__slider")) {
        tl.to(
          team_cursor,
          {
            opacity: 1,
            ease: "power4.out",
          },
          "-=0.3"
        );
      } else {
        t2.to(
          team_cursor,
          {
            opacity: 0,
            ease: "power4.out",
          },
          "-=0.3"
        );
      }
    });
    return () => tHero.revert();
  }
  return (
    <>
      <section className="team__area-6">
        <div className="container line pt-120">
          <span className="line-3"></span>

          <div className="row">
            <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 offset-xxl-4 offset-xl-4">
              <div className="sec-title-wrapper">
                <h2 className="sec-title animation__char_come" ref={charAnim}>
                  Our Team{" "}
                </h2>
                <p>
                  A team of passionate digital experts — designers, strategists, and marketers — dedicated to growing your business online.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="team__slider">
          <Swiper
            modules={[FreeMode]}
            spaceBetween={30}
            slidesPerView={1}
            freeMode={true}
            loop={true}
            speed={2000}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1000: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4,
              },
            }}
          >
            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team11}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Saymon D. Halk</h4>
                    <h5 className="team__member-role-6">CEO & Founder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team12}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Jassica Oliver</h4>
                    <h5 className="team__member-role-6">SEO Strategist</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team13}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Daniyel Adamson</h4>
                    <h5 className="team__member-role-6">Digital Marketing Manager</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team14}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Hardiya Kethrine</h4>
                    <h5 className="team__member-role-6">Lead Designer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team12}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Saymon D. Halk</h4>
                    <h5 className="team__member-role-6">CEO & Founder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team13}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Jassica Oliver</h4>
                    <h5 className="team__member-role-6">SEO Strategist</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team11}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Saymon D. Halk</h4>
                    <h5 className="team__member-role-6">CEO & Founder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team12}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Jassica Oliver</h4>
                    <h5 className="team__member-role-6">SEO Strategist</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team13}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Daniyel Adamson</h4>
                    <h5 className="team__member-role-6">Digital Marketing Manager</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team14}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Hardiya Kethrine</h4>
                    <h5 className="team__member-role-6">Lead Designer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team12}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Saymon D. Halk</h4>
                    <h5 className="team__member-role-6">CEO & Founder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    src={Team13}
                    alt="Team Member"
                  />
                  <div className="team__info">
                    <h4 className="team__member-name-6">Jassica Oliver</h4>
                    <h5 className="team__member-role-6">SEO Strategist</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="container line pt-150">
          <div className="line-3"></div>
        </div>

        <div className="team__join-btn">
          <div className="btn_wrapper">
            <Link href="/contact" className="wc-btn-primary btn-item btn-hover">
              <span></span> Join Our <br />
              Team
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
      <section className="team__btm">
        <div className="container g-0 line">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper pt-130 pb-140 text-anim">
                <h2 className="sec-title title-anim">
                  Your digital growth powered by our dedicated team
                </h2>
                <p>
                  More than a team — a growth partner. Our experts in design, SEO, ads, and content work together to deliver measurable results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Team1;
