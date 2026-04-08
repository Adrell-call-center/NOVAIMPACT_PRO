import { useEffect, useRef } from "react";

const Preloader = () => {
  const preloaderSection = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        const preloader = preloaderSection.current;
        preloader.style.display = "none";
      }, 500);
    }
  }, []);

  return (
    <>
      <div className="preloader" ref={preloaderSection}>
        <div className="loading">
          <div className="bar bar1"></div>
          <div className="bar bar2"></div>
          <div className="bar bar3"></div>
          <div className="bar bar4"></div>
          <div className="bar bar5"></div>
          <div className="bar bar6"></div>
          <div className="bar bar7"></div>
          <div className="bar bar8"></div>
        </div>
      </div>
    </>
  );
};

export default Preloader;
