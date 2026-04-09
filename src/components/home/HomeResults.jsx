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
    <section className="home-results pt-120 pb-120">
      <div className="container">
        <div className="row home-results-header mb-70">
          <div className="col-xxl-6 col-xl-6 col-lg-7">
            <h2 className="sec-sub-title">Proven Results</h2>
            <h3 className="sec-title">
              Numbers that speak<br />for themselves
            </h3>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-5 home-results-desc">
            <p className="home-results-intro">
              We don't just run campaigns — we build growth engines. Here's what our clients see when they work with Nova Impact.
            </p>
          </div>
        </div>

        <div className="row">
          {results.map((r, i) => (
            <div key={i} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 mb-32">
              <Link href={r.href} className="result-card-link">
                <div className="result-card">
                  <div className="result-card-image">
                    <Image
                      width={800}
                      height={534}
                      style={{ width: "100%", height: "220px", objectFit: "cover" }}
                      src={r.img}
                      alt={`${r.service} results for Nova Impact clients`}
                    />
                  </div>
                  <div className="result-card-content">
                    <span className="result-badge">{r.service}</span>
                    <div className="result-stat-row">
                      <span className="result-stat">{r.stat}</span>
                      <span className="result-label">{r.label}</span>
                    </div>
                    <p className="result-desc">{r.desc}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="home-results-cta mt-60 text-center">
          <Link href="/portfolio" className="wc-btn-black btn-hover btn-item">
            <span></span>View Our Work <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeResults;
