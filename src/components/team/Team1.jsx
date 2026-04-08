import { useEffect, useRef } from "react";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { gsap } from "gsap";
const Team11 = "/images/team-member-male-1.webp";
const Team12 = "/images/team-member-female-1.webp";
const Team13 = "/images/team-member-male-2.webp";
const Team14 = "/images/team-member-female-2.webp";
const ZackMeg = "/images/ZACK-MG.webp";
const MoOmri = "/images/Mo-Omri.webp";
const SimoAdrif = "/images/Simo-Adrif.webp";
const AminaAdam = "/images/Amira-Adam.webp";
import "swiper/css";
import "swiper/css/free-mode";
import Link from "next/link.js";
import Image from "next/image.js";
import animationCharCome from "@/lib/utils/animationCharCome";

const members = [
  { img: SimoAdrif, name: "Simo Adrif", role: "Founder & Product Architect",  href: "/team" },
  { img: ZackMeg,   name: "Zack Meg",   role: "DevOps Engineer / SaaS Builder",              href: "/team" },
  { img: MoOmri,    name: "Mo Omri",    role: "Web Developer / AI Engineer",  href: "/team" },
  { img: AminaAdam, name: "Amira Adam", role: "SEO Specialist / SEO Manager", href: "/team" },
];

const Team1 = ({ limit }) => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("mousemove", mousemoveHandler);
      return () => document.removeEventListener("mousemove", mousemoveHandler);
    }
  }, []);

  function mousemoveHandler(e) {
    let team_cursor = document.getElementById("team_cursor");
    if (!team_cursor) return;
    const target = e.target;
    let tHero = gsap.context(() => {
      let tl = gsap.timeline({ defaults: { x: e.clientX, y: e.clientY } });
      if (target.closest(".team__slider")) {
        tl.to(team_cursor, { opacity: 1, ease: "power4.out" }, "-=0.3");
      } else {
        tl.to(team_cursor, { opacity: 0, ease: "power4.out" }, "-=0.3");
      }
    });
    return () => tHero.revert();
  }

  const displayed = limit ? members.slice(0, limit) : members;

  return (
    <>
      <section className="team__area-6">
        <div className="container line pt-120">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8 offset-xxl-4 offset-xl-4">
              <div className="sec-title-wrapper">
                <h2 className="sec-sub-title">Our People</h2>
                <h3 className="sec-title animation__char_come" ref={charAnim}>
                  Meet the Team
                </h3>
                <p>
                  A passionate crew of digital strategists, designers, and growth experts — united by one mission: making your brand succeed online.
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
              640: { slidesPerView: 2 },
              1000: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {[...displayed, ...displayed].map((member, i) => (
              <SwiperSlide key={i}>
                <div className="team__slide">
                  <Link href={member.href}>
                    <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
                      <Image
                        priority
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        style={{ objectFit: "cover", objectPosition: "top center" }}
                        src={member.img}
                        alt={member.name}
                      />
                    </div>
                    <div className="team__info">
                      <h4 className="team__member-name-6">{member.name}</h4>
                      <h5 className="team__member-role-6">{member.role}</h5>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </section>

      <section className="team__btm">
        <div className="container g-0 line">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper pt-80 pb-140 text-anim">
                <h2 className="sec-title title-anim">
                  Your digital growth powered by our dedicated team
                </h2>
                <p>
                  More than a team — a growth partner. Our experts in design, SEO, ads, and content work together to deliver measurable results for your business.
                </p>
                <div style={{ display: "flex", gap: "30px", marginTop: "30px", flexWrap: "wrap" }}>
                  <Link href="/team" style={{ color: "var(--white)", textDecoration: "none", fontSize: "16px", borderBottom: "1px solid var(--primary)", paddingBottom: "4px" }}>
                    Meet Everyone <i className="fa-solid fa-arrow-right" style={{ marginLeft: "8px" }}></i>
                  </Link>
                  <Link href="/contact" style={{ color: "var(--white)", textDecoration: "none", fontSize: "16px", borderBottom: "1px solid var(--primary)", paddingBottom: "4px" }}>
                    Join Our Team <i className="fa-solid fa-arrow-right" style={{ marginLeft: "8px" }}></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Team1;
