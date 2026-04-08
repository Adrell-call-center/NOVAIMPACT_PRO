import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import JobDetailsModal1 from "./JobDetailsModal1";
import JobDetailsModal2 from "./JobDetailsModal2";

gsap.registerPlugin(ScrollTrigger);

const JobDetails1 = () => {
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        if (device_width > 767) {
          gsap.to(".job__detail-sidebar", {
            scrollTrigger: {
              trigger: ".job__detail",
              pin: ".job__detail-sidebar",
              pinSpacing: false,
              start: "top top",
              end: "bottom center",
              markers: false,
              delay: 1,
            },
          });
        }
      });
      return () => tHero.revert();
    }
  }, []);
  const jobApply = () => {
    setModal1(true);
  };
  return (
    <>
      <section className="job__detail">
        <div className="container g-0 line pb-110">
          <span className="line-3"></span>

          <div className="row">
            <div className="col-xxl-9 col-xl-9 col-lg-8 col-md-8">
              <div className="job__detail-wrapper">
                <h2 className="sec-title">Frontend Developer</h2>
                <ul className="job__detail-meta">
                  <li>
                    <span>Location</span> 2541, Austin, New York
                  </li>
                  <li>
                    <span>Date</span> 24, June 2022
                  </li>
                  <li>
                    <span>Job Type</span> Full time (Remote)
                  </li>
                </ul>
                <div className="job__detail-content">
                  <p>
                    We’re looking for a Junior - Mid-level Designer to join our
                    team. You’ll support the execution of graphic and digital
                    design projects, working closely with the internal team of
                    creatives, project managers, the Creative Director and
                    development team to blend user needs and business goals into
                    seamless, effective design experiences. You will need to
                    demonstrate a fundamental understanding of design
                    principles, an openness to learn and take direction, along
                    with a strong aesthetic design intuition.
                  </p>
                  <h2>What you will do</h2>
                  <ul>
                    <li>
                      Support Growth team in expanding customer base within
                      legal industry as well as new markets
                    </li>
                    <li>
                      Find prospective customer leads via LinkedIn Sales
                      Navigator, industry directories, personal network and
                      other sources
                    </li>
                    <li>
                      Qualify prospective customer leads via email, phone, and
                      Linkedin messaging
                    </li>
                    <li>
                      Track and analyze prospective customer pipeline,
                      presenting stats and progress to Growth team
                    </li>
                    <li>
                      Identify trends in prospective customer engagement with
                      various outreach campaigns
                    </li>
                    <li>
                      Help strategize, implement, and maintain an efficient
                      sales system, primarily within Hubspot Sales and Hubspot
                      Marketing
                    </li>
                    <li>
                      Create and maintain sales and marketing materials, like
                      pricing sheets and feature highlights
                    </li>
                    <li>
                      Support special projects, like event sponsorships and
                      industry partnerships
                    </li>
                    <li>Contribute to customer support initiatives</li>
                  </ul>
                  <h2>Requirements</h2>
                  <ul>
                    <li>
                      Worked with any professional plugin development team or
                      More than one Plugins approved at wordpress.org/CodeCanyon
                    </li>
                    <li>Solid and strong PHP knowledge.</li>
                    <li>
                      Really good understanding in OOP, Namespace, Traits &
                      Design Patterns
                    </li>
                    <li>Intermediate to Advanced JavaScript knowledge.</li>
                    <li>
                      Fluent English speaking and writing is preferred but not
                      required.
                    </li>
                    <li>
                      Writing reusable, testable, secured and efficient PHP,
                      JavaScript, HTML5, CSS3, MySQL and AJAX Code.
                    </li>
                    <li>
                      Excellent knowledge about WP custom post type, custom
                      taxonomy, and custom meta box{" "}
                    </li>
                    <li>
                      Fluent in WordPress, PHP, plugins, themes security,
                      JavaScript, and other technologies
                    </li>
                    <li>
                      Clear concepts of WordPress Actions, Hooks, custom
                      queries, meta fields.
                    </li>
                    <li>
                      Proficient with relational (SQL) and non-relational
                      database platforms
                    </li>
                    <li>
                      Optimize performance of applications utilizing industry
                      standards on all ends of the architecture.
                    </li>
                    <li>
                      Creating database schemas that represent and support
                      business processes.{" "}
                    </li>
                    <li>
                      Coordinating the workflow between the UI/UX Designer, the
                      QA, and yourself.
                    </li>
                    <li>Problem-solving capabilities </li>
                    <li>Age 20 to 35 years</li>
                  </ul>
                  <h2>Educational Qualification</h2>
                  <ul>
                    <li>
                      It doesn’t matter where you went to college or what your
                      CGPA was as long as you are smart, passionate, ready to
                      work hard and have fun.
                    </li>
                  </ul>
                  <h2>Perks & Benefits</h2>
                  <ul>
                    <li>Competitive compensation and equity package</li>
                    <li>
                      99% company paid medical, dental, and vision coverage for
                      employees and dependents (for US employees)
                    </li>
                    <li>
                      Flexible Spending Account (FSA) and Dependent Care
                      Flexible Spending Account (DCFSA)
                    </li>
                    <li>
                      Healthcare reimbursement (for International employees)
                    </li>
                    <li>
                      Life, AD&D, Short and Long Term Disability Insurance
                    </li>
                    <li>401(k) with 4% company matching</li>
                    <li>Professional development reimbursement</li>
                    <li>Wellness stipends</li>
                    <li>Unlimited PTO</li>
                    <li>Paid parental leave</li>
                    <li>Remote work opportunities</li>
                    <li>Home office & technology reimbursement</li>
                  </ul>
                  <p>
                    We’re committed to creating the happiest company working for
                    and is proud to provide equal opportunity to all. All the
                    qualified applicants will receive consideration for
                    employment without regard to race, color, ancestry,
                    religion.
                  </p>
                </div>

                <div className="job__apply btn_wrapper">
                  <button
                    onClick={jobApply}
                    className="wc-btn-primary btn-hover btn-item"
                  >
                    <span></span> Apply this <br />
                    Position <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-4">
              <div className="job__detail-sidebar">
                <ul>
                  <li>
                    <span>Experience</span> 5+ Years Experience
                  </li>
                  <li>
                    <span>Working Hours</span> 08 AM to 05 PM
                  </li>
                  <li>
                    <span>Working Days</span> Weekly 5 days (Sun to Thur)
                  </li>
                  <li>
                    <span>Salary</span> $24k - 65k (Yearly)
                  </li>
                  <li>
                    <span>Vacancy</span> No of Vacancies: 2
                  </li>
                  <li>
                    <span>Deadline</span> 03 July 2022
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>
        <JobDetailsModal1
          modal1={modal1}
          setModal1={setModal1}
          setModal2={setModal2}
        />
        <JobDetailsModal2
          setModal1={setModal1}
          modal2={modal2}
          setModal2={setModal2}
        />
      </div>
    </>
  );
};

export default JobDetails1;
