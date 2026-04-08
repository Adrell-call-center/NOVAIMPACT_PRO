import Link from "next/link";

const Career1 = () => {
  return (
    <>
      <section className="job__area pt-130 pb-150" id="job_list">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper">
                <h2 className="sec-title title-anim">
                  We’re Currently <br />
                  hiring
                </h2>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="job__list">
                <Link href="/job-details">
                  <div className="job__item">
                    <p className="job__no">01</p>
                    <h3 className="job__title">UI/UX Designer</h3>
                    <h4 className="job__open">(02 Open Roles)</h4>
                    <div className="job__link">
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
                <Link href="/job-details">
                  <div className="job__item">
                    <p className="job__no">02</p>
                    <h3 className="job__title">Frontend Developer</h3>
                    <h4 className="job__open">(07 Open Roles)</h4>
                    <div className="job__link">
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
                <Link href="/job-details">
                  <div className="job__item">
                    <p className="job__no">03</p>
                    <h3 className="job__title">Product Manager</h3>
                    <h4 className="job__open">(15 Open Roles)</h4>
                    <div className="job__link">
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
                <Link href="/job-details">
                  <div className="job__item">
                    <p className="job__no">04</p>
                    <h3 className="job__title">JavaScript Engineer</h3>
                    <h4 className="job__open">(03 Open Roles)</h4>
                    <div className="job__link">
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
                <Link href="/job-details">
                  <div className="job__item">
                    <p className="job__no">05</p>
                    <h3 className="job__title">Joomla Developer</h3>
                    <h4 className="job__open">(09 Open Roles)</h4>
                    <div className="job__link">
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Career1;
