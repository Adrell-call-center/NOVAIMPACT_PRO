import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link.js";
import Blog41 from "../../../public/assets/imgs/blog/4/1.jpg";
import Blog42 from "../../../public/assets/imgs/blog/4/2.jpg";
import Image from "next/image.js";

gsap.registerPlugin(ScrollTrigger);

const StartupAgencyBlog = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".blog__animation .blog__item-4", { x: 50, opacity: 0 });

        if (device_width < 1023) {
          const blogList = gsap.utils.toArray(".blog__animation .blog__item-4");
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
          gsap.to(".blog__animation .blog__item-4", {
            scrollTrigger: {
              trigger: ".blog__animation .blog__item-4",
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
      <section className="blog__area-4 blog__animation">
        <div className="container g-0 line_4 pt-150 pb-150">
          <div className="line-col-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="row">
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <div className="sec-title-wrapper text-anim">
                <h2 className="sec-subtile-6">Recent Blog</h2>
                <h3 className="sec-title-6 title-anim">
                  Updated <br /> Journal
                </h3>
                <p>
                  We help brands stand out through aweful, elegant visual
                  design. Our design mainly philosophy.
                </p>
                <Link className="btn-started" href="/blog">
                  All Articles{" "}
                  <span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <article className="blog__item-4">
                <div className="blog__img-4">
                  <Link href="/blog-details">
                    <Image
                      priority
                      style={{ width: "100%", height: "auto" }}
                      src={Blog41}
                      alt="Blog Image"
                    />
                  </Link>
                </div>
                <h4 className="blog__meta-4">
                  <Link href="/category">UI Design</Link>{" "}
                  <span>02 May 2019</span>
                </h4>
                <h5>
                  <Link href="/blog-details" className="blog__title-4">
                    Ways of lying to yourself about your new relationship.
                  </Link>
                </h5>
                <Link href="/blog-details" className="blog__btn-4">
                  Read More{" "}
                  <span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </Link>
              </article>
            </div>

            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <article className="blog__item-4">
                <div className="blog__img-4">
                  <Link href="/blog-details">
                    <Image
                      priority
                      style={{ width: "100%", height: "auto" }}
                      src={Blog42}
                      alt="Blog Image"
                    />
                  </Link>
                </div>
                <h4 className="blog__meta-4">
                  <Link href="/category">UX Design</Link>{" "}
                  <span>02 May 2019</span>
                </h4>
                <h5>
                  <Link href="/blog-details" className="blog__title-4">
                    Ways of lying to yourself about your new relationship.
                  </Link>
                </h5>
                <Link href="/blog-details" className="blog__btn-4">
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

export default StartupAgencyBlog;
