import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import Image from "next/image";

const AllWorld = "/images/allword-portfolio.webp";

const projects = [
  { img: "/images/jeswitch-portfolio.webp",           title: "JeSwitch.fr",           subtitle: "Insurance Comparison & Lead Generation",      link: "https://jeswitch.fr" },
  { img: "/images/planostra-portfolio.webp",          title: "Planostra",             subtitle: "Marketing Intelligence & Analytics SaaS",     link: "https://planostra.com" },
  { img: "/images/trustedpulse-portfolio.webp",       title: "TrustedPulse",          subtitle: "Review & Reputation Platform",                link: "https://trustedpulse.com" },
  { img: "/images/exifinjector-portfolio.webp",       title: "ExifInjector",          subtitle: "AI Metadata Optimization for eCommerce",      link: "https://exifinjector.com" },
  { img: "/images/mutuellespashchere-portfolio.webp", title: "MutuellesPasChere.com", subtitle: "Health Insurance Resource",                   link: "https://mutuellespaschere.com" },
  { img: "/images/zoom-assurance-portfolio.webp",    title: "ZoomAssurance.fr",      subtitle: "Insurance Insights & Guides",                  link: "https://zoomassurance.fr" },
  { img: AllWorld, title: "AllWorld247.com", subtitle: "Multi-Category Content Portal", link: "https://allworld247.com" },
];

const StartupAgencyPortfolio = () => {
  return (
    <>
      <section className="portfolio__area-4">
        <div className="container-fluid line_4 pt-150">
          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <div className="portfolio__sec-title text-anim">
                <h2 className="sec-subtile-6">Portfolio</h2>
                <h3 className="sec-title-6 title-anim">
                  Selected <br /> Projects
                </h3>
                <p>
                  Explore our recent work — from SaaS tools and insurance
                  platforms to full-scale digital campaigns delivering real
                  results.
                </p>
                <Link href="/portfolio" className="btn-common" style={{ marginTop: "30px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  View all work <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
            <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8">
              <div className="portfolio__wrapper-4 portfolio__slider-4">
                <Swiper
                  spaceBetween={15}
                  slidesPerView={1}
                  loop={true}
                  speed={1500}
                  breakpoints={{
                    768:  { slidesPerView: 2 },
                    1000: { slidesPerView: 2, spaceBetween: 60 },
                    1200: { slidesPerView: 2, spaceBetween: 90 },
                    1400: { slidesPerView: 2, spaceBetween: 120 },
                  }}
                >
                  {projects.map((p, i) => (
                    <SwiperSlide key={i}>
                      <div className="portfolio__item-4">
                        <Link href={p.link} target="_blank" rel="noopener noreferrer">
                          <div className="portfolio__item-inner">
                            <div className="portfolio__title-wrapper">
                              <h4 className="portfolio__title-4">{p.title}</h4>
                              <h5 className="portfolio__subtitle-4">{p.subtitle}</h5>
                            </div>
                            <div className="portfolio__icon-link">
                              <span className="portfolio__icon-4">
                                <i className="fa-solid fa-arrow-right"></i>
                              </span>
                            </div>
                          </div>
                          <Image
                            priority
                            width={600}
                            height={800}
                            style={{ width: "100%", height: "auto" }}
                            src={p.img}
                            alt={p.title}
                          />
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>

        <div className="container line_4 portfolio6__line">
          <div className="line-col-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default StartupAgencyPortfolio;
