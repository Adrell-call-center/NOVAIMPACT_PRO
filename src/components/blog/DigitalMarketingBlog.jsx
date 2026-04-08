import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link.js";
import Blog31 from "../../../public/assets/imgs/blog/3/1.jpg";
import Blog32 from "../../../public/assets/imgs/blog/3/2.jpg";
import Image from "next/image.js";

gsap.registerPlugin(ScrollTrigger);

const DigitalMarketingBlog = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".blog__animation .blog__item-3", { x: 50, opacity: 0 });

        if (device_width < 1023) {
          const blogList = gsap.utils.toArray(".blog__animation .blog__item-3");
          blogList.forEach((item, i) => {
            let blogTl = gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: "top center+=200",
              },
            });
            blogTl.to(item, {
              x: 0,
              opacity: 1,
              ease: "power2.out",
              duration: 1.5,
            });
          });
        } else {
          gsap.to(".blog__animation .blog__item-3", {
            scrollTrigger: {
              trigger: ".blog__animation .blog__item-3",
              start: "top center+=300",
              markers: false,
            },
            x: 0,
            opacity: 1,
            ease: "power2.out",
            duration: 2,
            stagger: {
              each: 0.3,
            },
          });
        }
      });
      return () => tHero.revert();
    }
  }, []);
  return (
    <>
      <section className="blog__area-3 pb-140 blog__animation">
        <div className="container">
          <div className="row ">
            <div className="col-xxl-12">
              <div className="sec-title-wrapper text-anim pt-130">
                <h2 className="sec-sub-title">Recent Blog</h2>
                <h3 className="sec-title title-anim">
                  Read Updated <br />
                  Journal
                </h3>
                <p>
                  Read our blog and try to see everything from every
                  perspective. Our passion lies in making everything accessible
                  and aesthetic for everyone.{" "}
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <article className="blog__item-3">
                <div className="blog__img-wrapper-3">
                  <Link href="/blog-details">
                    <div className="img-box">
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog31}
                        alt="Blog Thumbnail"
                      />
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog31}
                        alt="Blog Thumbnail"
                      />
                    </div>
                  </Link>
                </div>
                <div className="blog__info-3">
                  <h4 className="blog__meta">
                    <Link href="/category">UI Design</Link> . 02 May 2019
                  </h4>
                  <h5>
                    <Link href="/blog-details" className="blog__title-3">
                      How to bring fold to your startup company with Axtra
                    </Link>
                  </h5>
                  <Link href="/blog-details" className="blog__btn">
                    Read More{" "}
                    <span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              </article>
            </div>

            <div className="col-xxl-6 col-xl-6 col-lg-6">
              <article className="blog__item-3">
                <div className="blog__img-wrapper-3">
                  <Link href="/blog-details">
                    <div className="img-box">
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog32}
                        alt="Blog Thumbnail"
                      />
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog32}
                        alt="Blog Thumbnail"
                      />
                    </div>
                  </Link>
                </div>
                <div className="blog__info-3">
                  <h4 className="blog__meta">
                    <Link href="/category">UI Design</Link> . 02 May 2019
                  </h4>
                  <h5>
                    <Link href="/blog-details" className="blog__title-3">
                      How to manage a talented and successful design team
                    </Link>
                  </h5>
                  <Link href="/blog-details" className="blog__btn">
                    Read More{" "}
                    <span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DigitalMarketingBlog;
