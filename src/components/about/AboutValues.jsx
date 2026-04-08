import Image from "next/image";

const img1 = "/images/about-values-workspace.webp";
const img2 = "/images/about-values-brainstorm.webp";

const values = [
  {
    number: "01",
    title: "Results First",
    desc: "Everything we do is measured against one standard: does it grow your business? We don't chase vanity metrics — we focus on leads, sales, and revenue.",
  },
  {
    number: "02",
    title: "Full Transparency",
    desc: "No black boxes. You always know what we're doing, why we're doing it, and what results it's generating. Clear reporting, honest communication, no surprises.",
  },
  {
    number: "03",
    title: "Long-Term Thinking",
    desc: "We build strategies that compound over time — sustainable SEO, strong brand identity, loyal audiences — not quick fixes that fade after a month.",
  },
  {
    number: "04",
    title: "True Partnership",
    desc: "We work as an extension of your team. Your goals become ours. We're invested in your success because when you grow, we grow.",
  },
];

const AboutValues = () => {
  return (
    <section className="about__values" style={{ background: "var(--black-2, #1a1a1a)", padding: "120px 0" }}>
      <div className="container">
        <div className="row">
          <div className="col-xxl-5 col-xl-5 col-lg-5">
            <div style={{ position: "sticky", top: "120px" }}>
              <h2 className="sec-sub-title" style={{ color: "#FFC81A", marginBottom: "16px" }}>Our Values</h2>
              <h3 className="sec-title" style={{ color: "#fff", marginBottom: "32px" }}>
                What drives<br />everything we do
              </h3>
              <p style={{ color: "#999", lineHeight: "1.8", marginBottom: "40px" }}>
                Since 2022, these four principles have shaped every strategy we build, every campaign we run, and every relationship we form with our clients.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ borderRadius: "8px", overflow: "hidden", flex: "1" }}>
                  <Image
                    width={400}
                    height={300}
                    style={{ width: "100%", height: "auto" }}
                    src={img1}
                    alt="Nova Impact team working on digital strategy"
                  />
                </div>
                <div style={{ borderRadius: "8px", overflow: "hidden", flex: "0 0 40%" }}>
                  <Image
                    width={240}
                    height={320}
                    style={{ width: "100%", height: "auto" }}
                    src={img2}
                    alt="Digital agency team collaboration"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-7 col-xl-7 col-lg-7" style={{ paddingLeft: "60px" }}>
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  padding: "40px 0",
                  display: "flex",
                  gap: "32px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#FFC81A", fontFamily: "Kanit, sans-serif", fontSize: "14px", fontWeight: 500, minWidth: "36px", paddingTop: "4px" }}>
                  {v.number}
                </span>
                <div>
                  <h4 style={{ color: "#fff", fontSize: "22px", fontWeight: 600, marginBottom: "12px" }}>{v.title}</h4>
                  <p style={{ color: "#999", lineHeight: "1.8", margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "40px" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
