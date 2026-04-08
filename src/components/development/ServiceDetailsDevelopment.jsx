import { useEffect, useRef } from "react";
import Image from "next/image";
import animationCharCome from "@/lib/utils/animationCharCome";

const ServiceDetailsDevelopment = ({ title, description1, description2, tags, img1, img2, img1Alt, img2Alt }) => {
  const charAnim = useRef();
  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);
  return (
    <>
      <section className="development__area">
        <div className="container g-0 line pt-130 pb-150">
          <div className="line-3"></div>
          <div className="row">
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="sec-title-wrapper">
                <h2 className="sec-title animation__char_come" ref={charAnim}>
                  {title}
                </h2>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
              <div className="development__wrapper">
                <div className="development__content">
                  <p>{description1}</p>
                  <p>{description2}</p>
                </div>
                <ul>
                  {tags.map((tag, i) => (
                    <li key={i}>+ {tag}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-xxl-8 col-xl-8 col-lg-8 col-md-8">
              <div className="development__img">
                <Image priority width={800} height={600} style={{ width: "100%", height: "auto" }} src={img1} alt={img1Alt} data-speed="auto" />
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <div className="development__img">
                <Image priority width={400} height={600} style={{ width: "100%", height: "auto" }} src={img2} alt={img2Alt} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailsDevelopment;
