import Link from "next/link";
const ThumbFooter = "/images/footer-background.webp";
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
            height={773}
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
                  {/* Widget 1 - About */}
                  <div className="footer__widget">
                    <Image
                      priority
                      width={160}
                      height={50}
                      style={{ width: "auto", height: "45px", objectFit: "contain" }}
                      className="footer__logo"
                      src={FooterLogoWhite}
                      alt="Nova Impact Logo"
                    />
                    <p>
                      Nova Impact Agency is a communication and digital solutions agency helping brands and businesses grow through strategy, technology, and performance-driven digital experiences. Turning ideas into impact.
                    </p>
                    <ul className="footer__social">
                      <li>
                        <a href="https://www.youtube.com/@novaimpactagency" target="_blank" rel="noopener noreferrer">
                          <span><i className="fa-brands fa-youtube"></i></span>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.linkedin.com/company/nova-impact-io/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                          <span><i className="fa-brands fa-linkedin"></i></span>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/novaimpact.io/" target="_blank" rel="noopener noreferrer">
                          <span><i className="fa-brands fa-instagram"></i></span>
                        </a>
                      </li>
                      <li>
                        <a href="https://x.com/ImpactNova_io" target="_blank" rel="noopener noreferrer">
                          <span><i className="fa-brands fa-x-twitter"></i></span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Widget 2 - Services */}
                  <div className="footer__widget-2">
                    <h2 className="footer__widget-title">Services</h2>
                    <ul className="footer__link">
                      <li><Link href="/service-details/website-creation">Website Creation</Link></li>
                      <li><Link href="/service-details/social-media-management">Social Media Management</Link></li>
                      <li><Link href="/service-details/content-creation">Content Creation</Link></li>
                      <li><Link href="/service-details/meta-ads">Meta Ads</Link></li>
                      <li><Link href="/service-details/google-ads">Google Ads</Link></li>
                      <li><Link href="/service-details/seo">SEO</Link></li>
                      <li><Link href="/service-details/brand-identity">Brand Identity</Link></li>
                      <li><Link href="/service-details/comparator-creation">Comparator Creation</Link></li>
                      <li><Link href="/service-details/consulting-support">Consulting & Support</Link></li>
                    </ul>
                  </div>

                  {/* Widget 3 - Contact */}
                  <div className="footer__widget-3">
                    <h2 className="footer__widget-title">Contact</h2>
                    <ul className="footer__contact">
                      <li>
                        <strong>Marseille</strong><br />
                        Bureau 3, 154 Rue de Rome, 13006 Marseille (France)
                      </li>
                      <li>
                        <strong>London</strong><br />
                        71-75 Shelton Street, Covent Garden, WC2H 9JQ (UK)
                      </li>
                      <li>
                        <strong>Agadir</strong><br />
                        Rue 204 Imm Afouize, Quartier Industriel, Agadir (Morocco)
                      </li>
                      <li>
                        <a href="mailto:contact@novaimpact.io">contact@novaimpact.io</a>
                      </li>
                      <li>
                        <a href="tel:+447477884817">+44 7477884817</a>
                      </li>
                      <li>
                        <a href="tel:+33980801417">+33 980801417</a>
                      </li>
                    </ul>
                  </div>

                  {/* Widget 4 - CTA */}
                  <div className="footer__widget-4">
                    <h2 className="project-title">Have a project in your mind?</h2>
                    <p style={{ color: "var(--gray-2)", fontSize: "15px", marginBottom: "20px" }}>
                      Chaque marque est unique. Nous analysons vos objectifs concrets : développer votre visibilité, générer des leads, construire une image forte.
                    </p>
                    <div className="btn_wrapper">
                      <Link href="/contact" className="wc-btn-primary btn-hover btn-item">
                        <span></span> Contact us <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="footer__copyright">
                    <p>©2026 – Copyright NOVAIMPACT</p>
                    <ul className="footer__legal">
                      <li><Link href="/mentions-legales">Mentions légales</Link></li>
                      <li><Link href="/politique-confidentialite">Politique de confidentialité et de cookies</Link></li>
                      <li><Link href="/refund-policy">Refund Policy</Link></li>
                      <li><Link href="/terms-of-service">Terms of Service</Link></li>
                    </ul>
                  </div>

                  {/* Newsletter */}
                  <div className="footer__subscribe">
                    <form action="#">
                      <input type="email" name="email" placeholder="Enter your email" />
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
