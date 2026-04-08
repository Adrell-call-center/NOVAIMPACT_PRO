import Link from "next/link";

const services = [
  { title: "Website Creation", desc: "Fast, responsive, SEO-optimized websites built to convert visitors into clients.", href: "/service-details/website-creation", num: "01" },
  { title: "SEO", desc: "Data-driven organic growth strategies that improve your rankings and drive qualified traffic.", href: "/service-details/seo", num: "02" },
  { title: "Meta Ads", desc: "Targeted Facebook and Instagram campaigns that generate leads and sales with measurable ROI.", href: "/service-details/meta-ads", num: "03" },
  { title: "Google Ads", desc: "Search, Display, and YouTube campaigns that put your business in front of ready-to-buy customers.", href: "/service-details/google-ads", num: "04" },
  { title: "Social Media Management", desc: "Full content creation, scheduling, and community management across all major platforms.", href: "/service-details/social-media-management", num: "05" },
  { title: "Content Creation", desc: "SEO articles, copywriting, video scripts, and branded visuals that build authority and trust.", href: "/service-details/content-creation", num: "06" },
  { title: "Brand Identity", desc: "Logo design, color systems, typography, and brand guidelines that make you unforgettable.", href: "/service-details/brand-identity", num: "07" },
  { title: "Comparator Creation", desc: "High-converting comparison platforms and lead generation websites built to scale.", href: "/service-details/comparator-creation", num: "08" },
  { title: "Consulting & Support", desc: "Strategic digital audits, growth roadmaps, and ongoing advisory for ambitious brands.", href: "/service-details/consulting-support", num: "09" },
];

const AboutServices = () => {
  return (
    <section style={{ padding: "120px 0", background: "#fff" }}>
      <div className="container">
        <div className="row" style={{ marginBottom: "60px" }}>
          <div className="col-xxl-6 col-xl-6 col-lg-7">
            <h2 className="sec-sub-title title-anim">What We Do</h2>
            <h3 className="sec-title title-anim">Our full range<br />of digital services</h3>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-5" style={{ display: "flex", alignItems: "flex-end" }}>
            <p style={{ color: "#555", lineHeight: "1.8" }}>
              From your first website to a full-scale digital marketing operation — we cover every pillar of online growth, all under one roof.
            </p>
          </div>
        </div>

        <div className="row">
          {services.map((s, i) => (
            <div key={i} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6" style={{ marginBottom: "2px" }}>
              <Link href={s.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    borderTop: "1px solid #e8e8e8",
                    padding: "32px 24px",
                    transition: "background 0.3s",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <span style={{ color: "#FFC81A", fontSize: "13px", fontWeight: 600, fontFamily: "Kanit, sans-serif" }}>{s.num}</span>
                    <span style={{ fontSize: "18px", color: "#1a1a1a" }}>→</span>
                  </div>
                  <h4 style={{ fontSize: "18px", fontWeight: 600, color: "#1a1a1a", marginBottom: "12px" }}>{s.title}</h4>
                  <p style={{ color: "#777", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{s.desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <Link href="/service" className="wc-btn-primary btn-hover btn-item">
            <span></span>See All Services <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutServices;
