import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Accordion } from "react-bootstrap";
import animationCharCome from "@/lib/utils/animationCharCome";

const IMG_HERO = "/images/insurance-comparator-hero-portrait.webp";
const IMG_ARCHITECTURE = "/images/insurance-comparator-architecture.webp";
const IMG_SUPPORT = "/images/insurance-comparator-support.webp";

function CtaButton({ href, children, variant = "primary", external = false }) {
  const className =
    variant === "ghost"
      ? "insurance-comparator__btn insurance-comparator__btn--ghost"
      : "insurance-comparator__btn";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function SectionHead({ title, text }) {
  return (
    <div className="insurance-comparator__head">
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function TagList({ items, limit }) {
  if (!items?.length) return null;
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul className="insurance-comparator__tags">
      {shown.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function VisualStat({ value, label }) {
  return (
    <div className="insurance-comparator__visual-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function InsuranceComparatorLanding({ content }) {
  const charAnim = useRef();

  useEffect(() => {
    animationCharCome(charAnim.current);
  }, []);

  const { hero } = content;
  const heroStats = [
    { value: "API", label: content.integrations.title },
    { value: "CRM", label: content.features[4]?.title },
    { value: "SEO", label: content.seo.title },
  ];

  return (
    <div className="insurance-comparator">
      {/* Hero */}
      <section className="insurance-comparator__section insurance-comparator__hero">
        <div className="container">
          <div className="row align-items-center g-5 insurance-comparator__hero-grid">
            <div className="col-lg-7">
              <p className="insurance-comparator__eyebrow">{hero.subtitle}</p>
              <h1 className="animation__char_come" ref={charAnim}>
                {hero.title}
              </h1>
              <p className="insurance-comparator__intro">{hero.description1}</p>
              <p className="insurance-comparator__intro">{hero.description2}</p>
              <TagList items={hero.tags} />
              <div className="insurance-comparator__actions">
                <CtaButton href="/contact">{hero.primaryCta}</CtaButton>
                <CtaButton href="/contact" variant="ghost">
                  {hero.secondaryCta}
                </CtaButton>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="insurance-comparator__media insurance-comparator__media--hero">
                <Image
                  priority
                  width={780}
                  height={975}
                  src={IMG_HERO}
                  alt={hero.title}
                  style={{ width: "100%", height: "auto" }}
                />
                <div className="insurance-comparator__visual-stats" aria-hidden="true">
                  {heroStats.map((stat) => (
                    <VisualStat key={stat.value} value={stat.value} label={stat.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="insurance-comparator__section">
        <div className="container">
          <SectionHead title={content.modelsIntro.title} text={content.modelsIntro.body} />
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-5">
              <article className="insurance-comparator__block insurance-comparator__block--featured">
                <h3>{content.models[0].title}</h3>
                <p>{content.models[0].body}</p>
                <TagList items={content.models[0].items} limit={8} />
              </article>
            </div>
            <div className="col-lg-7">
              <div className="insurance-comparator__stack">
                {content.models.slice(1).map((model) => (
                  <article key={model.title} className="insurance-comparator__block">
                    <h3>{model.title}</h3>
                    <p>{model.body}</p>
                    <TagList items={model.items} limit={6} />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="insurance-comparator__section insurance-comparator__section--soft">
        <div className="container">
          <SectionHead title={content.productsIntro.title} text={content.productsIntro.body} />
          <div className="insurance-comparator__product-grid">
            {content.products.map((product, index) => (
              <article
                key={product.title}
                className={`insurance-comparator__block insurance-comparator__product-card ${
                  index === 0 || index === 7 ? "insurance-comparator__product-card--wide" : ""
                }`}
              >
                  <h3>{product.title}</h3>
                  <p>{product.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="insurance-comparator__section">
        <div className="container">
          <SectionHead title={content.featuresIntro.title} text={content.featuresIntro.body} />
          <div className="row g-4">
            {content.features.map((feature, index) => (
              <div key={feature.title} className={index < 2 ? "col-lg-6" : "col-md-6 col-lg-3"}>
                <article className="insurance-comparator__block insurance-comparator__feature-card">
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="insurance-comparator__section insurance-comparator__section--soft">
        <div className="container">
          <SectionHead
            title={content.architectureIntro.title}
            text={content.architectureIntro.body}
          />
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="insurance-comparator__media insurance-comparator__media--architecture">
                <Image
                  width={900}
                  height={576}
                  src={IMG_ARCHITECTURE}
                  alt={content.architectureIntro.title}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="insurance-comparator__stack">
                {content.architecture.map((block) => (
                  <article key={block.title} className="insurance-comparator__block">
                    <h3>{block.title}</h3>
                    <TagList items={block.items} />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations + Conversion */}
      <section className="insurance-comparator__section">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <article className="insurance-comparator__panel">
                <SectionHead title={content.integrations.title} text={content.integrations.body} />
                <TagList items={content.integrations.items} />
                <p className="insurance-comparator__note">{content.integrations.note}</p>
              </article>
            </div>
            <div className="col-lg-6">
              <article className="insurance-comparator__panel">
                <SectionHead title={content.conversion.title} text={content.conversion.body} />
                <TagList items={content.conversion.items} />
                <p className="insurance-comparator__note">{content.conversion.note}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* SEO + Multilingual */}
      <section className="insurance-comparator__section insurance-comparator__section--soft">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <article className="insurance-comparator__panel insurance-comparator__panel--light">
                <SectionHead title={content.seo.title} text={content.seo.body} />
                <TagList items={content.seo.items} />
                <p className="insurance-comparator__note">{content.seo.note}</p>
              </article>
            </div>
            <div className="col-lg-6">
              <article className="insurance-comparator__panel insurance-comparator__panel--light">
                <SectionHead title={content.multilingual.title} text={content.multilingual.body} />
                <TagList items={content.multilingual.items} />
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Projects with images */}
      <section className="insurance-comparator__section">
        <div className="container">
          <SectionHead title={content.projectsIntro.title} />
          <div className="row g-5">
            {content.projects.map((project) => (
              <div key={project.title} className="col-lg-6">
                <article className="insurance-comparator__project">
                  <div className="insurance-comparator__project-image">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={900}
                      height={520}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                  <div className="insurance-comparator__project-body">
                    <h3>{project.title}</h3>
                    <p>{project.body}</p>
                    <TagList items={project.items} limit={5} />
                    <div className="insurance-comparator__actions">
                      <CtaButton href={project.href} external>
                        {project.cta}
                      </CtaButton>
                      <CtaButton href={project.portfolio} variant="ghost">
                        {project.portfolioCta}
                      </CtaButton>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
          <p className="insurance-comparator__note">{content.projectsIntro.note}</p>
        </div>
      </section>

      {/* Process */}
      <section className="insurance-comparator__section insurance-comparator__section--soft">
        <div className="container">
          <SectionHead title={content.processTitle} />
          <div className="insurance-comparator__process-grid">
            {content.process.map((step, index) => (
              <article key={step.title} className="insurance-comparator__step">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why + Audience / Pricing */}
      <section className="insurance-comparator__section">
        <div className="container">
          <SectionHead title={content.whyIntro.title} />
          <div className="row g-4 mb-5">
            {content.why.map((item) => (
              <div key={item.title} className="col-md-6 col-lg-4">
                <article className="insurance-comparator__block insurance-comparator__block--flat">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              </div>
            ))}
          </div>
          <div className="row g-5">
            <div className="col-lg-6">
              <SectionHead title={content.audience.title} text={content.audience.body} />
              <TagList items={content.audience.items} />
            </div>
            <div className="col-lg-6">
              <SectionHead title={content.pricing.title} text={content.pricing.body} />
              <TagList items={content.pricing.items} />
              <p className="insurance-comparator__note">{content.pricing.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="insurance-comparator__section insurance-comparator__section--soft">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-5">
              <div className="insurance-comparator__media insurance-comparator__media--support">
                <Image
                  width={600}
                  height={750}
                  src={IMG_SUPPORT}
                  alt={content.faqTitle}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
            <div className="col-lg-7">
              <SectionHead title={content.faqTitle} />
              <Accordion defaultActiveKey="0" className="insurance-comparator__faq">
                {content.faqs.map((faq, i) => (
                  <Accordion.Item key={faq.question} eventKey={String(i)}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>
                      <p>{faq.answer}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="insurance-comparator__section insurance-comparator__cta">
        <div className="container">
          <div className="insurance-comparator__cta-inner">
            <h2>{content.closing.title}</h2>
            <p>{content.closing.body}</p>
            <div className="insurance-comparator__actions">
              <CtaButton href="/contact">{content.closing.primaryCta}</CtaButton>
              <CtaButton href="/contact" variant="ghost">
                {content.closing.secondaryCta}
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
