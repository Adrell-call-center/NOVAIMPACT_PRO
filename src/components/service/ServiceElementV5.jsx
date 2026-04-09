import animationCharCome from "@/lib/utils/animationCharCome";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

const ServiceElementV5 = () => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  const services = [
    { title: "Website Creation", slug: "website-creation", items: ["+ Custom Web Design", "+ Responsive & Fast", "+ SEO Optimized"] },
    { title: "SEO", slug: "seo", items: ["+ On-Page SEO", "+ Technical Audit", "+ Link Building"] },
    { title: "Meta Ads", slug: "meta-ads", items: ["+ Facebook Ads", "+ Instagram Ads", "+ Retargeting"] },
    { title: "Google Ads", slug: "google-ads", items: ["+ Search Campaigns", "+ Display Ads", "+ Shopping Ads"] },
    { title: "Social Media Management", slug: "social-media-management", items: ["+ Content Strategy", "+ Community Mgmt", "+ Analytics"] },
    { title: "Content Creation", slug: "content-creation", items: ["+ Visual Design", "+ Copywriting", "+ Video Content"] },
    { title: "Brand Identity", slug: "brand-identity", items: ["+ Logo Design", "+ Brand Guidelines", "+ Visual Systems"] },
    { title: "Comparator Creation", slug: "comparator-creation", items: ["+ Custom Platforms", "+ Affiliate Marketing", "+ Lead Generation"] },
    { title: "Consulting & Support", slug: "consulting-support", items: ["+ Strategy Planning", "+ Training", "+ Ongoing Support"] },
  ];

  return (
    <div>
      <section className="portfolio__service service-v5 pt-140 pb-140">
        <div className="container">
          <div className="row">
            <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6">
              <h2 className="sec-title animation__char_come" ref={charAnim}>
                Our Full Range <br />of Digital Services
              </h2>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-text">
                <p>
                  From strategy to execution, Nova Impact delivers digital solutions tailored to your business goals. Every service is designed to drive real, measurable results.
                </p>
              </div>
            </div>
          </div>
          <div className="portfolio__service-list">
            <div className="row">
              {services.map((s, i) => (
                <div key={i} className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                  <div className="portfolio__service-item">
                    <Link href={`/service-details/${s.slug}`}>
                      <h3 className="ps-title">
                        {s.title.split(" ").slice(0, Math.ceil(s.title.split(" ").length / 2)).join(" ")}<br />
                        {s.title.split(" ").slice(Math.ceil(s.title.split(" ").length / 2)).join(" ")}
                      </h3>
                      <ul>
                        {s.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceElementV5;
