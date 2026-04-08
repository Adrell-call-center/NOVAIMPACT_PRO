import Shape6 from "../../../public/assets/imgs/icon/shape-6.png";
import Image from "next/image";

const ServiceDetailsService = ({
  img = "/images/service-details-main.webp",
  imgAlt = "Service detail",
  heading = "We deliver measurable results through strategy, creativity, and technical expertise.",
  body1 = "Every project we take on is built around a clear objective: helping your business grow online. We combine data-driven strategy with creative execution to produce work that performs.",
  body2 = "Our team stays ahead of industry trends and platform changes to ensure your investment delivers sustained results — not just short-term spikes.",
}) => {
  return (
    <>
      <section className="service__detail">
        <div className="container g-0 line pb-140">
          <div className="line-3"></div>
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper">
                <h2 className="sec-title title-anim">{heading}</h2>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
              <div className="service__detail-circle">
                <span></span>
              </div>
            </div>
            <div className="col-xxl-9 col-xl-9 col-lg-9 col-md-9">
              <div className="service__detail-img">
                <Image
                  priority
                  width={960}
                  height={540}
                  style={{ width: "100%", height: "auto" }}
                  src={img}
                  alt={imgAlt}
                />
                <Image
                  priority
                  width={51}
                  height={51}
                  style={{ height: "auto" }}
                  src={Shape6}
                  alt="decorative shape"
                  className="sd-shape"
                />
              </div>
              <div className="service__detail-content">
                <p>{body1}</p>
                <p>{body2}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailsService;
