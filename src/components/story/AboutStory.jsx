import Image from "next/image";

const Story1 = "/images/story-consulting-team.webp";
const Story2 = "/images/about-team-meeting.webp";
const Story3 = "/images/story-strategy-meeting.webp";
const Story4 = "/images/story-social-media-team.webp";

const AboutStory = () => {
  return (
    <>
      <section className="story__area">
        <div className="container g-0 line pt-140">
          <span className="line-3"></span>
          <div className="sec-title-wrapper">
            <div className="from-text">
              since <span>2022</span>
            </div>

            <div className="row">
              <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                <h2 className="sec-sub-title title-anim">NOVA IMPACT</h2>
                <h3 className="sec-title title-anim">Who Are We?</h3>
              </div>
              <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                <div className="story__text">
                  <p>
                    Nova Impact was founded in 2022 with a clear mission: help businesses grow online through strategy, creativity, and performance-driven marketing. We are a team of digital experts — strategists, designers, developers, and marketers — united by a passion for measurable results.
                  </p>
                  <p>
                    Based in London and Marseille, we work with brands across the UK, France, Morocco, and internationally. Our services cover every pillar of digital growth: website creation, SEO, Meta Ads, Google Ads, social media management, content creation, brand identity, and lead generation platforms. Whatever your goal, we build the strategy and execute it with precision.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3">
              <div className="story__img-wrapper">
                <Image
                  priority
                  width={300}
                  height={450}
                  style={{ width: "100%", height: "auto" }}
                  src={Story1}
                  alt="Nova Impact team member working on a digital strategy"
                  className="w-100"
                />
              </div>
            </div>
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="story__img-wrapper img-anim">
                <Image
                  priority
                  width={520}
                  height={346}
                  style={{ width: "100%", height: "auto" }}
                  src={Story2}
                  alt="Nova Impact team collaborating on a client project"
                  data-speed="auto"
                />
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <div className="story__img-wrapper">
                <Image
                  priority
                  width={230}
                  height={153}
                  style={{ width: "100%", height: "auto" }}
                  src={Story3}
                  alt="Digital marketing strategy planning session"
                />
                <Image
                  priority
                  width={410}
                  height={273}
                  style={{ width: "100%", height: "auto" }}
                  src={Story4}
                  alt="Agency team presenting results to a client"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutStory;
