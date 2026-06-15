import { useEffect, useRef, useState } from "react";
import { FreeMode } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import animationCharCome from "@/lib/utils/animationCharCome";
import { homeVideos } from "@/data/videos";

import "swiper/css";
import "swiper/css/free-mode";

const VideoPlayerModal = dynamic(() => import("@/components/video/VideoPlayerModal"), { ssr: false });

const HomeVideoGallery = () => {
  const charAnim = useRef();
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  return (
    <>
      <section className="portfolio__area-7 home-video-gallery">
        <div className="container pt-140 pb-60">
          <div className="row">
            <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2 className="sec-title animation__char_come" ref={charAnim}>
                  Our Videos
                </h2>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
              <div className="sec-text">
                <p>
                  A glimpse of our creative work — campaign reels, brand content,
                  and behind-the-scenes moments from the Nova Impact studio.
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
            loop={false}
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
            {homeVideos.map((video, i) => (
              <SwiperSlide key={video.id}>
                <div className="portfolio__slide-7">
                  <button
                    type="button"
                    className="home-video-gallery__placeholder"
                    onClick={() => setActiveVideo(video)}
                    aria-label={`Play ${video.title} ${video.titleAccent ?? ""}`}
                  >
                    {/* index */}
                    <span className="home-video-gallery__index">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* title in the card */}
                    <div className="home-video-gallery__card-title">
                      <p>{video.title}</p>
                      {video.titleAccent && <p className="accent">{video.titleAccent}</p>}
                    </div>

                    {/* play button */}
                    <div className="home-video-gallery__play-icon">
                      <i className="fa-solid fa-play" />
                    </div>

                    {/* bottom label */}
                    <div className="home-video-gallery__card-meta">
                      <span className="home-video-gallery__card-subtitle">{video.subtitle}</span>
                    </div>
                  </button>
                  <div className="slide-content">
                    <h2 className="title">
                      {video.title}{" "}
                      {video.titleAccent && <span>{video.titleAccent}</span>}
                    </h2>
                    <h4 className="date">{video.subtitle}</h4>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="container pb-100 pt-60">
          <div className="row">
            <div className="col-xxl-12 text-center">
              <Link
                href="/videos"
                className="wc-btn-secondary btn-hover btn-item"
              >
                <span></span>View All Videos{" "}
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  );
};

export default HomeVideoGallery;
