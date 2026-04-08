import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import PortfolioSwiperMobile from "../common/PortfolioSwiperMobile";
import PortfolioSwiperDestop from "../common/PortfolioSwiperDestop";

const PortfolioPage = () => {
  const [desktop, setDesktop] = useState("");
  const portfolioSection = useRef();
  const portfolioHeroImg = useRef();
  useEffect(() => {
    if (typeof window !== "undefined") {
      imageMovingPortfolio(portfolioHeroImg.current);
      let breakpoint = window.matchMedia("( max-width: 1300px )");
      if (breakpoint.matches === true) {
        setDesktop(true);
      } else {
        setDesktop(false);
      }
    }
  }, []);
  function imageMovingPortfolio(image_list) {
    let container = portfolioSection.current;
    let tHero = gsap.context(() => {
      if (container) {
        container.addEventListener("mousemove", (e) => {
          var x = e.clientX;
          var y = e.clientY;
          let viewportWidth = window.innerWidth;
          let center = viewportWidth / 2;
          let centerHeight = innerHeight / 2;

          if (x > center) {
            gsap.to(image_list, {
              x: 60,
              duration: 5,
              ease: "power4.out",
            });
          } else {
            gsap.to(image_list, {
              x: -60,
              duration: 5,
              ease: "power4.out",
            });
          }
          if (y > centerHeight) {
            gsap.to(image_list, {
              scale: 1.15,
              duration: 5,
              ease: "power4.out",
            });
          } else {
            gsap.to(image_list, {
              scale: 1,
              duration: 5,
              ease: "power4.out",
            });
          }
        });
      }
    });
    return () => tHero.revert();
  }
  return (
    <>
      <div className="portfolio__page">
        {desktop ? (
          <PortfolioSwiperMobile
            portfolioSection={portfolioSection}
            portfolioHeroImg={portfolioHeroImg}
          />
        ) : (
          <PortfolioSwiperDestop
            portfolioSection={portfolioSection}
            portfolioHeroImg={portfolioHeroImg}
          />
        )}
      </div>
    </>
  );
};

export default PortfolioPage;
