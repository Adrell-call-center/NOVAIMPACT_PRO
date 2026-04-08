import animationCharCome from "@/lib/utils/animationCharCome";
import animationWordCome from "@/lib/utils/animationWordCome";
import { useEffect, useRef, useState } from "react";

const Contact1 = () => {
  const charAnim = useRef();
  const wordAnim = useRef();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    animationCharCome(charAnim.current);
    animationWordCome(wordAnim.current);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
    setLoading(false);
  };
  return (
    <>
      <section className="contact__area-6">
        <div className="container g-0 line pt-120 pb-110">
          <span className="line-3"></span>
          <div className="row">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                  Let’s Get in Touch
                </h2>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
              <div className="contact__text">
                <p>
                  {
                    "We're excited to hear from you. Let's build something great together."
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="row contact__btm">
            <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
              <div className="contact__info">
                <h3
                  className="sub-title-anim-top animation__word_come"
                  ref={wordAnim}
                >
                  {"Say hello to Nova Impact"}
                </h3>
                <ul>
                  <li>
                    <a href="tel:+447477884817">+44 7477 884817</a>
                  </li>
                  <li>
                    <a href="tel:+33980801417">+33 980 801 417</a>
                  </li>
                  <li>
                    <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>
                  </li>
                  <li>
                    <span>Marseille · London · Agadir</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
              <div className="contact__form">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input type="text" name="name" placeholder="Name *" required />
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input type="email" name="email" placeholder="Email *" required />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input type="tel" name="phone" placeholder="Phone" />
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-12">
                      <input type="text" name="subject" placeholder="Subject *" required />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <textarea name="message" placeholder="Messages *" required></textarea>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="btn_wrapper">
                        <button className="wc-btn-primary btn-hover btn-item" disabled={loading}>
                          <span></span> {loading ? "Sending..." : <>Send <br /> Message</>} <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                      {status === "success" && <p style={{ color: "#FFC81A", marginTop: "12px" }}>✓ Message sent successfully!</p>}
                      {status === "error" && <p style={{ color: "red", marginTop: "12px" }}>Something went wrong. Please try again.</p>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact1;
