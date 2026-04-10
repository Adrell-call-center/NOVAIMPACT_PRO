import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import $ from "jquery";
import Link from "next/link";
import Image from "next/image";
import animationCharCome from "@/lib/utils/animationCharCome";

const ExifInjector = "/images/exifinjector-portfolio.webp";
const Planostra = "/images/planostra-portfolio.webp";
const TrustedPulse = "/images/trustedpulse-portfolio.webp";
const JeSwitch = "/images/jeswitch-portfolio.webp";
const Mutuelles = "/images/mutuellespashchere-portfolio.webp";
const ZoomAssurance = "/images/zoom-assurance-portfolio.webp";
const AllWorld = "/images/allword-portfolio.webp";

gsap.registerPlugin(ScrollTrigger);

const HomePortfolioV6 = () => {
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
        ScrollTrigger.create({
          trigger: ".portfolio__wrapper-6",
          start: "top top",
          end: "bottom bottom",
          pin: ".portfolio__title-wrap-6",
          pinSpacing: false,
        });
      });
      return () => {
        tHero.revert();
      };
    }
  }, []);

  return (
    <>
      <section className="portfolio__area-6 portfolio__area-6-home">
        <div className="container line pt-100 pb-140">
          <span className="line-3"></span>
          <div className="zi-9">
            <div className="row">
              {/* LEFT SIDE - Pinned Title */}
              <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6">
                <div className="sec-title-wrapper portfolio__title-wrap-6 portfolio__title-wrap-6-white">
                  <div className="">
                    <h2
                      className="sec-sub-title animation__char_come portfolio__subtitle-white"
                      ref={charAnim}
                    >
                      Featured
                    </h2>
                    <h3
                      className="sec-title animation__char_come_long portfolio__title-white"
                      ref={charAnim2}
                    >
                      Work
                    </h3>
                    <p className="portfolio__desc-white">
                      Explore our portfolio of successful projects. From SaaS platforms and insurance tools to full-scale digital campaigns delivering real results.
                    </p>
                  </div>
                  <div className="portfolio__pagination-6 portfolio__pagination-white">
                    <span className="portfolio__current">01</span> / 0
                    <span
                      className="portfolio__total"
                      ref={PortfolioTotal}
                    ></span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE - Scrollable Projects */}
              <div className="col-xxl-8 col-xl-7 col-lg-7 col-md-6">
                <div className="portfolio__wrapper-6">
                  <div className="portfolio__list-6" ref={portfolioItemList}>

                    {/* Project 1: JeSwitch */}
                    <div className="portfolio__item-6" data-portfitem="1">
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
                          <h5 className="portfolio__date">Insurance Comparison & Lead Generation</h5>
                        </div>
                      </Link>
                    </div>

                    {/* Project 2: ZoomAssurance */}
                    <div className="portfolio__item-6" data-portfitem="2">
                      <Link href="https://zoomassurance.fr" target="_blank" rel="noopener noreferrer">
                        <Image
                          priority
                          width={514}
                          height={770}
                          style={{ height: "auto" }}
                          src={ZoomAssurance}
                          alt="ZoomAssurance Portfolio"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">ZoomAssurance.fr</h4>
                          <h5 className="portfolio__date">Insurance Insights & Guides</h5>
                        </div>
                      </Link>
                    </div>

                    {/* Project 3: MutuellesPasChere */}
                    <div className="portfolio__item-6" data-portfitem="3">
                      <Link href="https://mutuellespaschere.com" target="_blank" rel="noopener noreferrer">
                        <Image
                          priority
                          width={514}
                          height={770}
                          style={{ height: "auto" }}
                          src={Mutuelles}
                          alt="MutuellesPasChere Portfolio"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">MutuellesPasChere.com</h4>
                          <h5 className="portfolio__date">Health Insurance Resource</h5>
                        </div>
                      </Link>
                    </div>

                    {/* Project 4: AllWorld247 */}
                    <div className="portfolio__item-6" data-portfitem="4">
                      <Link href="https://allworld247.com" target="_blank" rel="noopener noreferrer">
                        <Image
                          priority
                          width={514}
                          height={770}
                          style={{ height: "auto" }}
                          src={AllWorld}
                          alt="AllWorld247 Portfolio"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">AllWorld247.com</h4>
                          <h5 className="portfolio__date">Multi-Category Content Portal</h5>
                        </div>
                      </Link>
                    </div>

                    {/* Project 5: Planostra */}
                    <div className="portfolio__item-6" data-portfitem="5">
                      <Link href="https://planostra.com" target="_blank" rel="noopener noreferrer">
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
                          <h5 className="portfolio__date">Marketing Intelligence & Analytics SaaS</h5>
                        </div>
                      </Link>
                    </div>

                    {/* Project 6: TrustedPulse */}
                    <div className="portfolio__item-6" data-portfitem="6">
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
                          <h5 className="portfolio__date">Review & Reputation Platform</h5>
                        </div>
                      </Link>
                    </div>

                    {/* Project 7: ExifInjector */}
                    <div className="portfolio__item-6" data-portfitem="7">
                      <Link href="https://exifinjector.com" target="_blank" rel="noopener noreferrer">
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
                          <h5 className="portfolio__date">AI Metadata Optimization for eCommerce</h5>
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

export default HomePortfolioV6;
