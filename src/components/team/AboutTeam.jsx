import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { gsap } from "gsap";
const Team1 = "/images/team-member-male-1.webp";
const Team2 = "/images/team-member-female-1.webp";
const Team3 = "/images/team-member-male-2.webp";
const Team4 = "/images/team-member-female-2.webp";
const ZackMeg = "/images/ZACK-MG.webp";
const MoOmri = "/images/Mo-Omri.webp";
const SimoAdrif = "/images/Simo-Adrif.webp";
const AminaAdam = "/images/Amira-Adam.webp";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import Link from "next/link";
import Image from "next/image";

const AboutTeam = () => {
  if (typeof window !== "undefined") {
    document.addEventListener("mousemove", mousemoveHandler);
  }
  function mousemoveHandler(e) {
    let team_cursor = document.getElementById("team_cursor");
    try {
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
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <section className="team__area pt-140 pb-140">
        <div className="sec-title-wrapper">
          <h2 className="sec-sub-title title-anim">Our Team</h2>
          <h3 className="sec-title title-anim">How we work</h3>
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
                <Link href="/team">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                    <Image
                      priority
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{ objectFit: "cover", objectPosition: "top center" }}
                      src={SimoAdrif}
                      alt="Simo Adrif"
                    />
                  </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Simo Adrif</h4>
                    <h5 className="team__member-role">Founder & Product Architect</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={ZackMeg}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Zack Meg</h4>
                    <h5 className="team__member-role">DevOps Engineer / SaaS Builder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={MoOmri}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Mo Omri</h4>
                    <h5 className="team__member-role">Web Developer / AI Engineer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={ZackMeg}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Zack Meg</h4>
                    <h5 className="team__member-role">DevOps Engineer / SaaS Builder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={MoOmri}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Mo Omri</h4>
                    <h5 className="team__member-role">Web Developer / AI Engineer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={ZackMeg}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Zack Meg</h4>
                    <h5 className="team__member-role">DevOps Engineer / SaaS Builder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={MoOmri}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Mo Omri</h4>
                    <h5 className="team__member-role">Web Developer / AI Engineer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={ZackMeg}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Zack Meg</h4>
                    <h5 className="team__member-role">DevOps Engineer / SaaS Builder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={MoOmri}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Mo Omri</h4>
                    <h5 className="team__member-role">Web Developer / AI Engineer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={ZackMeg}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Zack Meg</h4>
                    <h5 className="team__member-role">DevOps Engineer / SaaS Builder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={MoOmri}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Mo Omri</h4>
                    <h5 className="team__member-role">Web Developer / AI Engineer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={ZackMeg}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Zack Meg</h4>
                    <h5 className="team__member-role">DevOps Engineer / SaaS Builder</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team-details">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={MoOmri}
                        alt="Zack Meg"
                      />
                    </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Mo Omri</h4>
                    <h5 className="team__member-role">Web Developer / AI Engineer</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          
            <SwiperSlide>
              <div className="team__slide">
                <Link href="/team">
                  <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                    <Image
                      priority
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{ objectFit: "cover", objectPosition: "top center" }}
                      src={AminaAdam}
                      alt="Amira Adam"
                    />
                  </div>
                  <div className="team__info">
                    <h4 className="team__member-name">Amira Adam</h4>
                    <h5 className="team__member-role">SEO Specialist / SEO Manager</h5>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default AboutTeam;
