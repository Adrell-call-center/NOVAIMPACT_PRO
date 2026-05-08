import Head from "next/head";

const sample = {
  name: "adrif mohamed",
  email: "adrif@example.com",
  phone: "+44 7000 000000",
  subject: "HELLO",
  message:
    "Let's Get in Touch — We're excited to hear from you. Let's build something great together. Say hello and tell us about your project.",
  submittedDate: "May 8, 2026",
};

const gold = "#FFC81A";
const dark = "#0f1115";
const font = "Inter, 'Segoe UI', Arial, sans-serif";

// ─── shared sub-components ───────────────────────────────────────

function EmailShell({ children }) {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
        fontFamily: font,
      }}
    >
      {children}
    </div>
  );
}

function LogoBar({ children }) {
  return (
    <div style={{ background: dark, padding: "22px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {children}
      </div>
    </div>
  );
}

function SocialIcons() {
  const socials = ["YT", "IN", "IG", "X"];
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {socials.map((s) => (
        <span
          key={s}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#2a2a2a",
            color: "#fff",
            fontSize: 11,
            fontWeight: 800,
            fontFamily: font,
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function EmailFooter({ note }) {
  return (
    <div
      style={{
        background: dark,
        borderTop: `3px solid ${gold}`,
        padding: "28px 32px",
        textAlign: "center",
      }}
    >
      <p style={{ margin: "0 0 4px", color: gold, fontSize: 18, fontWeight: 800, fontFamily: font }}>
        Nova Impact
      </p>
      <p style={{ margin: "0 0 16px", color: "#9ca3af", fontSize: 12, fontFamily: font }}>
        Transforming businesses through digital excellence
      </p>
      <SocialIcons />
      <p style={{ margin: "14px 0 0", color: "#9ca3af", fontSize: 11, fontFamily: font }}>
        {note && (
          <span style={{ display: "block", marginBottom: 4 }}>{note}</span>
        )}
        <span style={{ color: gold }}>https://novaimpactltd.com</span>
      </p>
    </div>
  );
}

function InfoRow({ label, value, shade }) {
  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid #e5e7eb",
        background: shade ? "#f8f9fa" : "#fff",
      }}
    >
      <div
        style={{
          width: 110,
          minWidth: 110,
          padding: "14px 20px",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.7px",
          color: "#9ca3af",
          fontFamily: font,
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          padding: "14px 20px",
          fontSize: 14,
          fontWeight: label === "Subject" || label === "Name" ? 700 : 400,
          color: dark,
          fontFamily: font,
          lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── CLIENT CONFIRMATION EMAIL ────────────────────────────────────

function ClientEmail() {
  return (
    <EmailShell>
      {/* Logo Bar */}
      <LogoBar>
        <img
          src="/assets/imgs/logo/footer-logo-white.png"
          alt="Nova Impact"
          style={{ height: 40, display: "block" }}
        />
      </LogoBar>

      {/* Light Purple Hero */}
      <div style={{ background: "#ede9fe", padding: "40px 32px 0", textAlign: "center" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: gold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 28,
            color: dark,
          }}
        >
          ✓
        </div>
        <h1
          style={{
            margin: "0 0 10px",
            color: dark,
            fontSize: 32,
            fontWeight: 800,
            fontFamily: font,
            lineHeight: 1.2,
          }}
        >
          Thank You, {sample.name}!
        </h1>
        <p
          style={{
            margin: "0 auto 28px",
            maxWidth: 400,
            color: "#4c3f72",
            fontSize: 15,
            fontFamily: font,
            lineHeight: 1.65,
          }}
        >
          We have received your message. Our team is on it and will get back to you very soon.
        </p>
        <img
          src="/images/ulistration/novaimpact-submit.png"
          alt=""
          style={{ display: "block", margin: "0 auto", maxWidth: 280, height: "auto" }}
        />
      </div>

      {/* What Happens Next */}
      <div style={{ background: "#fff", padding: "36px 32px 28px" }}>
        <h2
          style={{
            margin: "0 0 26px",
            color: dark,
            fontSize: 19,
            fontWeight: 800,
            fontFamily: font,
            textAlign: "center",
            letterSpacing: -0.3,
          }}
        >
          What happens next?
        </h2>
        {[
          {
            n: 1,
            title: "We review your inquiry",
            desc: "Our team carefully reads every submission and routes it to the right expert.",
            alt: false,
          },
          {
            n: 2,
            title: "We reply within 24–48 hours",
            desc: `Expect a personalised reply at ${sample.email} from our team.`,
            alt: true,
          },
          {
            n: 3,
            title: "Let's build something great together",
            desc: "We'll align on your goals and show you exactly how Nova Impact can drive results.",
            alt: false,
          },
        ].map((step, i) => (
          <div
            key={step.n}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              marginBottom: i < 2 ? 22 : 0,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                minWidth: 40,
                borderRadius: "50%",
                background: step.alt ? dark : gold,
                color: step.alt ? gold : dark,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                fontWeight: 800,
                fontFamily: font,
              }}
            >
              {step.n}
            </div>
            <div>
              <p
                style={{ margin: "0 0 3px", fontSize: 14, fontWeight: 700, color: dark, fontFamily: font }}
              >
                {step.title}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280", fontFamily: font, lineHeight: 1.55 }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ background: "#fff", padding: "0 32px" }}>
        <div style={{ height: 1, background: "#e5e7eb" }} />
      </div>

      {/* Your Submission */}
      <div style={{ background: "#fff", padding: "28px 32px" }}>
        <h2
          style={{
            margin: "0 0 18px",
            color: dark,
            fontSize: 17,
            fontWeight: 800,
            fontFamily: font,
            letterSpacing: -0.2,
          }}
        >
          Your Submission
        </h2>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <InfoRow label="Subject" value={sample.subject} shade />
          <InfoRow
            label="Message"
            value={sample.message.substring(0, 140) + (sample.message.length > 140 ? "…" : "")}
          />
          <div
            style={{
              display: "flex",
              background: "#f8f9fa",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: 110,
                minWidth: 110,
                padding: "14px 20px",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                color: "#9ca3af",
                fontFamily: font,
              }}
            >
              Submitted
            </div>
            <div style={{ flex: 1, padding: "14px 20px", fontSize: 13, color: "#374151", fontFamily: font }}>
              {sample.submittedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ background: "#fff", padding: "0 32px" }}>
        <div style={{ height: 1, background: "#e5e7eb" }} />
      </div>

      {/* While You Wait */}
      <div style={{ background: "#fff", padding: "28px 32px" }}>
        <h2
          style={{
            margin: "0 0 8px",
            color: dark,
            fontSize: 17,
            fontWeight: 800,
            fontFamily: font,
            letterSpacing: -0.2,
          }}
        >
          While You Wait
        </h2>
        <p style={{ margin: "0 0 20px", color: "#6b7280", fontSize: 14, fontFamily: font, lineHeight: 1.6 }}>
          Explore our work and see how we&apos;ve helped other businesses grow:
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href="#"
            style={{
              flex: 1,
              display: "block",
              background: dark,
              color: gold,
              padding: "14px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              textAlign: "center",
              fontFamily: font,
            }}
          >
            View Our Portfolio
          </a>
          <a
            href="#"
            style={{
              flex: 1,
              display: "block",
              background: "#f8f9fa",
              color: dark,
              padding: "14px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              textAlign: "center",
              fontFamily: font,
              border: "2px solid #e5e7eb",
            }}
          >
            Read Our Blog
          </a>
        </div>
      </div>

      {/* Urgent Help */}
      <div style={{ background: "#fff", padding: "0 32px 32px" }}>
        <div
          style={{
            background: "#FFF9E6",
            border: `1.5px solid ${gold}`,
            borderRadius: 10,
            padding: "22px 24px",
            textAlign: "center",
          }}
        >
          <p style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 800, color: dark, fontFamily: font }}>
            Need Immediate Assistance?
          </p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280", fontFamily: font }}>
            For urgent inquiries, reach us directly:
          </p>
          <span style={{ color: dark, fontSize: 15, fontWeight: 700, fontFamily: font }}>
            contact@novaimpactltd.com
          </span>
        </div>
      </div>

      <EmailFooter />
    </EmailShell>
  );
}

// ─── ADMIN NOTIFICATION EMAIL ─────────────────────────────────────

function AdminEmail() {
  return (
    <EmailShell>
      {/* Logo Bar with badge */}
      <div style={{ background: dark, padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img
            src="/assets/imgs/logo/site-logo-white-2.png"
            alt="Nova Impact"
            style={{ height: 32, display: "block" }}
          />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: gold,
              color: dark,
              fontSize: 11,
              fontWeight: 800,
              padding: "5px 14px",
              borderRadius: 999,
              fontFamily: font,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
            }}
          >
            <span style={{ fontSize: 8 }}>●</span> New Lead
          </span>
        </div>
      </div>

      {/* Alert Banner */}
      <div style={{ background: gold, padding: "22px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              minWidth: 44,
              background: dark,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            🔔
          </div>
          <div>
            <p
              style={{
                margin: "0 0 3px",
                fontSize: 19,
                fontWeight: 800,
                color: dark,
                fontFamily: font,
                lineHeight: 1.2,
              }}
            >
              New Contact Form Submission
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "#2a1f00", fontFamily: font }}>
              Received on <strong>Thursday, May 8, 2026 at 10:24 AM</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div style={{ background: "#fff", padding: "30px 28px 20px" }}>
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 12,
            fontWeight: 700,
            color: "#9ca3af",
            fontFamily: font,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Contact Details
        </p>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <InfoRow label="Name" value={sample.name} shade />
          <InfoRow label="Email" value={sample.email} />
          <InfoRow label="Phone" value={sample.phone} shade />
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: 110,
                minWidth: 110,
                padding: "14px 20px",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.7px",
                color: "#9ca3af",
                fontFamily: font,
              }}
            >
              Subject
            </div>
            <div
              style={{
                flex: 1,
                padding: "14px 20px",
                fontSize: 14,
                fontWeight: 700,
                color: dark,
                fontFamily: font,
              }}
            >
              {sample.subject}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div style={{ background: "#fff", padding: "0 28px 28px" }}>
        <p
          style={{
            margin: "0 0 14px",
            fontSize: 12,
            fontWeight: 700,
            color: "#9ca3af",
            fontFamily: font,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Message
        </p>
        <div
          style={{
            background: "#f8f9fa",
            borderLeft: `4px solid ${gold}`,
            borderRadius: "0 8px 8px 0",
            padding: "20px 22px",
            fontSize: 15,
            lineHeight: 1.7,
            color: "#374151",
            fontFamily: font,
            fontStyle: "italic",
          }}
        >
          {sample.message}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ background: "#fff", padding: "0 28px 32px" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href="#"
            style={{
              flex: 1,
              display: "block",
              background: gold,
              color: dark,
              padding: "14px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 14,
              textAlign: "center",
              fontFamily: font,
            }}
          >
            Reply to {sample.name}
          </a>
          <a
            href="#"
            style={{
              flex: 1,
              display: "block",
              background: dark,
              color: gold,
              padding: "14px 16px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 14,
              textAlign: "center",
              fontFamily: font,
            }}
          >
            View in Admin →
          </a>
        </div>
      </div>

      <EmailFooter note="This notification was generated by the Nova Impact contact form." />
    </EmailShell>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────

export default function EmailPreviewPage() {
  return (
    <>
      <Head>
        <title>Email Template Preview — Nova Impact</title>
      </Head>
      <main style={{ background: "#e8e8e8", minHeight: "100vh", padding: "32px 16px", fontFamily: font }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ margin: "0 0 4px", color: "#111827", fontSize: 22, fontWeight: 800 }}>
              Email Template Preview
            </h1>
            <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
              Preview only — no email is sent from this page.
            </p>
          </div>

          {/* Client email */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "6px 14px",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                Email 1 — Client Confirmation
              </span>
            </div>
            <ClientEmail />
          </div>

          {/* Spacer */}
          <div style={{ height: 48 }} />

          {/* Admin email */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: "6px 14px",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                Email 2 — Admin Notification (sent to both addresses)
              </span>
            </div>
            <AdminEmail />
          </div>

        </div>
      </main>
    </>
  );
}

export function getServerSideProps() {
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }
  return { props: {} };
}
