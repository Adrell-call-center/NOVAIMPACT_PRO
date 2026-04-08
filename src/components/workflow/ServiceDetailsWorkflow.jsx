const ServiceDetailsWorkflow = ({ steps = [
  { title: "Discovery", description: "We analyze your business goals, target audience, and market landscape to build a solid foundation for your project." },
  { title: "Strategy", description: "We develop a comprehensive plan tailored to your objectives, combining creativity with data-driven insights." },
  { title: "Execution", description: "Our team brings the strategy to life with precision, attention to detail, and commitment to quality." },
  { title: "Optimization", description: "We continuously monitor performance, gather feedback, and refine our approach to maximize results." },
] }) => {
  return (
    <>
      <section className="workflow__area-6">
        <div className="container g-0 line pb-130">
          <div className="line-3"></div>
          <div className="workflow__wrapper-6">
            <div className="row">
              {steps.map((step, i) => (
                <div key={i} className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
                  <div className="workflow__slide-6">
                    <h6 className="workflow__title-6">{step.title}</h6>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailsWorkflow;
