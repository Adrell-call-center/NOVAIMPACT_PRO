import Link from "next/link";
import ThumbFooter from "../../../public/assets/imgs/thumb/footer.jpg";
import FooterLogoWhite from "../../../public/assets/imgs/logo/footer-logo-white.png";
import Image from "next/image";

export default function Footer3() {
  return (
    <>
      <footer className="footer__area">
        <div className="footer__top">
          <div className="container footer-line"></div>
          <Image
            priority
            width={1160}
            style={{ height: "auto" }}
            src={ThumbFooter}
            alt="Footer Image"
            data-speed="0.75"
          />
        </div>

        <div className="footer__btm">
          <div className="container">
            <div className="row footer__row">
              <div className="col-xxl-12">
                <div className="footer__inner">
                  <div className="footer__widget">
                    <Image
                      priority
                      style={{ width: "auto", height: "auto" }}
                      className="footer__logo"
                      src={FooterLogoWhite}
                      alt="Footer Logo"
                    />
                    <p>
                      Nova Impact is a digital agency based in Marseille, France,
                      helping brands grow online with strategy, creativity, and
                      technology.
                    </p>
                    <ul className="footer__social">
                      <li>
                        <a href="#">
                          <span>
                            <i className="fa-brands fa-facebook-f"></i>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>
                            <i className="fa-brands fa-twitter"></i>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>
                            <i className="fa-brands fa-instagram"></i>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>
                            <i className="fa-brands fa-linkedin"></i>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="footer__widget-2">
                    <h2 className="footer__widget-title">Services</h2>
                    <ul className="footer__link">
                      <li>
                        <Link href="/service">Website Creation</Link>
                      </li>
                      <li>
                        <Link href="/service">Social Media Management</Link>
                      </li>
                      <li>
                        <Link href="/service">Content Creation</Link>
                      </li>
                      <li>
                        <Link href="/service">Meta Ads</Link>
                      </li>
                      <li>
                        <Link href="/service">Google Ads</Link>
                      </li>
                      <li>
                        <Link href="/service">SEO</Link>
                      </li>
                      <li>
                        <Link href="/service">Brand Identity</Link>
                      </li>
                      <li>
                        <Link href="/service">Comparator Creation</Link>
                      </li>
                      <li>
                        <Link href="/service">Consulting</Link>
                      </li>
                    </ul>
                  </div>

                  <div className="footer__widget-3">
                    <h2 className="footer__widget-title">Contact Us</h2>
                    <ul className="footer__contact">
                      <li>Marseille, France</li>
                      <li>
                        <a href="tel:+33700000000" className="phone">
                          +33 7 00 00 00 00{" "}
                        </a>
                      </li>
                      <li>
                        <a href="mailto:contact@novaimpact.co">
                          contact@novaimpact.co
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="footer__widget-4">
                    <h2 className="project-title">
                      Have a project in your mind?
                    </h2>
                    <div className="btn_wrapper">
                      <Link
                        href="/contact"
                        className="wc-btn-primary btn-hover btn-item"
                      >
                        <span></span> contact us{" "}
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>

                  <div className="footer__copyright">
                    <p>
                      © 2026 Nova Impact — All rights reserved
                    </p>
                  </div>

                  <div className="footer__subscribe">
                    <form action="#">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                      />
                      <button type="submit" className="subs-btn">
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
