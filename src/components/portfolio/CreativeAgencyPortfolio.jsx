import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Portfilio11 from "../../../public/assets/imgs/portfolio/1/1.jpg";
import Portfilio12 from "../../../public/assets/imgs/portfolio/1/2.jpg";
import Portfilio13 from "../../../public/assets/imgs/portfolio/1/3.jpg";
const Planostra = "/images/planostra-portfolio.webp";
const ExifInjector = "/images/exifinjector-portfolio.webp";
const TrustedPulse = "/images/trustedpulse-portfolio.webp";
const JeSwitch = "/images/jeswitch-portfolio.webp";
const Mutuelles = "/images/mutuellespashchere-portfolio.webp";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import Link from "next/link";

const projects = [
  { title: "JeSwitch.fr", subtitle: "Insurance Comparison & Lead Generation", img: JeSwitch, link: "https://jeswitch.fr" },
  { title: "ZoomAssurance.fr", subtitle: "Insurance Insights & Guides", img: Portfilio12, link: "https://zoomassurance.fr" },
  { title: "MutuellesPasChere.com", subtitle: "Health Insurance Resource", img: Mutuelles, link: "https://mutuellespaschere.com" },
  { title: "Planostra", subtitle: "Marketing Intelligence & Analytics SaaS", img: Planostra, link: "https://planostra.com" },
  { title: "TrustedPulse", subtitle: "Review & Reputation Platform", img: TrustedPulse, link: "https://trustedpulse.com" },
  { title: "ExifInjector", subtitle: "AI Metadata Optimization for eCommerce", img: ExifInjector, link: "https://exifinjector.com" },
  { title: "AllWorld247.com", subtitle: "Multi-Category Content Portal", img: Portfilio13, link: "https://allworld247.com" },
];

const CreativeAgencyPortfolio = () => {
  return (
    <>
      <section className="portfolio__area-7">
        <div className="container pt-140 pb-100">
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper text-anim">
                <h2 className="sec-title title-anim">Selected Projects</h2>
                <p className="sec-text">
                  Explore our portfolio of successful projects. From website creation and digital campaigns to brand identities — see the impact we've delivered.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="portfolio__slider-7">
          <Swiper
            modules={[FreeMode]}
            spaceBetween={30}
            slidesPerView={1}
            freeMode={true}
            loop={true}
            centeredSlides={true}
            speed={2000}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              800: {
                slidesPerView: 2,
                spaceBetween: 50,
              },
              1200: {
                slidesPerView: 3,
                spaceBetween: 70,
              },
            }}
          >
            {projects.map((project, i) => (
              <SwiperSlide key={i}>
                <div className="portfolio__slide-7">
                  <div className="slide-img">
                    <Link href={project.link}>
                      <Image
                        priority
                        width={520}
                        height={700}
                        style={{ width: "100%", height: "auto", display: "block" }}
                        src={project.img}
                        alt={project.title}
                      />
                    </Link>
                  </div>
                  <div className="slide-content">
                    <Link href={project.link}>
                      <h2 className="title">
                        {project.title.split(" ")[0]} <span>{project.title.split(" ").slice(1).join(" ")}</span>
                      </h2>
                    </Link>
                    <h4 className="date">{project.subtitle}</h4>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
};

export default CreativeAgencyPortfolio;
