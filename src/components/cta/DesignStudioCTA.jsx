import Link from "next/link";

const DesignStudioCTA = () => {
  return (
    <>
      <section className="cta__area-2">
        <div className="container line pt-130 pb-120">
          <div className="line-3"></div>
          <div className="row">
            <div className="col-xxl-12">
              <div className="cta__content-2">
                <p className="cta__sub-title-2 title-anim">
                  Have you project in mind?
                </p>
                <h2 className="cta__title-2 title-anim">
                  Let’s make something great together!
                </h2>
                <div className="btn_wrapper">
                  <Link
                    href="/contact"
                    className="wc-btn-pink btn-hover btn-item"
                  >
                    <span></span>Contact <br />
                    with us <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DesignStudioCTA;
