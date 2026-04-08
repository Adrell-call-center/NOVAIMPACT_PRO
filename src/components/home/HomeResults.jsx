import Link from "next/link";
import Image from "next/image";

const img1 = "/images/results-analytics.webp";
const img2 = "/images/results-data.webp";
const img3 = "/images/results-social-media.webp";

const results = [
  {
    service: "SEO",
    stat: "+340%",
    label: "Organic traffic",
    desc: "Average organic traffic increase across our client portfolio within 6 months of SEO engagement.",
    img: img1,
    href: "/service-details/seo",
  },
  {
    service: "Google Ads",
    stat: "3×",
    label: "Lead volume",
    desc: "Our Google Ads campaigns deliver 3× more qualified leads compared to the industry average cost-per-lead.",
    img: img2,
    href: "/service-details/google-ads",
  },
  {
    service: "Meta Ads",
    stat: "97%",
    label: "Client retention",
    desc: "97% of our clients renew or expand their engagement after the first project — the real measure of results.",
    img: img3,
    href: "/service-details/meta-ads",
  },
];

const HomeResults = () => {
  return (
    <section style={{ background: "#0d0d0d", padding: "120px 0" }}>
      <div className="container">
        <div className="row" style={{ marginBottom: "70px" }}>
          <div className="col-xxl-6 col-xl-6 col-lg-7">
            <h2 className="sec-sub-title" style={{ color: "#FFC81A" }}>Proven Results</h2>
            <h3 className="sec-title" style={{ color: "#fff" }}>
              Numbers that speak<br />for themselves
            </h3>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-5" style={{ display: "flex", alignItems: "flex-end" }}>
            <p style={{ color: "#888", lineHeight: "1.8", marginBottom: 0 }}>
              We don't just run campaigns — we build growth engines. Here's what our clients see when they work with Nova Impact.
            </p>
          </div>
        </div>

        <div className="row">
          {results.map((r, i) => (
            <div key={i} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6" style={{ marginBottom: "32px" }}>
              <Link href={r.href} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  background: "#1a1a1a",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ overflow: "hidden", height: "220px" }}>
                    <Image
                      width={800}
                      height={534}
                      style={{ width: "100%", height: "220px", objectFit: "cover" }}
                      src={r.img}
                      alt={`${r.service} results for Nova Impact clients`}
                    />
                  </div>
                  <div style={{ padding: "32px" }}>
                    <span style={{
                      display: "inline-block",
                      background: "#FFC81A",
                      color: "#000",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: "20px",
                      marginBottom: "20px",
                      fontFamily: "Kanit, sans-serif",
                      letterSpacing: "0.05em",
                    }}>{r.service}</span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ fontSize: "48px", fontWeight: 700, color: "#fff", fontFamily: "Kanit, sans-serif", lineHeight: 1 }}>{r.stat}</span>
                      <span style={{ color: "#FFC81A", fontSize: "14px", fontWeight: 500 }}>{r.label}</span>
                    </div>
                    <p style={{ color: "#888", lineHeight: "1.7", fontSize: "14px", margin: 0 }}>{r.desc}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "60px", textAlign: "center" }}>
          <Link href="/portfolio" className="wc-btn-black btn-hover btn-item">
            <span></span>View Our Work <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeResults;
