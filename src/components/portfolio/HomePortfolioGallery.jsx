import { useEffect, useRef } from "react";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import animationCharCome from "@/lib/utils/animationCharCome";
import { projects } from "@/data/projects";

import "swiper/css";
import "swiper/css/free-mode";

const HomePortfolioGallery = () => {
  const charAnim = useRef();

  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  return (
    <section className="portfolio__area-7 home-portfolio-gallery">
      <div className="container pt-140 pb-60">
        <div className="row">
          <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
            <div className="sec-title-wrapper">
              <h2 className="sec-title animation__char_come" ref={charAnim}>
                Selected Projects
              </h2>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
            <div className="sec-text">
              <p>
                Explore our portfolio of successful projects — from SaaS platforms
                and insurance tools to full-scale digital campaigns delivering real results.
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
            640: { slidesPerView: 1.2 },
            800: { slidesPerView: 1.6, spaceBetween: 40 },
            1024: { slidesPerView: 2.2, spaceBetween: 50 },
            1200: { slidesPerView: 2.5, spaceBetween: 60 },
            1400: { slidesPerView: 3, spaceBetween: 70 },
          }}
        >
          {projects.map((project, i) => {
            const [name, ...rest] = project.title.split(" ");
            return (
              <SwiperSlide key={project.slug}>
                <div className="portfolio__slide-7">
                  <div className="slide-img home-portfolio-gallery__thumb">
                    <Link href={`/portfolio/${project.slug}`}>
                      <Image
                        priority={i < 3}
                        width={project.thumbnailWidth}
                        height={project.thumbnailHeight}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        src={project.thumbnail}
                        alt={project.title}
                      />
                    </Link>
                  </div>
                  <div className="slide-content">
                    <Link href={`/portfolio/${project.slug}`}>
                      <h2 className="title">
                        {name} {rest.length > 0 && <span>{rest.join(" ")}</span>}
                      </h2>
                    </Link>
                    <h4 className="date">{project.subtitle}</h4>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className="container pb-100 pt-60">
        <div className="row">
          <div className="col-xxl-12 text-center">
            <Link
              href="/contact"
              className="wc-btn-secondary btn-hover btn-item"
            >
              <span></span>Start a Project{" "}
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePortfolioGallery;
