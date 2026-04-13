import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const DigitalAgencyBlog = ({ posts = [] }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let device_width = window.innerWidth;
      let tHero = gsap.context(() => {
        gsap.set(".blog__animation .blog__item", { x: 50, opacity: 0 });

        if (device_width < 1023) {
          const blogList = gsap.utils.toArray(".blog__animation .blog__item");
          blogList.forEach((item) => {
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
            stagger: { each: 0.3 },
          });
        }
      });
      ScrollTrigger.refresh();
      return () => tHero.revert();
    }
  }, []);

  if (!posts.length) return null;

  return (
    <section className="blog__area no-pb blog__animation">
      <div className="container g-0 line pt-150 pb-140">
        <span className="line-3"></span>
        <div className="row">
          <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12">
            <div className="sec-title-wrapper">
              <h2 className="sec-sub-title">recent blog</h2>
              <h3 className="sec-title">Latest Insights</h3>
            </div>
          </div>

          {posts.map((post) => (
            <div key={post.id} className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
              <article className="blog__item">
                <div className="blog__img-wrapper">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="img-box">
                      {post.coverImage ? (
                        <>
                          <Image
                            priority
                            width={400}
                            height={300}
                            style={{ width: "100%", height: "auto" }}
                            className="image-box__item"
                            src={post.coverImage}
                            alt={post.titleFr}
                          />
                          <Image
                            priority
                            width={400}
                            height={300}
                            style={{ width: "100%", height: "auto" }}
                            className="image-box__item"
                            src={post.coverImage}
                            alt={post.titleFr}
                          />
                        </>
                      ) : (
                        <>
                          <div className="image-box__item bg-secondary" style={{ height: 220 }} />
                          <div className="image-box__item bg-secondary" style={{ height: 220 }} />
                        </>
                      )}
                    </div>
                  </Link>
                </div>
                <h4 className="blog__meta">
                  <span>{post.category}</span>
                  {post.publishedAt && (
                    <> . {new Date(post.publishedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</>
                  )}
                </h4>
                <h5>
                  <Link href={`/blog/${post.slug}`} className="blog__title">
                    {post.titleFr}
                  </Link>
                </h5>
                <Link href={`/blog/${post.slug}`} className="blog__btn">
                  Lire la suite <span><i className="fa-solid fa-arrow-right"></i></span>
                </Link>
              </article>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-xxl-12 text-center">
            <Link href="/blog" className="wc-btn-primary btn-hover btn-item">
              <span></span>Voir tous les articles <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalAgencyBlog;
