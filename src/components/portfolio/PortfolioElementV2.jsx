import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const PortfolioElementV2 = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        if (device_width > 767) {
          let portfolioline = gsap.timeline({
            scrollTrigger: {
              trigger: ".portfolio__area",
              start: "top center-=200",
              pin: ".portfolio__text",
              end: "bottom bottom+=80",
              markers: false,
              pinSpacing: false,
              scrub: 1,
            },
          });

          portfolioline.to(".portfolio__text", {
            scale: 3,
            duration: 1,
          });
          portfolioline.to(".portfolio__text", {
            scale: 3,
            duration: 1,
          });
          portfolioline.to(
            ".portfolio__text",
            {
              scale: 1,
              duration: 1,
            },
            "+=2"
          );
        }

        let portfolio_lists = gsap.utils.toArray(".portfolio__item");
        portfolio_lists.forEach((portfolio) => {
          gsap.set(portfolio, { opacity: 0.7 });
          let t1 = gsap.timeline();

          t1.set(portfolio, {
            position: "relative",
          });
          t1.to(portfolio, {
            scrollTrigger: {
              trigger: portfolio,
              scrub: 2,
              duration: 1.5,
              start: "top bottom+=100",
              end: "bottom center",
              markers: false,
            },
            scale: 1,
            opacity: 1,
            rotateX: 0,
          });
        });
      });
      return () => tHero.revert();
    }
  }, []);

  return (
    <section className="portfolio__area pb-140">
      <div className="container">
        <div className="row top_row">
          <h2 className="portfolio__text">work</h2>
          <div className="portfolio__list-1">
            {projects.map((project) => (
              <div className="portfolio__item" key={project.slug}>
                <Link href={`/portfolio/${project.slug}`}>
                  <Image
                    priority
                    width={project.thumbnailWidth}
                    height={project.thumbnailHeight}
                    style={{ width: "100%", height: "auto" }}
                    className="mover"
                    src={project.thumbnail}
                    alt={project.title}
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">{project.title}</h3>
                  <p>{project.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="row row_bottom">
          <div className="col-xxl-12">
            <div
              className="portfolio__btn btn_wrapper"
              data-speed="1"
              data-lag="0.2"
            >
              <Link
                className="wc-btn-secondary btn-hover btn-item"
                href="/contact"
              >
                <span></span>Start a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioElementV2;
