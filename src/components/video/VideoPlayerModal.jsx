import { useEffect, useRef } from "react";

const VideoPlayerModal = ({ video, onClose }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!video) return undefined;

    const el = videoRef.current;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    if (el) {
      el.currentTime = 0;
      el.muted = false;
      el.play().catch(() => {});
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      if (el) el.pause();
    };
  }, [video, onClose]);

  if (!video) return null;

  const label = [video.title, video.titleAccent].filter(Boolean).join(" ");

  return (
    <div
      className="video-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className="video-modal__inner" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="video-modal__close"
          onClick={onClose}
          aria-label="Close video"
        >
          <i className="fa-solid fa-xmark" />
        </button>
        <video
          ref={videoRef}
          className="video-modal__player"
          src={video.src}
          autoPlay
          controls
          playsInline
          preload="auto"
        />
        <div className="video-modal__meta">
          <h3>
            {video.title}{" "}
            {video.titleAccent && <span>{video.titleAccent}</span>}
          </h3>
          <p>{video.subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
