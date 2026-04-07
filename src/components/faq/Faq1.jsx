import animationCharCome from "@/lib/utils/animationCharCome";
import { useEffect, useRef } from "react";
import { Accordion } from "react-bootstrap";

const Faq1 = () => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);
  return (
    <>
      <section className="faq__area-6">
        <div className="container g-0 line pt-130 pb-140">
          <div className="line-3"></div>
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper">
                <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                  FAQ
                </h2>
                <p className="">
                  Frequently asked questions about Nova Impact's services.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-12">
              <div className="faq__list-6">
                <Accordion
                  defaultActiveKey="0"
                  className="accordion"
                  id="accordionExample"
                >
                  <Accordion.Item eventKey=”0” className=”accordion-item”>
                    <Accordion.Header
                      className=”accordion-header”
                      id=”headingOne”
                    >
                      What services does Nova Impact offer?
                    </Accordion.Header>

                    <Accordion.Body className=”accordion-body”>
                      <p>
                        We offer website creation, social media management, content creation, Meta Ads (Facebook & Instagram), Google Ads, SEO, brand identity, comparator creation, and consulting & support.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey=”1” className=”accordion-item”>
                    <Accordion.Header
                      className=”accordion-header”
                      id=”headingTwo”
                    >
                      How long does a website project take?
                    </Accordion.Header>

                    <Accordion.Body className=”accordion-body”>
                      <p>
                        Depending on complexity, most websites are delivered within 4–8 weeks from kickoff to launch.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey=”2” className=”accordion-item”>
                    <Accordion.Header
                      className=”accordion-header”
                      id=”headingThree”
                    >
                      Do you work with small businesses?
                    </Accordion.Header>

                    <Accordion.Body className=”accordion-body”>
                      <p>
                        Yes. We work with businesses of all sizes, from startups to established brands looking to grow their online presence.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey=”3” className=”accordion-item”>
                    <Accordion.Header
                      className=”accordion-header”
                      id=”headingFour”
                    >
                      How do I get started?
                    </Accordion.Header>

                    <Accordion.Body className=”accordion-body”>
                      <p>
                        Simply contact us via our contact page or email contact@novaimpact.co. We’ll schedule a free discovery call to understand your goals.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>

                  <Accordion.Item eventKey=”4” className=”accordion-item”>
                    <Accordion.Header
                      className=”accordion-header”
                      id=”headingFive”
                    >
                      What makes Nova Impact different?
                    </Accordion.Header>

                    <Accordion.Body className=”accordion-body”>
                      <p>
                        We’re results-driven. Every strategy we deploy is focused on measurable business outcomes — not vanity metrics. We combine creativity, technology, and data to deliver real growth.
                      </p>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq1;
