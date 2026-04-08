import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
const JeSwitch = "/images/jeswitch-portfolio.webp";
const Mutuelles = "/images/mutuellespashchere-portfolio.webp";
const Planostra = "/images/planostra-portfolio.webp";
const ExifInjector = "/images/exifinjector-portfolio.webp";
const TrustedPulse = "/images/trustedpulse-portfolio.webp";
const ZoomAssurance = "/images/zoom-assurance-portfolio.webp";
const AllWorld = "/images/allword-portfolio.webp";
import Image from "next/image";

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
        portfolio_lists.forEach((portfolio, i) => {
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
    <>
      <section className="portfolio__area pb-140">
        <div className="container">
          <div className="row top_row">
            <h2 className="portfolio__text">work</h2>
            <div className="portfolio__list-1">
              <div className="portfolio__item">
                <Link href="https://jeswitch.fr" target="_blank" rel="noopener noreferrer">
                  <Image
                    priority
                    width={600}
                    height={800}
                    style={{ width: "100%", height: "auto" }}
                    className="mover"
                    src={JeSwitch}
                    alt="JeSwitch.fr Insurance Comparison Platform"
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">JeSwitch.fr</h3>
                  <p>Insurance Comparison & Lead Generation</p>
                </div>
              </div>
              <div className="portfolio__item">
                <Link href="https://zoomassurance.fr" target="_blank" rel="noopener noreferrer">
                  <Image
                    priority
                    width={600}
                    height={800}
                    style={{ width: "100%", height: "auto" }}
                    src={ZoomAssurance}
                    alt="ZoomAssurance.fr Insurance Content Platform"
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">ZoomAssurance.fr</h3>
                  <p>Insurance Insights & Guides</p>
                </div>
              </div>
              <div className="portfolio__item">
                <Link href="https://mutuellespaschere.com" target="_blank" rel="noopener noreferrer">
                  <Image
                    priority
                    style={{ width: "100%", height: "auto" }}
                    width={600}
                    height={800}
                    src={Mutuelles}
alt="MutuellesPasChere.com Health Insurance Resource"
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">MutuellesPasChere.com</h3>
                  <p>Health Insurance Resource</p>
                </div>
              </div>
              <div className="portfolio__item">
                <Link href="https://planostra.com" target="_blank" rel="noopener noreferrer">
                  <Image
                    priority
                    width={600}
                    height={800}
                    style={{ width: "100%", height: "auto" }}
                    src={Planostra}
                    alt="Planostra Marketing Intelligence SaaS"
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">Planostra</h3>
                  <p>Marketing Intelligence & Analytics SaaS</p>
                </div>
              </div>
              <div className="portfolio__item">
                <Link href="https://exifinjector.com" target="_blank" rel="noopener noreferrer">
                  <Image
                    priority
                    width={600}
                    height={800}
                    style={{ width: "100%", height: "auto" }}
                    src={ExifInjector}
                    alt="ExifInjector AI Metadata SaaS"
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">ExifInjector</h3>
                  <p>AI Metadata Optimization for eCommerce</p>
                </div>
              </div>
              <div className="portfolio__item">
                <Link href="https://trustedpulse.com" target="_blank" rel="noopener noreferrer">
                  <Image
                    priority
                    width={600}
                    height={800}
                    style={{ width: "100%", height: "auto" }}
                    src={TrustedPulse}
                    alt="TrustedPulse Review Platform"
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">TrustedPulse</h3>
                  <p>Review & Reputation Platform</p>
                </div>
              </div>
              <div className="portfolio__item">
                <Link href="https://allworld247.com" target="_blank" rel="noopener noreferrer">
                  <Image
                    priority
                    width={600}
                    height={800}
                    style={{ width: "100%", height: "auto" }}
                    src={AllWorld}
                    alt="AllWorld247.com Multi-Category Content Portal"
                  />
                </Link>
                <div className="portfolio__info">
                  <h3 className="portfolio__title">AllWorld247.com</h3>
                  <p>Multi-Category Content Portal</p>
                </div>
              </div>
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
    </>
  );
};

export default PortfolioElementV2;
