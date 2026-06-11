import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "@/plugins";
import animationCharCome from "@/lib/utils/animationCharCome";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_PROCESS = [
  "Discovery",
  "UX / UI Design",
  "Development",
  "Testing",
  "Launch",
];

function resolveHeroStats(project) {
  if (project.heroStats?.length) return project.heroStats;
  if (!project.quickStats?.length) return [];
  return project.quickStats.slice(0, 3).map((stat) => {
    const match = stat.match(/^([^a-zA-Z]+)\s+(.+)$/);
    if (match) return { value: match[1].trim(), label: match[2].trim() };
    return { value: "—", label: stat };
  });
}

function resolveImpactStats(project) {
  if (project.impactStats?.length) return project.impactStats;
  if (!project.results?.length) return [];
  return project.results.slice(0, 4).map((result) => ({
    value: "✓",
    label: result,
  }));
}

function resolveCaseStudy(project) {
  const challengePoints =
    project.challengePoints ||
    (project.challenge
      ? project.challenge
          .split("\n\n")
          .filter(Boolean)
          .slice(0, 4)
          .map((para) => para.split(".")[0].trim())
      : []);

  const solutionPoints =
    project.solutionPoints ||
    project.approachPoints?.map((point) => point.title) ||
    project.features?.slice(0, 4) ||
    [];

  return {
    heroLabel: project.heroLabel || "FEATURED PROJECT",
    title: project.displayTitle || project.title.replace(/\.(fr|com)$/i, ""),
    subtitle: project.displaySubtitle || project.subtitle,
    description:
      project.heroDescription ||
      project.heroSubheadline ||
      project.description ||
      "",
    overview: project.fullDescription || "",
    heroImage: project.heroImage || project.thumbnail,
    heroStats: resolveHeroStats(project),
    challengeTitle: project.challengeTitle || "The Challenge",
    challengePoints,
    solutionTitle: project.solutionTitle || "Our Solution",
    solutionPoints,
    features: project.features || project.approachPoints?.map((p) => p.title) || [],
    featuresTitle: project.featuresTitle || "Powerful Features",
    screenshots:
      project.screenshots?.length > 0
        ? project.screenshots
        : project.images?.length
          ? project.images
          : [project.thumbnail],
    screenshotsTitle: project.screenshotsTitle || "Platform Screenshots",
    processSteps: project.processSteps || DEFAULT_PROCESS,
    impactTitle: project.resultsTitle || "Business Impact",
    impactDescription:
      project.impactDescription ||
      project.whyItMatters?.content ||
      "",
    impactStats: resolveImpactStats(project),
    techStack: project.techStack || [],
    servicesDelivered: project.servicesDelivered || [],
    ctaTitle: project.ctaTitle || "Have a project in mind?",
    ctaText: project.ctaText || "Let's build something impactful together.",
    ctaButton: project.ctaButton || "Book a Strategy Call",
    primaryCta:
      project.primaryCta ||
      (project.url ? { label: "Visit Live Platform", url: project.url } : null),
  };
}

const PortfolioCaseStudy = ({ project }) => {
  const rootRef = useRef(null);
  const heroTitleRef = useRef(null);

  const p = project || projects[0];
  const cs = resolveCaseStudy(p);
  const imgW = p.thumbnailWidth || 1200;
  const imgH = p.thumbnailHeight || 800;

  const similarProjects = p.similarSlugs?.length
    ? p.similarSlugs
        .map((slug) => projects.find((item) => item.slug === slug))
        .filter(Boolean)
    : projects.filter((item) => item.slug !== p.slug).slice(0, 4);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .from(".case-study__hero-label", { y: 28, opacity: 0, duration: 0.55 })
        .from(
          ".case-study__hero-content h2",
          { y: 28, opacity: 0, duration: 0.55 },
          "-=0.25"
        )
        .from(
          ".case-study__hero-content > p",
          { y: 28, opacity: 0, duration: 0.55 },
          "-=0.35"
        )
        .from(
          ".case-study__stats > div",
          { y: 36, opacity: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        )
        .from(
          ".case-study__buttons > a",
          { y: 20, opacity: 0, duration: 0.45, stagger: 0.08 },
          "-=0.25"
        )
        .from(
          ".case-study__hero-image",
          { x: 60, opacity: 0, duration: 0.9 },
          "-=0.7"
        );

      if (heroTitleRef.current) {
        animationCharCome(heroTitleRef.current, 0.04);
      }

      gsap.utils.toArray(".case-study__title-anim").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray(".case-study__reveal").forEach((el) => {
        gsap.from(el, {
          y: 45,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray(".case-study__stagger").forEach((container) => {
        gsap.from(container.children, {
          y: 40,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray(".case-study__impact-grid > div").forEach((el, i) => {
        gsap.from(el, {
          scale: 0.85,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.08,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".case-study__impact-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.to(".case-study__hero-image", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ".case-study__hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, [p.slug]);

  return (
    <section className="case-study" ref={rootRef}>
      <section className="case-study__hero">
        <div className="case-study__hero-content">
          <span className="case-study__hero-label">{cs.heroLabel}</span>
          <h1 className="animation__char_come" ref={heroTitleRef}>
            {cs.title}
          </h1>
          <h2>{cs.subtitle}</h2>
          <p>{cs.description}</p>

          {cs.heroStats.length > 0 && (
            <div className="case-study__stats">
              {cs.heroStats.map((stat, i) => (
                <div key={i}>
                  <strong>{stat.value}</strong>
                  <small>{stat.label}</small>
                </div>
              ))}
            </div>
          )}

          <div className="case-study__buttons">
            {cs.primaryCta?.url && (
              <a
                href={cs.primaryCta.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cs.primaryCta.label}
              </a>
            )}
            {p.secondaryCta?.url && (
              <a
                href={p.secondaryCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="case-study__outline"
              >
                {p.secondaryCta.label || "Learn More"}
              </a>
            )}
            {!cs.primaryCta?.url && (
              <Link href="/contact">Start a Project</Link>
            )}
          </div>
        </div>

        <div className="case-study__hero-image">
          <Image
            priority
            width={imgW}
            height={imgH}
            style={{ width: "100%", height: "auto" }}
            src={cs.heroImage}
            alt={`${cs.title} platform mockup`}
          />
        </div>
      </section>

      {cs.overview && (
        <section className="case-study__overview case-study__reveal">
          <div className="case-study__overview-inner">
            <h2 className="case-study__title-anim">Project Overview</h2>
            {cs.overview.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {(cs.challengePoints.length > 0 || cs.solutionPoints.length > 0) && (
        <section className="case-study__challenge case-study__reveal">
          <div>
            <h3 className="case-study__title-anim">{cs.challengeTitle}</h3>
            <ul className="case-study__stagger">
              {cs.challengePoints.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="case-study__title-anim">{cs.solutionTitle}</h3>
            <ul className="case-study__stagger">
              {cs.solutionPoints.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {cs.features.length > 0 && (
        <section className="case-study__features">
          <h2 className="case-study__title-anim">{cs.featuresTitle}</h2>
          <div className="case-study__grid case-study__stagger">
            {cs.features.map((feature, i) => (
              <div key={i}>{feature}</div>
            ))}
          </div>
        </section>
      )}

      {cs.screenshots.length > 0 && (
        <section className="case-study__screens">
          <h2 className="case-study__title-anim">{cs.screenshotsTitle}</h2>
          <div
            className="case-study__screen-grid case-study__stagger"
            data-count={cs.screenshots.length}
          >
            {cs.screenshots.map((src, i) => (
              <Image
                key={`${src}-${i}`}
                width={imgW}
                height={imgH}
                style={{ width: "100%", height: "auto" }}
                src={src}
                alt={`${cs.title} screenshot ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {(cs.techStack.length > 0 || cs.processSteps.length > 0) && (
        <section className="case-study__tech-process case-study__reveal">
          {cs.techStack.length > 0 && (
            <div className="case-study__tech">
              <h3 className="case-study__title-anim">Tech Stack</h3>
              <div className="case-study__badges case-study__stagger">
                {cs.techStack.map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
              </div>
            </div>
          )}
          {cs.processSteps.length > 0 && (
            <div className="case-study__process">
              <h3 className="case-study__title-anim">Our Process</h3>
              <div className="case-study__steps case-study__stagger">
                {cs.processSteps.map((step, i) => (
                  <span key={i}>{step}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {cs.servicesDelivered.length > 0 && (
        <section className="case-study__services">
          <h2 className="case-study__title-anim">Services Delivered</h2>
          <div className="case-study__services-grid case-study__stagger">
            {cs.servicesDelivered.map((group, i) => (
              <div key={i} className="case-study__service-card">
                <h3>{group.category}</h3>
                <ul>
                  {group.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {cs.impactStats.length > 0 && (
        <section className="case-study__impact case-study__reveal">
          <div>
            <h2 className="case-study__title-anim">{cs.impactTitle}</h2>
            {cs.impactDescription && <p>{cs.impactDescription}</p>}
          </div>
          <div className="case-study__impact-grid">
            {cs.impactStats.map((stat, i) => (
              <div key={i}>
                <strong>{stat.value}</strong>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      {similarProjects.length > 0 && (
        <section className="case-study__similar">
          <h2 className="case-study__title-anim">Similar Projects</h2>
          <div className="case-study__project-grid case-study__stagger">
            {similarProjects.map((item) => (
              <Link key={item.slug} href={`/portfolio/${item.slug}`}>
                <Image
                  width={item.thumbnailWidth || 800}
                  height={item.thumbnailHeight || 600}
                  style={{ width: "100%", height: "auto" }}
                  src={item.thumbnail}
                  alt={item.title}
                />
                <h3>
                  {item.displayTitle || item.title.replace(/\.(fr|com)$/i, "")}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="case-study__cta case-study__reveal">
        <div>
          <h2 className="case-study__title-anim">{cs.ctaTitle}</h2>
          <p>{cs.ctaText}</p>
        </div>
        <Link href="/contact" className="case-study__cta-btn">
          {cs.ctaButton}
        </Link>
      </section>
    </section>
  );
};

export default PortfolioCaseStudy;
