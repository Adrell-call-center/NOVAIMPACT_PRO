import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import $ from "jquery";
import Link from "next/link";
const ExifInjector = "/images/exifinjector-portfolio.webp";
const Planostra = "/images/planostra-portfolio.webp";
const TrustedPulse = "/images/trustedpulse-portfolio.webp";
const JeSwitch = "/images/jeswitch-portfolio.webp";
const Mutuelles = "/images/mutuellespashchere-portfolio.webp";
const Portfilio61 = "/images/portfolio-analytics.webp";
const Portfilio62 = "/images/portfolio-website.webp";
const Portfilio63 = "/images/portfolio-marketing.webp";
const Portfilio64 = "/images/portfolio-branding.webp";
const Portfilio65 = "/images/portfolio-macbook.webp";
const Portfilio66 = "/images/portfolio-imac.webp";
const Portfilio67 = "/images/portfolio-coding.webp";
import Image from "next/image";
import animationCharCome from "@/lib/utils/animationCharCome";

gsap.registerPlugin(ScrollTrigger);

const Portfolio1 = () => {
  const charAnim = useRef();
  const charAnim2 = useRef();
  const portfolioItemList = useRef();
  const PortfolioTotal = useRef();

  useEffect(() => {
    animationCharCome(charAnim.current);
    animationCharCome(charAnim2.current, 0.15);
    if (typeof window !== "undefined") {
      const totalPortfolioItems = portfolioItemList.current.children.length;

      if (totalPortfolioItems) {
        PortfolioTotal.current.innerHTML = totalPortfolioItems;
      }

      $(document).on("scroll", function () {
        $(".portfolio__item-6").each(function () {
          if (
            $(this).position().top <= $(document).scrollTop() &&
            $(this).position().top + $(this).outerHeight() >
              $(document).scrollTop()
          ) {
            var item_num = $(this).data("portfitem");
            $(".portfolio__current").html(item_num);
            $(this).addClass("active").siblings().removeClass("active");
          }
        });
      });

      let tHero = gsap.context(() => {
        const portfolio_listss = gsap.utils.toArray(".portfolio__item-6 img");
        if (portfolio_listss) {
          portfolio_listss.forEach((item, i) => {
            gsap.from(item, {
              scrollTrigger: {
                trigger: item,
                start: "top center",
                scrub: 1.5,
              },
              scale: 2.5,
              duration: 1,
            });
          });
        }
        function mousemoveHandler(e) {
          const target = e.target;

          let tl = gsap.timeline({
            defaults: {
              x: e.clientX,
              y: e.clientY,
            },
          });
          let t2 = gsap.timeline({
            defaults: {
              x: e.clientX,
              y: e.clientY,
            },
          });
        }
        ScrollTrigger.create({
          trigger: ".portfolio__wrapper-6",
          start: "top top",
          end: "bottom bottom",
          pin: ".portfolio__title-wrap-6",
          pinSpacing: false,
        });
        document.addEventListener("mousemove", mousemoveHandler);
      });
      return () => {
        tHero.revert();
      };
    }
  }, []);
  return (
    <>
      <section className="portfolio__area-6">
        <div className="container line pt-100 pb-140">
          <span className="line-3"></span>
          <div className="zi-9">
            <div className="row">
              <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6">
                <div className="sec-title-wrapper portfolio__title-wrap-6">
                  <div className="">
                    <h2
                      className="sec-sub-title animation__char_come"
                      ref={charAnim}
                    >
                      Featured
                    </h2>
                    <h3
                      className="sec-title animation__char_come_long"
                      ref={charAnim2}
                    >
                      Work
                    </h3>
                    <p>
                      View the full case study of our recent featured and
                      awesome works that we created for our clients.
                    </p>
                  </div>
                  <div className="portfolio__pagination-6">
                    <span className="portfolio__current">01</span> / 0
                    <span
                      className="portfolio__total"
                      ref={PortfolioTotal}
                    ></span>
                  </div>
                </div>
              </div>

              <div className="col-xxl-8 col-xl-7 col-lg-7 col-md-6">
                <div className="portfolio__wrapper-6">
                  <div className="portfolio__list-6" ref={portfolioItemList}>
                    <div className="portfolio__item-6" data-portfitem="1">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={514}
                          height={770}
                          style={{ height: "auto" }}
                          src={ExifInjector}
                          alt="ExifInjector Portfolio"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">ExifInjector</h4>
                          <h5 className="portfolio__date">SaaS Tool</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="2">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={514}
                          height={770}
                          style={{ height: "auto" }}
                          src={Planostra}
                          alt="Planostra Portfolio"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Planostra</h4>
                          <h5 className="portfolio__date">SaaS Tool</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="3">
                      <Link href="https://trustedpulse.com" target="_blank" rel="noopener noreferrer">
                        <Image
                          priority
                          width={514}
                          height={770}
                          style={{ height: "auto" }}
                          src={TrustedPulse}
                          alt="TrustedPulse Portfolio"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">TrustedPulse</h4>
                          <h5 className="portfolio__date">SaaS Platform</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="4">
                      <Link href="https://jeswitch.fr" target="_blank" rel="noopener noreferrer">
                        <Image
                          priority
                          width={514}
                          height={770}
                          style={{ height: "auto" }}
                          src={JeSwitch}
                          alt="JeSwitch Portfolio"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">JeSwitch.fr</h4>
                          <h5 className="portfolio__date">Lead Generation</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="5">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          height={514}
                          style={{ height: "auto" }}
                          src={Portfilio65}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="6">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          height={514}
                          style={{ height: "auto" }}
                          src={Portfilio66}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="7">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          height={514}
                          style={{ height: "auto" }}
                          src={Portfilio67}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Portfolio1;
