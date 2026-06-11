import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import animationCharCome from "@/lib/utils/animationCharCome";
import { allVideos } from "@/data/videos";
import VideoPlayerModal from "@/components/video/VideoPlayerModal";

gsap.registerPlugin(ScrollTrigger);

const VideoGalleryPage = () => {
  const charAnim = useRef();
  const gridRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof IntersectionObserver === "undefined") return undefined;

    const videos = grid.querySelectorAll(".videos-page__thumb video");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    videos.forEach((video) => {
      video.play().catch(() => {});
      observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".videos-page__card");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.6, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top bottom+=80",
              end: "bottom center",
              scrub: 1,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="pt-150 pb-80 portfolio-v2 videos-page">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2
                  className="sec-title-2 animation__char_come"
                  ref={charAnim}
                >
                  Our <br /> Videos
                </h2>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
              <div className="blog__text">
                <p>
                  Campaign reels, brand content, and behind-the-scenes work from
                  the Nova Impact studio. Click any video to watch with sound.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={gridRef} className="videos-page__grid pb-140">
        <div className="container">
          <div className="row g-4">
            {allVideos.map((video) => (
              <div
                key={video.id}
                className={
                  video.orientation === "portrait"
                    ? "col-lg-4 col-md-6"
                    : "col-lg-6 col-md-6"
                }
              >
                <button
                  type="button"
                  className="videos-page__card"
                  onClick={() => setActiveVideo(video)}
                  aria-label={`Play ${video.title} ${video.titleAccent}`}
                >
                  <div
                    className={`videos-page__thumb videos-page__thumb--${video.orientation}`}
                  >
                    <video
                      src={video.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-hidden="true"
                    />
                    <span className="videos-page__play" aria-hidden="true">
                      <i className="fa-solid fa-play" />
                    </span>
                  </div>
                  <div className="videos-page__info">
                    <h3 className="videos-page__title">
                      {video.title}{" "}
                      {video.titleAccent && (
                        <span>{video.titleAccent}</span>
                      )}
                    </h3>
                    <p className="videos-page__subtitle">{video.subtitle}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
};

export default VideoGalleryPage;
