import Career2 from "../../../public/assets/imgs/career/2.jpg";
import Career3 from "../../../public/assets/imgs/career/3.jpg";
import Career4 from "../../../public/assets/imgs/career/4.jpg";
import Career5 from "../../../public/assets/imgs/career/5.jpg";
import Image from "next/image";

const CareerGallery = () => {
  return (
    <>
      <section className="career__gallery">
        <div className="container g-0 line pt-140 pb-140">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-12">
              <ul>
                <li>Future</li>
                <li>Community</li>
                <li>Honor</li>
              </ul>
              <p>
                What sets us apart is what brings us together – a shared passion
                for solving business challenges through strategy, design, and
                engineering. We are the sum total of our team, their unique
                perspectives, capabilities, and our ability to collaborate from
                ideation to deployment.
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
              <div className="career__gallery-img">
                <Image
                  priority
                  width={300}
                  style={{ height: "auto" }}
                  src={Career2}
                  alt="Image"
                />
              </div>
            </div>
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="career__gallery-img img-anim">
                <Image
                  priority
                  width={520}
                  style={{ height: "auto" }}
                  src={Career3}
                  alt="Image"
                  data-speed="auto"
                />
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <div className="career__gallery-img">
                <Image
                  priority
                  width={230}
                  style={{ height: "auto" }}
                  src={Career4}
                  alt="Image"
                />
                <Image
                  priority
                  width={410}
                  style={{ height: "auto" }}
                  src={Career5}
                  alt="Image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CareerGallery;
