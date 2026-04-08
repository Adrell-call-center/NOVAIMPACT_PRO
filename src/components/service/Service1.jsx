import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
// Service page images
// Service images — Unsplash portrait 3:4 (600×800)
const S1a = "/images/service-grid-content-a.webp";
const S1b = "/images/service-grid-comparator.webp";
const S1c = "/images/service-grid-web-dev.webp";
const S2a = "/images/service-grid-social-media.webp";
const S2b = "/images/service-grid-social-mgmt.webp";
const S2c = "/images/service-grid-seo.webp";
const S3a = "/images/service-grid-analytics.webp";
const S3b = "/images/service-grid-team-meeting.webp";
const S3c = "/images/service-grid-technology.webp";
const S4a = "/images/service-grid-meta-ads.webp";
const S4b = "/images/service-grid-collaboration.webp";
const S5a = "/images/service-grid-google-ads.webp";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Service1 = () => {
  const services = [
    {
      id: "service_1",
      slug: "website-creation",
      title: "Website Creation",
      desc: "We design and develop fast, responsive, SEO-optimized websites tailored to your business goals. From landing pages to full e-commerce platforms, we build digital experiences that convert.",
      items: ["+ Custom Web Design", "+ WordPress Development", "+ E-commerce Solutions", "+ Responsive & Mobile-First", "+ SEO Optimization", "+ Performance Tuning"],
      img: S1a,
      tabImg: S1b,
    },
    {
      id: "service_2",
      slug: "social-media-management",
      title: "Social Media Management",
      desc: "We manage your social media presence end-to-end — from content planning and scheduling to community engagement and performance reporting across all major platforms.",
      items: ["+ Content Calendar", "+ Community Management", "+ Analytics & Reporting", "+ Platform Strategy", "+ Audience Growth", "+ Brand Voice Consistency"],
      img: S2a,
      tabImg: S2b,
    },
    {
      id: "service_3",
      slug: "content-creation",
      title: "Content Creation",
      desc: "From copywriting and blog posts to video scripts and visual content, we create compelling materials that resonate with your audience and strengthen your brand identity.",
      items: ["+ Blog & Article Writing", "+ Video Scripts", "+ Graphic Design", "+ Brand Copywriting", "+ Newsletter Content", "+ Visual Storytelling"],
      img: S3a,
      tabImg: S3b,
    },
    {
      id: "service_4",
      slug: "meta-ads",
      title: "Meta Ads (Facebook & Instagram)",
      desc: "We design, launch, and optimize targeted ad campaigns on Facebook and Instagram to maximize your ROI and reach the right audience at the right time.",
      items: ["+ Audience Targeting", "+ Creative Ad Design", "+ A/B Testing", "+ Budget Optimization", "+ Retargeting Campaigns", "+ Performance Tracking"],
      img: S4a,
      tabImg: S4b,
    },
    {
      id: "service_5",
      slug: "google-ads",
      title: "Google Ads",
      desc: "We manage Google Ads campaigns across Search, Display, and YouTube to drive qualified traffic and generate measurable leads for your business.",
      items: ["+ Search Campaigns", "+ Display & Video Ads", "+ Keyword Research", "+ Bid Management", "+ Conversion Tracking", "+ ROI Reporting"],
      img: S5a,
      tabImg: S1c,
    },
    {
      id: "service_6",
      slug: "seo",
      title: "SEO (Search Engine Optimization)",
      desc: "We improve your organic visibility through technical SEO, on-page optimization, content strategy, and link building to help you rank higher on Google.",
      items: ["+ Technical SEO Audit", "+ On-Page Optimization", "+ Content Strategy", "+ Link Building", "+ Local SEO", "+ Monthly Reporting"],
      img: S1b,
      tabImg: S2c,
    },
    {
      id: "service_7",
      slug: "brand-identity",
      title: "Brand Identity",
      desc: "We craft memorable brand identities — from logo design and color systems to typography and brand guidelines — that communicate your values and stand out in the market.",
      items: ["+ Logo Design", "+ Color & Typography", "+ Brand Guidelines", "+ Visual Identity", "+ Brand Strategy", "+ Collateral Design"],
      img: S2b,
      tabImg: S3c,
    },
    {
      id: "service_8",
      slug: "comparator-creation",
      title: "Comparator Creation",
      desc: "We build custom comparison platforms and tools that help your users make informed decisions, positioning your brand as a trusted authority in your industry.",
      items: ["+ Custom Platform Design", "+ Data Integration", "+ User Experience Design", "+ Comparison Engine", "+ Analytics Dashboard", "+ Scalable Architecture"],
      img: S3b,
      tabImg: S4a,
    },
    {
      id: "service_9",
      slug: "consulting-support",
      title: "Consulting & Support",
      desc: "We provide strategic digital consulting and ongoing support to help you navigate the evolving digital landscape and achieve sustained growth.",
      items: ["+ Digital Strategy", "+ Performance Audit", "+ Technology Consulting", "+ Training & Workshops", "+ Ongoing Support", "+ Growth Roadmap"],
      img: S4b,
      tabImg: S5a,
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        if (device_width > 1200) {
          gsap.to(".service__list-6", {
            scrollTrigger: {
              trigger: ".service__area-6",
              pin: ".service__list-6",
              pinSpacing: true,
              start: "top top",
              end: "bottom bottom",
            },
          });

          gsap.to(".service__image-wrap", {
            scrollTrigger: {
              trigger: ".service__area-6",
              pin: ".mid-content",
              pinSpacing: true,
              start: "top top",
              end: "bottom bottom",
              markers: false,
            },
          });

          let service_images = gsap.utils.toArray(".service__image");
          let service_imagess = gsap.utils.toArray(".service__image img");
          let service_items = gsap.utils.toArray(".service__item-6");

          if (service_items) {
            service_items.forEach((image, i) => {
              let tl = gsap.timeline({
                scrollTrigger: {
                  trigger: image,
                  scrub: 1,
                  start: "top top-=600",
                  markers: false,
                },
              });
              tl.to(service_images[i], { zIndex: "1" });
              tl.to(service_imagess[i], { opacity: 0, duration: 1, scale: 1.2, ease: "power4.out" }, "-=1");
            });
          }

          let navItems = gsap.utils.toArray(".service__list-6 li a");
          if (navItems) {
            navItems.forEach((nav) => {
              nav.addEventListener("click", (e) => {
                e.preventDefault();
                const ids = nav.getAttribute("href");
                gsap.to(window, { duration: 0.5, scrollTo: ids, ease: "power4.out" });
              });
            });
          }
        }
      });
      return () => tHero.revert();
    }
  }, []);

  return (
    <>
      <section className="service__area-6">
        <div className="container">
          <div className="row inherit-row">
            <div className="col-xxl-12">
              <div className="content-wrapper">
                <div className="left-content">
                  <ul className="service__list-6">
                    {services.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`}>
                          {s.title.split(" ").slice(0, Math.ceil(s.title.split(" ").length / 2)).join(" ")} <br />
                          {s.title.split(" ").slice(Math.ceil(s.title.split(" ").length / 2)).join(" ")}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mid-content">
                  {services.map((s, i) => (
                    <div className="service__image" key={i}>
                      <Image priority width={600} height={800} style={{ width: "auto", height: "auto" }} src={s.img} alt={s.title} />
                    </div>
                  ))}
                </div>

                <div className="right-content">
                  <div className="service__items-6">
                    {services.map((s) => (
                      <div className="service__item-6 has__service_animation" id={s.id} key={s.id} data-secid={s.id.split("_")[1]}>
                        <div className="image-tab">
                          <Image priority width={600} height={800} style={{ width: "auto", height: "auto" }} src={s.tabImg} alt={s.title} />
                        </div>
                        <div className="animation__service_page">
                          <h2 className="service__title-6">{s.title}</h2>
                          <p>{s.desc}</p>
                          <ul>
                            {s.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                          <div className="btn_wrapper">
                            <Link href={`/service-details/${s.slug}`} className="wc-btn-secondary btn-item btn-hover">
                              <span></span>Learn more
                              <br />
                              <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default Service1;
