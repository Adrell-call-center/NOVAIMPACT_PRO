import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Discovery Call",
    desc: "We start by understanding your business, your audience, your competitors, and your goals — building the full picture before touching anything.",
  },
  {
    num: "02",
    title: "Custom Strategy",
    desc: "No templates. We design a tailored digital strategy covering the right channels, formats, timelines, and KPIs specific to your market.",
  },
  {
    num: "03",
    title: "Execution",
    desc: "Our team builds and launches — websites, campaigns, content, or ads — with precision and creative excellence, on time, every time.",
  },
  {
    num: "04",
    title: "Measure & Scale",
    desc: "We track everything and optimize continuously. What works gets scaled. What doesn't gets fixed. You get clear monthly reporting.",
  },
];

const HomeProcess = () => {
  return (
    <section style={{ padding: "120px 0", background: "#fff" }}>
      <div className="container">
        <div className="row" style={{ marginBottom: "70px" }}>
          <div className="col-xxl-6 col-xl-6 col-lg-6">
            <h2 className="sec-sub-title title-anim">Our Process</h2>
            <h3 className="sec-title title-anim">
              How we turn your<br />goals into results
            </h3>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6" style={{ display: "flex", alignItems: "flex-end" }}>
            <p style={{ color: "#555", lineHeight: "1.8", marginBottom: "0" }}>
              Every engagement follows the same proven process — from discovery to scaling — so you always know where we are and what comes next.
            </p>
          </div>
        </div>

        <div className="row">
          {steps.map((s, i) => (
            <div key={i} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6" style={{ marginBottom: "32px" }}>
              <div style={{
                borderTop: "2px solid #FFC81A",
                paddingTop: "32px",
                height: "100%",
              }}>
                <span style={{
                  display: "block",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "#f0f0f0",
                  fontFamily: "Kanit, sans-serif",
                  lineHeight: 1,
                  marginBottom: "16px",
                }}>{s.num}</span>
                <h4 style={{ fontSize: "20px", fontWeight: 600, color: "#1a1a1a", marginBottom: "14px" }}>{s.title}</h4>
                <p style={{ color: "#666", lineHeight: "1.8", fontSize: "15px", margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "60px" }}>
          <Link href="/about" style={{ color: "#1a1a1a", fontWeight: 500, textDecoration: "underline", fontSize: "15px" }}>
            Learn more about us →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProcess;
