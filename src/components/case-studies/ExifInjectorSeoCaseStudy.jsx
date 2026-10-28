import Link from "next/link";
import Image from "next/image";
import {
  liveUrl,
  searchTotals,
  latest28Days,
  kpis,
  monthly,
  timeline,
  strategy,
  topQueries,
  topPages,
  topCountries,
  faqs,
} from "@/data/exif-injector-seo-case-study";

const HERO_IMAGE = "/images/projects/exifinjector/hero.png";

/* ---------- Cumulative-users line / area chart ---------- */
function CumulativeChart() {
  const W = 760;
  const H = 300;
  const padL = 56;
  const padR = 20;
  const padT = 24;
  const padB = 44;
  const values = monthly.map((m) => m.cumulative);
  const max = Math.max(...values);
  const n = values.length;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = (i) => padL + (innerW * i) / (n - 1);
  const y = (v) => padT + innerH - (innerH * v) / max;

  const linePath = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  const areaPath =
    `M${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} ` +
    values.map((v, i) => `L${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    ` L${x(n - 1).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  return (
    <svg
      className="exif-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Cumulative registered users grew from 2 in March 2026 to 3,095 in October 2026, entirely from organic search."
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="exifArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC81A" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#FFC81A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((t) => (
        <g key={t}>
          <line
            className="exif-chart__grid"
            x1={padL}
            x2={W - padR}
            y1={y(t)}
            y2={y(t)}
          />
          <text className="exif-chart__ytick" x={padL - 10} y={y(t) + 4}>
            {t.toLocaleString()}
          </text>
        </g>
      ))}
      <path d={areaPath} fill="url(#exifArea)" />
      <path
        d={linePath}
        fill="none"
        stroke="#FFC81A"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {values.map((v, i) => (
        <g key={i}>
          <circle className="exif-chart__dot" cx={x(i)} cy={y(v)} r="4.5" />
          <text className="exif-chart__xtick" x={x(i)} y={H - 22}>
            {monthly[i].month.split(" ")[0]}
          </text>
        </g>
      ))}
      <text
        className="exif-chart__peak"
        x={x(n - 1)}
        y={y(values[n - 1]) - 14}
        textAnchor="end"
      >
        3,095
      </text>
    </svg>
  );
}

/* ---------- New-signups bar chart ---------- */
function SignupsChart() {
  const W = 760;
  const H = 300;
  const padL = 56;
  const padR = 20;
  const padT = 30;
  const padB = 44;
  const values = monthly.map((m) => m.newUsers);
  const max = Math.max(...values);
  const n = values.length;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const slot = innerW / n;
  const bw = slot * 0.56;
  const y0 = padT + innerH;
  const barH = (v) => (innerH * v) / max;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  return (
    <svg
      className="exif-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="New monthly signups from organic search, rising from 2 in March to 1,212 in October 2026, with a peak of 931 in September."
      preserveAspectRatio="xMidYMid meet"
    >
      {yTicks.map((t) => (
        <g key={t}>
          <line
            className="exif-chart__grid"
            x1={padL}
            x2={W - padR}
            y1={y0 - barH(t)}
            y2={y0 - barH(t)}
          />
          <text className="exif-chart__ytick" x={padL - 10} y={y0 - barH(t) + 4}>
            {t.toLocaleString()}
          </text>
        </g>
      ))}
      {values.map((v, i) => {
        const cx = padL + slot * i + slot / 2;
        const h = barH(v);
        return (
          <g key={i}>
            <rect
              className="exif-chart__bar"
              x={cx - bw / 2}
              y={y0 - h}
              width={bw}
              height={h}
              rx="4"
            />
            <text className="exif-chart__barval" x={cx} y={y0 - h - 8}>
              {v.toLocaleString()}
            </text>
            <text className="exif-chart__xtick" x={cx} y={H - 22}>
              {monthly[i].month.split(" ")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const ExifInjectorSeoCaseStudy = () => {
  return (
    <article className="exif-seo-cs">
      {/* HERO */}
      <header className="exif-seo-cs__hero">
        <div className="exif-seo-cs__hero-text">
          <span className="exif-seo-cs__eyebrow">
            Case Study · SaaS SEO &amp; Organic Growth
          </span>
          <h1>
            How We Grew EXIF Injector from 0 to 12,000+ Organic Clicks — With
            Zero Paid Ads
          </h1>
          <p className="exif-seo-cs__lead">
            A month-by-month SaaS SEO case study. Nova Impact took{" "}
            <strong>EXIF Injector</strong>, an AI metadata platform, from launch
            to <strong>3,095 users</strong> and <strong>415K organic
            impressions</strong> in about seven months — every single visitor
            earned through search, not advertising.
          </p>
          <div className="exif-seo-cs__hero-stats">
            <div>
              <strong>12K+</strong>
              <small>Organic clicks</small>
            </div>
            <div>
              <strong>415K</strong>
              <small>Impressions</small>
            </div>
            <div>
              <strong>3,095</strong>
              <small>Users</small>
            </div>
            <div>
              <strong>$0</strong>
              <small>Ad spend</small>
            </div>
          </div>
          <div className="exif-seo-cs__hero-cta">
            <Link href="/contact" className="exif-seo-cs__btn">
              Get these results for your product
            </Link>
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="exif-seo-cs__btn exif-seo-cs__btn--ghost"
            >
              Visit EXIF Injector
            </a>
          </div>
        </div>
        <div className="exif-seo-cs__hero-media">
          <Image
            priority
            src={HERO_IMAGE}
            width={1672}
            height={941}
            style={{ width: "100%", height: "auto" }}
            alt="EXIF Injector — AI metadata SaaS platform built and grown by Nova Impact"
          />
        </div>
      </header>

      {/* KPI STRIP */}
      <section className="exif-seo-cs__kpis" aria-label="Results at a glance">
        {kpis.map((k, i) => (
          <div key={i} className="exif-seo-cs__kpi">
            <strong>{k.value}</strong>
            <span>{k.label}</span>
            <small>{k.sub}</small>
          </div>
        ))}
      </section>

      {/* OVERVIEW */}
      <section className="exif-seo-cs__block">
        <div className="exif-seo-cs__narrow">
          <h2>The challenge: ranking a brand-new SaaS in a crowded niche</h2>
          <p>
            EXIF Injector launched into a competitive space full of established
            metadata tools. There was no domain authority, no backlink profile
            and no brand recognition — and the mandate was explicit:{" "}
            <strong>grow with organic search, not paid ads</strong>.
          </p>
          <p>
            The opportunity was clear. Thousands of creators, photographers and
            marketers search every month for ways to view, edit, inject and
            remove image metadata (EXIF, IPTC, XMP) — but most land on clunky,
            slow or paywalled tools. If EXIF Injector could rank for that intent
            with a faster, cleaner experience, it could win users on merit.
            Our job was to make Google surface it.
          </p>
        </div>
      </section>

      {/* STRATEGY */}
      <section className="exif-seo-cs__block exif-seo-cs__block--alt">
        <div className="exif-seo-cs__wide">
          <div className="exif-seo-cs__block-head">
            <h2>The organic growth playbook</h2>
            <p>
              Six levers, compounding together — no advertising budget required.
            </p>
          </div>
          <div className="exif-seo-cs__cards">
            {strategy.map((s, i) => (
              <div key={i} className="exif-seo-cs__card">
                <span className="exif-seo-cs__card-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARTS */}
      <section className="exif-seo-cs__block">
        <div className="exif-seo-cs__wide">
          <div className="exif-seo-cs__block-head">
            <h2>Month-by-month organic growth</h2>
            <p>
              Real product analytics from launch (March 2026) through October
              2026. The curve is textbook SEO compounding — slow to start, then
              accelerating as earlier pages keep earning rankings.
            </p>
          </div>
          <div className="exif-seo-cs__charts">
            <figure className="exif-seo-cs__chart-card">
              <figcaption>
                <strong>Cumulative registered users</strong>
                <span>2 → 3,095 · all organic</span>
              </figcaption>
              <CumulativeChart />
            </figure>
            <figure className="exif-seo-cs__chart-card">
              <figcaption>
                <strong>New signups per month</strong>
                <span>Peak month: 931 in September</span>
              </figcaption>
              <SignupsChart />
            </figure>
          </div>

          {/* DATA TABLE */}
          <div className="exif-seo-cs__table-wrap">
            <table className="exif-seo-cs__table">
              <caption className="sr-only">
                EXIF Injector monthly user growth, March to October 2026
              </caption>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">New signups</th>
                  <th scope="col">Total users</th>
                  <th scope="col">MoM growth</th>
                  <th scope="col">Active users</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.month}>
                    <th scope="row">{m.month}</th>
                    <td>{m.newUsers.toLocaleString()}</td>
                    <td>{m.cumulative.toLocaleString()}</td>
                    <td>
                      {m.growth ? (
                        <span className="exif-seo-cs__pos">{m.growth}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{m.active.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="exif-seo-cs__block exif-seo-cs__block--alt">
        <div className="exif-seo-cs__wide">
          <div className="exif-seo-cs__block-head">
            <h2>The growth story, month by month</h2>
            <p>What happened at each stage — and why the momentum kept building.</p>
          </div>
          <ol className="exif-seo-cs__timeline">
            {timeline.map((t, i) => (
              <li key={i}>
                <div className="exif-seo-cs__tl-marker" aria-hidden="true" />
                <div className="exif-seo-cs__tl-body">
                  <div className="exif-seo-cs__tl-head">
                    <span className="exif-seo-cs__tl-month">{t.month}</span>
                    <span className="exif-seo-cs__tl-tag">{t.tag}</span>
                  </div>
                  <p>{t.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SEARCH PERFORMANCE */}
      <section className="exif-seo-cs__block">
        <div className="exif-seo-cs__wide">
          <div className="exif-seo-cs__block-head">
            <h2>Search performance (the proof)</h2>
            <p>
              Verified Google Search Console data for exifinjector.com. 90% of
              clicks are non-branded — people finding the product by searching
              their problem, not the brand.
            </p>
          </div>

          <div className="exif-seo-cs__gsc">
            <div className="exif-seo-cs__gsc-row">
              <div>
                <strong>{searchTotals.clicks}</strong>
                <small>Total clicks · 12 mo</small>
              </div>
              <div>
                <strong>{searchTotals.impressions}</strong>
                <small>Total impressions · 12 mo</small>
              </div>
              <div>
                <strong>{searchTotals.ctr}</strong>
                <small>Average CTR</small>
              </div>
              <div>
                <strong>{searchTotals.avgPosition}</strong>
                <small>Average position</small>
              </div>
              <div>
                <strong>{searchTotals.nonBranded}</strong>
                <small>Non-branded traffic</small>
              </div>
            </div>
            <p className="exif-seo-cs__gsc-note">
              Latest 28 days: <strong>{latest28Days.clicks}</strong> clicks (
              {latest28Days.clicksChange}) and{" "}
              <strong>{latest28Days.impressions}</strong> impressions (
              {latest28Days.impressionsChange}) — still accelerating.
            </p>
          </div>

          <div className="exif-seo-cs__two-col">
            <div className="exif-seo-cs__panel">
              <h3>Top organic queries</h3>
              <table className="exif-seo-cs__table exif-seo-cs__table--compact">
                <thead>
                  <tr>
                    <th scope="col">Query</th>
                    <th scope="col">Clicks</th>
                    <th scope="col">Impr.</th>
                  </tr>
                </thead>
                <tbody>
                  {topQueries.map((q) => (
                    <tr key={q.query}>
                      <th scope="row">
                        {q.query}
                        {q.branded && (
                          <span className="exif-seo-cs__brandtag">brand</span>
                        )}
                      </th>
                      <td>{q.clicks}</td>
                      <td>{q.impressions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="exif-seo-cs__panel">
              <h3>Top organic pages</h3>
              <ul className="exif-seo-cs__pagelist">
                {topPages.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <h3 className="exif-seo-cs__panel-sub">Top countries</h3>
              <ul className="exif-seo-cs__bars">
                {topCountries.map((c) => (
                  <li key={c.country}>
                    <span className="exif-seo-cs__bar-label">{c.country}</span>
                    <span className="exif-seo-cs__bar-track">
                      <span
                        className="exif-seo-cs__bar-fill"
                        style={{ width: `${(c.share / 15) * 100}%` }}
                      />
                    </span>
                    <span className="exif-seo-cs__bar-val">{c.share}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY IT WORKED */}
      <section className="exif-seo-cs__block exif-seo-cs__block--alt">
        <div className="exif-seo-cs__narrow">
          <h2>Why organic beat paid here</h2>
          <p>
            Paid ads stop the moment the budget does. Organic search keeps
            compounding: every guide and tool page EXIF Injector published in the
            spring was still earning clicks — and users — in the autumn, at no
            additional cost. That&apos;s how a brand-new domain reached{" "}
            <strong>3,530 clicks in a single 28-day window</strong> without ever
            running an ad.
          </p>
          <p>
            The result is a durable acquisition asset. Instead of renting traffic,
            EXIF Injector owns rankings for the exact searches its customers make
            — a moat that gets stronger, not more expensive, over time.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="exif-seo-cs__block">
        <div className="exif-seo-cs__narrow">
          <h2>Frequently asked questions</h2>
          <div className="exif-seo-cs__faq">
            {faqs.map((f, i) => (
              <details key={i}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="exif-seo-cs__cta">
        <div>
          <h2>Want this kind of organic growth for your SaaS?</h2>
          <p>
            Nova Impact builds organic acquisition systems — technical SEO,
            content and programmatic pages — that grow users without paid ads.
            Let&apos;s map the same playbook to your product.
          </p>
        </div>
        <Link href="/contact" className="exif-seo-cs__btn exif-seo-cs__btn--lg">
          Book a Strategy Call
        </Link>
      </section>
    </article>
  );
};

export default ExifInjectorSeoCaseStudy;
