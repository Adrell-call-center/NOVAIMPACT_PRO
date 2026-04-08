import Link from "next/link";
import Detail1 from "../../../public/assets/imgs/portfolio/detail/1.jpg";
import Detail2 from "../../../public/assets/imgs/portfolio/detail/2.jpg";
import Detail3 from "../../../public/assets/imgs/portfolio/detail/3.jpg";
import Detail4 from "../../../public/assets/imgs/portfolio/detail/4.jpg";
import Detail5 from "../../../public/assets/imgs/portfolio/detail/5.jpg";
import Detail6 from "../../../public/assets/imgs/portfolio/detail/6.jpg";
import Detail7 from "../../../public/assets/imgs/portfolio/detail/7.jpg";
import DetailShape from "../../../public/assets/imgs/portfolio/detail/shape.png";
import Image from "next/image";
import { useEffect, useRef } from "react";
import animationCharCome from "@/lib/utils/animationCharCome";
import { projects } from "@/data/projects";

const PortfolioDetails1 = ({ project }) => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  // Fallback to default content if no project passed
  const displayProject = project || {
    title: "Lionpro",
    subtitle: "Agency",
    category: "Development",
    client: "Webflow",
    startDate: "2021-01-23",
    handoverDate: "2021-03-05",
    description: "Build, streamline and evolve together with solution",
    fullDescription: "Always ready to push the boundaries, especially when it comes to our own platform, Our analytical eye to create a site that was visually engaging and also optimised for maximum performance.",
    services: ["+ Brand Development", "+ UX/UI Design", "+ Front-end Development", "+ Copywriting", "+ Shopify Development"],
    slug: "lionpro-agency",
    thumbnail: "/assets/imgs/portfolio/detail/1.jpg",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Find prev and next projects
  const currentIndex = projects.findIndex((p) => p.slug === displayProject.slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  return (
    <>
      <section className="portfolio__detail">
        <div className="portfolio__detail-top">
          <div className="container g-0 line pt-110 pb-130">
            <span className="line-3"></span>

            <div className="row">
              <div className="col-xxl-8 col-xl-8 col-lg-7 col-md-7">
                <div className="sec-title-wrapper">
                  <h2 className="sec-title animation__char_come" ref={charAnim}>
                    {displayProject.title}- <br />
                    {displayProject.subtitle}
                  </h2>
                </div>
              </div>

              <div className="col-xxl-4 col-xl-4 col-lg-5 col-md-5">
                <div className="portfolio__detail-info">
                  <ul>
                    <li>
                      Category <span>{displayProject.category}</span>
                    </li>
                    <li>
                      Client <span>{displayProject.client}</span>
                    </li>
                    <li>
                      Start Date <span>{formatDate(displayProject.startDate)}</span>
                    </li>
                    <li>
                      Handover <span>{formatDate(displayProject.handoverDate)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="portfolio__detail-thumb">
          <Image
            priority
            style={{ width: "auto", height: "auto" }}
            src={Detail1}
            alt="Portfolio Thumbnail"
            data-speed="auto"
          />
        </div>

        <div className="portfolio__detail-content">
          <div className="container g-0 line pt-140">
            <span className="line-3"></span>

            <div className="block-content">
              <div className="row">
                <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                  <h2 className="portfolio__detail-title title-anim">
                    {displayProject.description}
                  </h2>
                </div>

                <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                  <div className="portfolio__detail-text">
                    <p>
                      {displayProject.fullDescription}
                    </p>

                    <ul>
                      {displayProject.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="block-thumb">
              <Image
                priority
                style={{ width: "auto", height: "auto" }}
                src={Detail2}
                alt="Portfolio Image"
                data-speed="0.5"
              />
            </div>

            {(displayProject.challenge || displayProject.results) && (
              <div className="block-content pt-140">
                <div className="row">
                  {displayProject.challenge && (
                    <>
                      <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                        <h2 className="portfolio__detail-title title-anim">
                          The Challenge
                        </h2>
                      </div>
                      <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                        <div className="portfolio__detail-text">
                          <p>{displayProject.challenge}</p>
                          {displayProject.solution && (
                            <>
                              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "1.5rem", marginBottom: "0.75rem" }}>Our Approach</h3>
                              <p>{displayProject.solution}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {displayProject.results && (
                  <div className="row" style={{ marginTop: "3rem" }}>
                    <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                      <h2 className="portfolio__detail-title title-anim">
                        Results
                      </h2>
                    </div>
                    <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                      <div className="portfolio__detail-text">
                        <ul>
                          {displayProject.results.map((result, i) => (
                            <li key={i}>{result}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="block-gallery">
              <Image
                priority
                style={{ width: "50%", height: "auto" }}
                src={Detail3}
                alt="Portfolio Image"
              />
              <Image
                priority
                style={{ width: "50%", height: "auto" }}
                src={Detail4}
                alt="Portfolio Image"
              />
            </div>

            <div className="block-thumb">
              <Image
                priority
                style={{ width: "auto", height: "auto" }}
                src={Detail5}
                alt="Portfolio Image"
                data-speed="0.5"
              />
            </div>

            <div className="block-img-text">
              <Image
                priority
                width={375}
                style={{ height: "auto" }}
                src={Detail6}
                alt="Portfolio Image"
              />
              <Image
                priority
                width={375}
                style={{ height: "auto" }}
                src={Detail7}
                alt="Portfolio Image"
              />
              <p>
                For those of us who are blessed with good sight. So we seldom
                consider it. That’s why going off to investigate the whys and
                hows involved is a little like trying to get behind the wind{" "}
              </p>
            </div>

            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12">
                <div className="portfolio__detail-btns pt-150 pb-150">
                  <Link
                    href={`/portfolio/${prevProject.slug}`}
                    className="wc-btn-primary btn-hover"
                  >
                    <span></span> Prev Work
                  </Link>
                  <Link
                    href={`/portfolio/${nextProject.slug}`}
                    className="wc-btn-primary btn-hover"
                  >
                    <span></span> Next Work
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioDetails1;
