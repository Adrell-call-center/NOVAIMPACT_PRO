import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";

gsap.registerPlugin(ScrollTrigger);

const serviceImages = [
  "/images/service-grid-web-dev.webp",
  "/images/service-grid-seo.webp",
  "/images/service-grid-meta-ads.webp",
  "/images/service-grid-google-ads.webp",
  "/images/service-grid-social-mgmt.webp",
  "/images/service-grid-content-a.webp",
  "/images/service-grid-collaboration.webp",
  "/images/service-grid-technology.webp",
  "/images/service-grid-analytics.webp",
];

const services = [
  { title: "Website Creation", slug: "website-creation", desc: "Modern, fast websites designed to convert visitors into customers." },
  { title: "SEO", slug: "seo", desc: "Rank higher on Google and drive organic traffic to your business." },
  { title: "Meta Ads", slug: "meta-ads", desc: "Targeted Facebook & Instagram campaigns that maximize ROI." },
  { title: "Google Ads", slug: "google-ads", desc: "Search & display ads that bring qualified leads to your door." },
  { title: "Social Media Management", slug: "social-media-management", desc: "Build and engage your community across all platforms." },
  { title: "Content Creation", slug: "content-creation", desc: "Compelling visuals and copy that tell your brand story." },
  { title: "Brand Identity", slug: "brand-identity", desc: "Distinctive branding that makes your business unforgettable." },
  { title: "Comparator Creation", slug: "comparator-creation", desc: "Custom comparison platforms tailored to your niche." },
  { title: "Consulting & Support", slug: "consulting-support", desc: "Expert guidance to optimize your digital strategy." },
];

const ServiceGrid = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let tHero = gsap.context(() => {
      const items = gsap.utils.toArray(".service-grid-item");
      gsap.set(items, { opacity: 0, y: 40 });

      gsap.to(items, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top center+=200",
          markers: false,
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, gridRef);

    return () => tHero.revert();
  }, []);

  return (
    <section className="service-grid-section pt-130 pb-130">
      <div className="container">
        <div className="row pb-80">
          <div className="col-xxl-8 col-xl-7 col-lg-6">
            <h2 className="sec-title">Our Full Range of Digital Services</h2>
          </div>
          <div className="col-xxl-4 col-xl-5 col-lg-6">
            <p className="service-grid-intro">
              From strategy to execution, we deliver solutions tailored to your goals. Hover over each card to see what we offer.
            </p>
          </div>
        </div>

        <div className="service-grid-wrapper" ref={gridRef}>
          <div className="service-grid">
            {services.map((s, i) => (
              <Link href={`/service-details/${s.slug}`} key={i} className="service-grid-item">
                <div className="service-grid-thumb">
                  {serviceImages[i] && (
                    <Image
                      width={400}
                      height={300}
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                      src={serviceImages[i]}
                      alt={s.title}
                    />
                  )}
                  <div className="service-grid-overlay">
                    <span className="service-grid-arrow">
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </div>
                </div>
                <div className="service-grid-content">
                  <span className="service-grid-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="service-grid-title">{s.title}</h3>
                  <p className="service-grid-desc">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
