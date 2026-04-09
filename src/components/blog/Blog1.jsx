import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import Link from "next/link";
import Image from "next/image";
import animationCharCome from "@/lib/utils/animationCharCome";

gsap.registerPlugin(ScrollTrigger);

const Blog1 = ({ posts = [], lang = "fr" }) => {
  const charAnim = useRef();

  useEffect(() => {
    animationCharCome(charAnim.current);
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
      <section className="blog__area-6 blog__animation">
        <div className="container g-0 line pt-110 pb-110">
          <span className="line-3"></span>
          <div className="row pb-130">
            <div className="col-xxl-8 col-xl-7 col-lg-6 col-md-6">
              <div className="sec-title-wrapper">
                <h2 className="sec-title-2 animation__char_come" ref={charAnim}>
                  {lang === "fr" ? "Nous pensons toujours" : "We always think"}
                </h2>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-6 col-md-6">
              <div className="blog__text">
                <p>
                  {lang === "fr"
                    ? "Créer de nouvelles marques, des systèmes visuels uniques et des expériences digitales innovantes."
                    : "Crafting new bright brands, unique visual systems and digital experiences."}
                </p>
              </div>
            </div>
          </div>

          <div className="row reset-grid">
            {posts.map((post) => {
              const title = lang === "fr" ? post.titleFr : post.titleEn;
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(
                    lang === "fr" ? "fr-FR" : "en-US",
                    { day: "2-digit", month: "long", year: "numeric" }
                  )
                : "";
              const href = `/blog/${post.slug}`;
              const imgSrc = post.coverImage || "/assets/imgs/blog/1.jpg";

              return (
                <div key={post.id} className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                  <article className="blog__item">
                    <div className="blog__img-wrapper">
                      <Link href={href}>
                        <div className="img-box">
                          <Image
                            priority
                            style={{ width: "auto", height: "auto" }}
                            className="image-box__item"
                            src={imgSrc}
                            alt={title}
                            width={400}
                            height={300}
                          />
                          <Image
                            priority
                            style={{ width: "auto", height: "auto" }}
                            className="image-box__item"
                            src={imgSrc}
                            alt={title}
                            width={400}
                            height={300}
                          />
                        </div>
                      </Link>
                    </div>
                    <h4 className="blog__meta">
                      <Link href={`/blog?category=${post.category}&lang=${lang}`}>
                        {post.category}
                      </Link>
                      {date && ` . ${date}`}
                    </h4>
                    <h5>
                      <Link href={href} className="blog__title">
                        {title}
                      </Link>
                    </h5>
                    <Link href={href} className="blog__btn">
                      {lang === "fr" ? "Lire la suite" : "Read More"}{" "}
                      <span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </span>
                    </Link>
                  </article>
                </div>
              );
            })}

            {posts.length === 0 && (
              <div className="col-12 text-center py-5">
                <p>{lang === "fr" ? "Aucun article publié." : "No articles published yet."}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog1;
