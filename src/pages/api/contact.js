import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

const notificationEmail1 =
  process.env.CONTACT_NOTIFICATION_EMAIL1 || process.env.CONTACT_NOTIFICATION_EMAIL;
const notificationEmail2 = process.env.CONTACT_NOTIFICATION_EMAIL2;
const notificationRecipients = [notificationEmail1, notificationEmail2].filter(Boolean);
const fromEmail = process.env.SMTP_FROM_EMAIL;
const companyName = process.env.SMTP_FROM_NAME;
const siteUrl = "https://novaimpactltd.com";

const toAbsolute = (url) => (url && url.startsWith("http") ? url : `${siteUrl}${url}`);

const emailLogoUrl = toAbsolute(
  process.env.EMAIL_TEMPLATE_LOGO_URL || "/assets/imgs/logo/site-logo-white-2.png"
);
const emailIllustrationPrimary = toAbsolute(
  process.env.EMAIL_TEMPLATE_ILLUSTRATION_PRIMARY ||
    "/images/ulistration/Focused-woman-designing-with-a-stylus.png"
);
const emailIllustrationSecondary = toAbsolute(
  process.env.EMAIL_TEMPLATE_ILLUSTRATION_SECONDARY || emailIllustrationPrimary
);

// Social Links
const socialLinks = {
  youtube: process.env.SOCIAL_YOUTUBE_URL,
  instagram: process.env.SOCIAL_INSTAGRAM_URL,
  twitter: process.env.SOCIAL_TWITTER_URL,
  linkedin: process.env.SOCIAL_LINKEDIN_URL,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "*****" : "undefined");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const requiredEnv = {
    CONTACT_NOTIFICATION_EMAIL1: notificationEmail1,
    SMTP_FROM_EMAIL: fromEmail,
    SMTP_FROM_NAME: companyName,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER || process.env.SMTP_USERNAME,
    SMTP_PASS: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
  };

  const missingEnv = Object.entries(requiredEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingEnv.length > 0) {
    return res.status(500).json({
      error: "Missing required email configuration",
      missing: missingEnv,
    });
  }

  // Save to database
  await prisma.contactSubmission.create({
    data: { name, email, phone: phone || null, message },
  });

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "ssl",
    auth: {
      user: process.env.SMTP_USER || process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const now = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const font = "Inter, 'Segoe UI', Arial, sans-serif";
  const gold = "#FFC81A";
  const dark = "#0f1115";

  const socialIconsHTML = [
    { href: socialLinks.youtube, label: "YT" },
    { href: socialLinks.linkedin, label: "IN" },
    { href: socialLinks.instagram, label: "IG" },
    { href: socialLinks.twitter, label: "X" },
  ]
    .filter((s) => s.href)
    .map(
      (s) =>
        `<a href="${s.href}" style="display:inline-block;margin:0 5px;width:34px;height:34px;line-height:34px;border-radius:50%;background:#2a2a2a;color:#fff;text-decoration:none;font-size:11px;font-weight:800;text-align:center;font-family:${font};">${s.label}</a>`
    )
    .join("");

  const submittedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // ==========================================
  // EMAIL 1: Confirmation to Client
  // ==========================================
  const clientEmailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>We received your message — ${companyName}</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;">
<!-- preheader -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f2f2f2;">Thank you ${name} — we received your message and will reply within 24-48 hours.&#8203;&#65279;&#8203;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

  <!-- ── LOGO BAR ── -->
  <tr>
    <td style="background:${dark};border-radius:14px 14px 0 0;padding:20px 32px;text-align:center;">
      <img src="${siteUrl}/assets/imgs/logo/footer-logo-white.png" alt="${companyName}" width="200" height="auto" style="display:block;margin:0 auto;border:0;max-width:200px;height:auto;" />
    </td>
  </tr>

  <!-- ── HERO ── -->
  <tr>
    <td style="background:#ede9fe;padding:40px 32px 0;text-align:center;">
      <!-- checkmark circle -->
      <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
        <tr>
          <td width="60" height="60" style="background:${gold};border-radius:50%;text-align:center;vertical-align:middle;">
            <span style="font-size:28px;color:${dark};font-family:Arial,sans-serif;line-height:60px;display:block;">&#10003;</span>
          </td>
        </tr>
      </table>
      <h1 style="margin:0 0 10px;color:${dark};font-size:32px;font-weight:800;font-family:${font};line-height:1.2;">Thank You, ${name}!</h1>
      <p style="margin:0 auto 28px;max-width:400px;color:#4c3f72;font-size:15px;font-family:${font};line-height:1.65;">We have received your message. Our team is on it and will get back to you very soon.</p>
      <img src="${siteUrl}/images/ulistration/novaimpact-submit.png" alt="" width="280" height="auto" style="display:block;margin:0 auto;max-width:280px;height:auto;border:0;" />
    </td>
  </tr>

  <!-- ── WHAT HAPPENS NEXT ── -->
  <tr>
    <td style="background:#fff;padding:36px 32px 28px;">
      <h2 style="margin:0 0 26px;color:${dark};font-size:19px;font-weight:800;font-family:${font};text-align:center;letter-spacing:-0.3px;">What happens next?</h2>

      <!-- Step 1 -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
        <tr>
          <td width="52" valign="top" style="padding-right:16px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="40" height="40" style="background:${gold};border-radius:50%;text-align:center;vertical-align:middle;font-size:17px;font-weight:800;color:${dark};font-family:${font};line-height:40px;">1</td>
            </tr></table>
          </td>
          <td valign="middle">
            <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:${dark};font-family:${font};">We review your inquiry</p>
            <p style="margin:0;font-size:13px;color:#6b7280;font-family:${font};line-height:1.55;">Our team carefully reads every submission and routes it to the right expert.</p>
          </td>
        </tr>
      </table>

      <!-- Step 2 -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
        <tr>
          <td width="52" valign="top" style="padding-right:16px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="40" height="40" style="background:${dark};border-radius:50%;text-align:center;vertical-align:middle;font-size:17px;font-weight:800;color:${gold};font-family:${font};line-height:40px;">2</td>
            </tr></table>
          </td>
          <td valign="middle">
            <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:${dark};font-family:${font};">We reply within 24–48 hours</p>
            <p style="margin:0;font-size:13px;color:#6b7280;font-family:${font};line-height:1.55;">Expect a personalised reply at <strong>${email}</strong> from our team.</p>
          </td>
        </tr>
      </table>

      <!-- Step 3 -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="52" valign="top" style="padding-right:16px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="40" height="40" style="background:${gold};border-radius:50%;text-align:center;vertical-align:middle;font-size:17px;font-weight:800;color:${dark};font-family:${font};line-height:40px;">3</td>
            </tr></table>
          </td>
          <td valign="middle">
            <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:${dark};font-family:${font};">Let's build something great together</p>
            <p style="margin:0;font-size:13px;color:#6b7280;font-family:${font};line-height:1.55;">We'll align on your goals and show you exactly how Nova Impact can drive results.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── DIVIDER ── -->
  <tr><td style="background:#fff;padding:0 32px;"><div style="height:1px;background:#e5e7eb;font-size:0;line-height:0;">&nbsp;</div></td></tr>

  <!-- ── YOUR SUBMISSION ── -->
  <tr>
    <td style="background:#fff;padding:28px 32px;">
      <h2 style="margin:0 0 18px;color:${dark};font-size:17px;font-weight:800;font-family:${font};letter-spacing:-0.2px;">Your Submission</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <tr style="background:#f8f9fa;">
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#9ca3af;font-family:${font};width:110px;">Subject</td>
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:14px;font-weight:600;color:${dark};font-family:${font};">${subject}</td>
        </tr>
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#9ca3af;font-family:${font};vertical-align:top;">Message</td>
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;font-family:${font};line-height:1.55;">${message.substring(0, 140)}${message.length > 140 ? "…" : ""}</td>
        </tr>
        <tr style="background:#f8f9fa;">
          <td style="padding:14px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#9ca3af;font-family:${font};">Submitted</td>
          <td style="padding:14px 20px;font-size:13px;color:#374151;font-family:${font};">${submittedDate}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── DIVIDER ── -->
  <tr><td style="background:#fff;padding:0 32px;"><div style="height:1px;background:#e5e7eb;font-size:0;line-height:0;">&nbsp;</div></td></tr>

  <!-- ── WHILE YOU WAIT ── -->
  <tr>
    <td style="background:#fff;padding:28px 32px;">
      <h2 style="margin:0 0 8px;color:${dark};font-size:17px;font-weight:800;font-family:${font};letter-spacing:-0.2px;">While You Wait</h2>
      <p style="margin:0 0 20px;color:#6b7280;font-size:14px;font-family:${font};line-height:1.6;">Explore our work and see how we've helped other businesses grow:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:8px;" width="50%">
            <a href="${siteUrl}/portfolio" style="display:block;background:${dark};color:${gold};padding:14px 16px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;text-align:center;font-family:${font};">View Our Portfolio</a>
          </td>
          <td style="padding-left:8px;" width="50%">
            <a href="${siteUrl}/blog" style="display:block;background:#f8f9fa;color:${dark};padding:14px 16px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;text-align:center;font-family:${font};border:2px solid #e5e7eb;">Read Our Blog</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── URGENT HELP ── -->
  <tr>
    <td style="background:#fff;padding:0 32px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9E6;border:1.5px solid ${gold};border-radius:10px;">
        <tr>
          <td style="padding:22px 24px;text-align:center;">
            <p style="margin:0 0 5px;font-size:15px;font-weight:800;color:${dark};font-family:${font};">Need Immediate Assistance?</p>
            <p style="margin:0 0 12px;font-size:13px;color:#6b7280;font-family:${font};">For urgent inquiries, reach us directly:</p>
            <a href="mailto:${fromEmail}" style="color:${dark};font-size:15px;font-weight:700;text-decoration:none;font-family:${font};">${fromEmail}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── FOOTER ── -->
  <tr>
    <td style="background:${dark};border-radius:0 0 14px 14px;padding:28px 32px;text-align:center;border-top:3px solid ${gold};">
      <p style="margin:0 0 4px;color:${gold};font-size:18px;font-weight:800;font-family:${font};letter-spacing:-0.3px;">${companyName}</p>
      <p style="margin:0 0 16px;color:#9ca3af;font-size:12px;font-family:${font};">Transforming businesses through digital excellence</p>
      <div style="margin:0 0 16px;">${socialIconsHTML}</div>
      <p style="margin:0;font-size:11px;font-family:${font};"><a href="${siteUrl}" style="color:${gold};text-decoration:none;">${siteUrl}</a></p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // ==========================================
  // EMAIL 2: Notification to Admin
  // ==========================================
  const companyEmailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>New Lead: ${subject} — ${companyName}</title>
</head>
<body style="margin:0;padding:0;background:#f2f2f2;">
<!-- preheader -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#f2f2f2;">New lead from ${name} (${email}) — Subject: ${subject}&#8203;&#65279;&#8203;</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

  <!-- ── LOGO BAR with badge ── -->
  <tr>
    <td style="background:${dark};border-radius:14px 14px 0 0;padding:20px 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="middle">
            <img src="${siteUrl}/assets/imgs/logo/footer-logo-white.png" alt="${companyName}" width="170" height="auto" style="display:block;border:0;max-width:170px;height:auto;" />
          </td>
          <td valign="middle" align="right">
            <span style="display:inline-block;background:${gold};color:${dark};font-size:11px;font-weight:800;padding:5px 14px;border-radius:999px;font-family:${font};letter-spacing:0.6px;text-transform:uppercase;">&#9679;&nbsp;New Lead</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── ALERT BANNER ── -->
  <tr>
    <td style="background:${gold};padding:22px 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="52" valign="middle" style="padding-right:16px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td width="44" height="44" style="background:${dark};border-radius:10px;text-align:center;vertical-align:middle;font-size:22px;line-height:44px;">&#128276;</td>
            </tr></table>
          </td>
          <td valign="middle">
            <p style="margin:0 0 3px;font-size:19px;font-weight:800;color:${dark};font-family:${font};line-height:1.2;">New Contact Form Submission</p>
            <p style="margin:0;font-size:13px;color:#2a1f00;font-family:${font};">Received on <strong>${now}</strong></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── CONTACT CARD ── -->
  <tr>
    <td style="background:#fff;padding:30px 28px 20px;">
      <h2 style="margin:0 0 16px;font-size:12px;font-weight:700;color:#9ca3af;font-family:${font};text-transform:uppercase;letter-spacing:1px;">Contact Details</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
        <tr style="background:#f8f9fa;">
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#9ca3af;font-family:${font};width:90px;">Name</td>
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:14px;font-weight:700;color:${dark};font-family:${font};">${name}</td>
        </tr>
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#9ca3af;font-family:${font};">Email</td>
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:14px;font-family:${font};"><a href="mailto:${email}" style="color:${dark};text-decoration:none;font-weight:600;">${email}</a></td>
        </tr>
        <tr style="background:#f8f9fa;">
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#9ca3af;font-family:${font};">Phone</td>
          <td style="padding:14px 20px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;font-family:${font};">${phone || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding:14px 20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#9ca3af;font-family:${font};">Subject</td>
          <td style="padding:14px 20px;font-size:14px;font-weight:700;color:${dark};font-family:${font};">${subject}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── MESSAGE ── -->
  <tr>
    <td style="background:#fff;padding:0 28px 28px;">
      <h2 style="margin:0 0 14px;font-size:12px;font-weight:700;color:#9ca3af;font-family:${font};text-transform:uppercase;letter-spacing:1px;">Message</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;border-left:4px solid ${gold};border-radius:0 8px 8px 0;">
        <tr>
          <td style="padding:20px 22px;font-size:15px;line-height:1.7;color:#374151;font-family:${font};font-style:italic;">${message.replace(/\n/g, "<br/>")}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── ACTION BUTTONS ── -->
  <tr>
    <td style="background:#fff;padding:0 28px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:8px;" width="50%">
            <a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}" style="display:block;background:${gold};color:${dark};padding:14px 16px;border-radius:8px;text-decoration:none;font-weight:800;font-size:14px;text-align:center;font-family:${font};">Reply to ${name}</a>
          </td>
          <td style="padding-left:8px;" width="50%">
            <a href="${siteUrl}/admin/contacts" style="display:block;background:${dark};color:${gold};padding:14px 16px;border-radius:8px;text-decoration:none;font-weight:800;font-size:14px;text-align:center;font-family:${font};">View in Admin &rarr;</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── FOOTER ── -->
  <tr>
    <td style="background:${dark};border-radius:0 0 14px 14px;padding:24px 28px;text-align:center;border-top:3px solid ${gold};">
      <div style="margin:0 0 12px;">${socialIconsHTML}</div>
      <p style="margin:0 0 4px;color:#6b7280;font-size:12px;font-family:${font};">This notification was generated by the ${companyName} contact form.</p>
      <p style="margin:0;font-size:11px;font-family:${font};"><a href="${siteUrl}" style="color:${gold};text-decoration:none;">${siteUrl}</a></p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // Send both emails
  try {
    // Verify transporter configuration
    await transporter.verify();
    
    // Email to company recipients (from .env first + second)
    await transporter.sendMail({
      from: `"${companyName}" <${fromEmail}>`,
      to: notificationRecipients.join(","),
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: companyEmailHTML,
    });

    // Email to client (confirmation)
    await transporter.sendMail({
      from: `"${companyName}" <${fromEmail}>`,
      to: email,
      subject: `We received your message - ${companyName}`,
      html: clientEmailHTML,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpSecure: process.env.SMTP_SECURE,
      smtpUsername: process.env.SMTP_USERNAME,
    });
    res.status(500).json({ 
      error: "Failed to send emails",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
