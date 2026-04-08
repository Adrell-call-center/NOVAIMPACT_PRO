import animationCharCome from "@/lib/utils/animationCharCome";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

const ServiceElementV5 = () => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);
  return (
    <div>
      <section className="portfolio__service service-v5 pt-140 pb-140">
        <div className="container">
          <div className="row">
            <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6">
              <h2 className="sec-title animation__char_come" ref={charAnim}>
                {" "}
                I MAKE THE Service BETTER.
              </h2>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-text">
                <p>
                  Static and dynamic secure code review can prevent a 0day
                  before your product is even released. We can integrate with
                  your dev environment
                </p>
              </div>
            </div>
          </div>
          <div className="portfolio__service-list">
            <div className="row">
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <div className="portfolio__service-item">
                  <Link href="/service-details">
                    <h3 className="ps-title">
                      Frontend <br /> Developemnt
                    </h3>
                    <ul>
                      <li>+ WordPress</li>
                      <li>+ Python</li>
                      <li>+ PHP & Laravel</li>
                    </ul>
                  </Link>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <div className="portfolio__service-item">
                  <Link href="/service-details">
                    <h3 className="ps-title">
                      Backend
                      <br /> Developemnt
                    </h3>
                    <ul>
                      <li>+ WordPress</li>
                      <li>+ Python</li>
                      <li>+ PHP & Laravel</li>
                    </ul>
                  </Link>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <div className="portfolio__service-item">
                  <Link href="/service-details">
                    <h3 className="ps-title">
                      Android
                      <br /> Developemnt
                    </h3>
                    <ul>
                      <li>+ WordPress</li>
                      <li>+ Python</li>
                      <li>+ PHP & Laravel</li>
                    </ul>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <div className="portfolio__service-item">
                  <Link href="/service-details">
                    <h3 className="ps-title">
                      Frontend <br /> Developemnt
                    </h3>
                    <ul>
                      <li>+ WordPress</li>
                      <li>+ Python</li>
                      <li>+ PHP & Laravel</li>
                    </ul>
                  </Link>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <div className="portfolio__service-item">
                  <Link href="/service-details">
                    <h3 className="ps-title">
                      Backend
                      <br /> Developemnt
                    </h3>
                    <ul>
                      <li>+ WordPress</li>
                      <li>+ Python</li>
                      <li>+ PHP & Laravel</li>
                    </ul>
                  </Link>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                <div className="portfolio__service-item">
                  <Link href="/service-details">
                    <h3 className="ps-title">
                      Android
                      <br /> Developemnt
                    </h3>
                    <ul>
                      <li>+ WordPress</li>
                      <li>+ Python</li>
                      <li>+ PHP & Laravel</li>
                    </ul>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceElementV5;
