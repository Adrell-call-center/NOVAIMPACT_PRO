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
    <section className="home-process pt-120 pb-120">
      <div className="container">
        <div className="row home-process-header mb-70">
          <div className="col-xxl-6 col-xl-6 col-lg-6">
            <h2 className="sec-sub-title title-anim">Our Process</h2>
            <h3 className="sec-title title-anim">
              How we turn your<br />goals into results
            </h3>
          </div>
          <div className="col-xxl-6 col-xl-6 col-lg-6 home-process-desc">
            <p className="home-process-intro">
              Every engagement follows the same proven process — from discovery to scaling — so you always know where we are and what comes next.
            </p>
          </div>
        </div>

        <div className="row">
          {steps.map((s, i) => (
            <div key={i} className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 mb-32">
              <div className="process-step">
                <span className="step-number">{s.num}</span>
                <h4 className="step-title">{s.title}</h4>
                <p className="step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="home-process-cta mt-60">
          <Link href="/about" className="home-process-link">
            Learn more about us →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProcess;
