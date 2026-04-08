import animationCharCome from "@/lib/utils/animationCharCome";
import { useEffect, useRef } from "react";
import { Accordion } from "react-bootstrap";
import Link from "next/link";

const faqs = [
  {
    q: "What services does Nova Impact offer?",
    a: "We offer a full suite of digital services: website creation, SEO, Meta Ads (Facebook & Instagram), Google Ads, social media management, content creation, brand identity, comparator creation, and consulting & support. Whether you need a single service or a full digital strategy, we tailor our approach to your goals.",
  },
  {
    q: "How long does a website project typically take?",
    a: "Most websites are delivered within 4–8 weeks from kickoff to launch, depending on complexity. A landing page or simple site can be ready in 2 weeks, while a full platform with custom features may take 10–12 weeks. We'll give you a clear timeline before we start.",
  },
  {
    q: "Do you work with businesses outside France?",
    a: "Yes. We work with clients across France, the UK, Morocco, and beyond. Our team is based in Marseille, London, and Agadir, and we work remotely with clients worldwide.",
  },
  {
    q: "How much does a project cost?",
    a: "Every project is scoped individually based on your objectives, deliverables, and timeline. We offer transparent pricing with no hidden fees. Contact us for a free discovery call and we'll provide a detailed quote within 48 hours.",
  },
  {
    q: "What makes Nova Impact different from other agencies?",
    a: "We are results-driven first. Every strategy we deploy is tied to measurable business outcomes — not vanity metrics. We combine creative design, technical SEO, paid media expertise, and data analytics to deliver real, sustainable growth. We also act as a long-term partner, not a one-off vendor.",
  },
  {
    q: "Do you offer SEO services for new websites?",
    a: "Yes. We build SEO into every website we create from day one — site structure, meta tags, page speed, schema markup, and content strategy. We also offer standalone SEO audits and ongoing SEO campaigns for existing websites.",
  },
  {
    q: "Can you manage our Google Ads and Meta Ads campaigns?",
    a: "Absolutely. We manage end-to-end paid advertising campaigns on Google (Search, Display, Shopping) and Meta (Facebook & Instagram). We handle strategy, creative, targeting, budget management, and monthly reporting.",
  },
  {
    q: "What is a comparator and do I need one?",
    a: "A comparator is a platform that allows users to compare products or services (insurance, loans, energy, etc.) and generate qualified leads. If your business operates in a comparison or lead generation market, a comparator is a powerful tool. We've built comparators for the insurance sector and can adapt the model to your industry.",
  },
  {
    q: "How do I get started?",
    a: "Simply reach out via our contact page or email us at contact@novaimpact.io. We'll schedule a free 30-minute discovery call to understand your goals, then propose a tailored action plan within 48 hours.",
  },
  {
    q: "Do you offer ongoing support after a project is delivered?",
    a: "Yes. We offer monthly maintenance and support packages covering updates, performance monitoring, content publishing, and ongoing digital marketing management. Many of our clients work with us on a retainer basis after their initial project.",
  },
];

const Faq1 = ({ limit, showLink }) => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  const displayed = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className="faq__area-6">
      <div className="container g-0 line pt-140 pb-140">
        <div className="line-3"></div>
        <div className="row">
          <div className="col-xxl-12">
            <div className="sec-title-wrapper">
              <h2 className="sec-sub-title">FAQ</h2>
              <h3 className="sec-title animation__char_come" ref={charAnim}>
                Frequently Asked <br /> Questions
              </h3>
              <p>Everything you need to know about working with Nova Impact.</p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xxl-12">
            <div className="faq__list-6">
              <Accordion defaultActiveKey="0" className="accordion" id="accordionFaq">
                {displayed.map((item, i) => (
                  <Accordion.Item key={i} eventKey={String(i)} className="accordion-item">
                    <Accordion.Header className="accordion-header">
                      {item.q}
                    </Accordion.Header>
                    <Accordion.Body className="accordion-body">
                      <p>{item.a}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>

        {showLink && (
          <div className="row mt-5">
            <div className="col-xxl-12 text-center">
              <Link href="/faq" className="wc-btn-primary btn-hover btn-item">
                <span></span> See all FAQs <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Faq1;
