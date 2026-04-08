import { Accordion } from "react-bootstrap";
import Image from "next/image";

const ServiceDetailsFaq = ({
  faqImg = "/images/faq-office.webp",
  faqImgAlt = "FAQ",
  title = "Frequently Asked Questions",
  faqs = [
    { question: "How long does the process take?", answer: "The timeline depends on the scope and complexity of your project. We typically provide a detailed schedule during our initial consultation to ensure clear expectations and milestones." },
    { question: "Do you offer ongoing support?", answer: "Yes, we provide ongoing support and maintenance packages to ensure your project continues to perform optimally after launch." },
    { question: "How do we communicate during the project?", answer: "We use a combination of email, video calls, and project management tools to keep you updated throughout every phase of the project." },
    { question: "What is your pricing model?", answer: "We offer flexible pricing models including project-based and retainer options. We'll provide a custom quote based on your specific needs and goals." },
  ]
}) => {
  return (
    <>
      <section className="faq__area">
        <div className="container g-0 line pb-140">
          <div className="line-3"></div>
          <div className="row">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="faq__img">
                <Image
                  priority
                  width={600}
                  height={800}
                  style={{ width: "100%", height: "auto" }}
                  src={faqImg}
                  alt={faqImgAlt}
                  data-speed="auto"
                />
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="faq__content">
                <h2 className="faq__title title-anim">{title}</h2>
                <div className="faq__list">
                  <Accordion defaultActiveKey="0" className="accordion" id="accordionExample">
                    {faqs.map((faq, i) => (
                      <Accordion.Item key={i} eventKey={String(i)} className="accordion-item">
                        <Accordion.Header className="accordion-header">{faq.question}</Accordion.Header>
                        <Accordion.Body className="accordion-body">
                          <p>{faq.answer}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailsFaq;
