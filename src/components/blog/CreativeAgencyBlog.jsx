import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
import Blog11 from "../../../public/assets/imgs/blog/1/1.jpg";
import Blog12 from "../../../public/assets/imgs/blog/1/2.jpg";
import Blog13 from "../../../public/assets/imgs/blog/1/3.jpg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const CreativeAgencyBlog = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".blog__animation .blog__item", { x: 50, opacity: 0 });

        if (device_width < 1023) {
          const blogList = gsap.utils.toArray(".blog__animation .blog__item");
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
          gsap.to(".blog__animation .blog__item", {
            scrollTrigger: {
              trigger: ".blog__animation .blog__item",
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
      <section className="blog__area-7 blog__animation">
        <div className="container g-0 pb-140">
          <div className="row">
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12">
              <div className="sec-title-wrapper">
                <h3 className="sec-title title-anim">News insignt</h3>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <article className="blog__item">
                <div className="blog__img-wrapper">
                  <Link href="/blog-details">
                    <div className="img-box">
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog11}
                        alt=""
                      />
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog11}
                        alt=""
                      />
                    </div>
                  </Link>
                </div>
                <h4 className="blog__meta">
                  <Link href="/category">UI Design</Link> . 02 May 2019
                </h4>
                <h5>
                  <Link href="/blog-details" className="blog__title">
                    Ways of lying to yourself about your new relationship.
                  </Link>
                </h5>
                <Link href="/blog-details" className="blog__btn">
                  Read More{" "}
                  <span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Link>
              </article>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <article className="blog__item">
                <div className="blog__img-wrapper">
                  <Link href="/blog-details">
                    <div className="img-box">
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog12}
                        alt=""
                      />
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog12}
                        alt=""
                      />
                    </div>
                  </Link>
                </div>
                <h4 className="blog__meta">
                  <Link href="/category">UI Design</Link> . 02 May 2019
                </h4>
                <h5>
                  <Link href="/blog-details" className="blog__title">
                    How to manage a talented and successful de sign team
                  </Link>
                </h5>
                <Link href="/blog-details" className="blog__btn">
                  Read More{" "}
                  <span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Link>
              </article>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <article className="blog__item">
                <div className="blog__img-wrapper">
                  <Link href="/blog-details">
                    <div className="img-box">
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog13}
                        alt="Blog Thumbnail"
                      />
                      <Image
                        priority
                        style={{ width: "auto", height: "auto" }}
                        className="image-box__item"
                        src={Blog13}
                        alt="BLog Thumbnail"
                      />
                    </div>
                  </Link>
                </div>
                <h4 className="blog__meta">
                  <Link href="/category">UI Design</Link> . 02 May 2019
                </h4>
                <h5>
                  <Link href="/blog-details" className="blog__title">
                    How to bring fold to your startup company with Axtra
                  </Link>
                </h5>
                <Link href="/blog-details" className="blog__btn">
                  Read More{" "}
                  <span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreativeAgencyBlog;
