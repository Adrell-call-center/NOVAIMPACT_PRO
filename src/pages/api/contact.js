import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

const marketingEmail = "assurancezoom@gmail.com";
const fromEmail = "contact@novaimpact.io";
const companyName = process.env.SMTP_FROM_NAME || "Nova Impact";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nova-impact.com";

// Social Links
const socialLinks = {
  youtube: "https://www.youtube.com/@novaimpactagency",
  instagram: "https://www.instagram.com/novaimpact.io/",
  twitter: "https://x.com/ImpactNova_io",
  linkedin: "https://www.linkedin.com/company/nova-impact-io/posts/?feedView=all",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields" });
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
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
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

  const socialIconsHTML = `
    <a href="${socialLinks.youtube}" style="display:inline-block; margin:0 6px; text-decoration:none;">
      <img src="https://cdn-icons-png.flaticon.com/32/1384/1384060.png" alt="YouTube" width="28" height="28" style="display:inline-block; border:0;" />
    </a>
    <a href="${socialLinks.linkedin}" style="display:inline-block; margin:0 6px; text-decoration:none;">
      <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" alt="LinkedIn" width="28" height="28" style="display:inline-block; border:0;" />
    </a>
    <a href="${socialLinks.instagram}" style="display:inline-block; margin:0 6px; text-decoration:none;">
      <img src="https://cdn-icons-png.flaticon.com/32/2111/2111463.png" alt="Instagram" width="28" height="28" style="display:inline-block; border:0;" />
    </a>
    <a href="${socialLinks.twitter}" style="display:inline-block; margin:0 6px; text-decoration:none;">
      <img src="https://cdn-icons-png.flaticon.com/32/3670/3670151.png" alt="X" width="28" height="28" style="display:inline-block; border:0;" />
    </a>
  `;

  // ==========================================
  // EMAIL 1: Notification to Company (Admin)
  // ==========================================
  const companyEmailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: #1a1a1a; padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFC81A; font-size: 26px; font-weight: 700;">New Contact Form Submission</h1>
              <p style="margin: 10px 0 0; color: #cccccc; font-size: 14px;">Someone has reached out via your website</p>
            </td>
          </tr>

          <!-- Sender Info -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px; font-size: 16px; color: #1a1a1a; border-bottom: 2px solid #FFC81A; padding-bottom: 10px;">Sender Details</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">
                    <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Full Name</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8; text-align: right;">
                    <strong style="color: #1a1a1a; font-size: 16px;">${name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">
                    <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Email</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8; text-align: right;">
                    <a href="mailto:${email}" style="color: #FFC81A; font-size: 16px; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">
                    <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Phone</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8; text-align: right;">
                    <span style="color: #1a1a1a; font-size: 16px;">${phone || "Not provided"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Subject</strong>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="color: #1a1a1a; font-size: 16px;">${subject}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 15px; font-size: 16px; color: #1a1a1a; border-bottom: 2px solid #FFC81A; padding-bottom: 10px;">Message</h2>
              <div style="background: #f8f9fa; border-left: 4px solid #FFC81A; padding: 20px; border-radius: 4px; font-size: 15px; line-height: 1.7; color: #333;">
                ${message.replace(/\n/g, "<br/>")}
              </div>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="mailto:${email}?subject=Re: ${subject}" style="display: inline-block; background: #FFC81A; color: #1a1a1a; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px;">Reply via Email</a>
              <a href="${siteUrl}/admin/contacts" style="display: inline-block; background: #1a1a1a; color: #FFC81A; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 5px;">View in Admin</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1a1a1a; padding: 25px 30px; text-align: center; border-top: 1px solid #333;">
              <p style="margin: 0 0 10px; color: #cccccc; font-size: 13px;">Received: ${now}</p>
              <div style="margin: 10px 0;">
                ${socialIconsHTML}
              </div>
              <p style="margin: 0; color: #888; font-size: 12px;">This email was sent from the ${companyName} contact form.</p>
              <p style="margin: 5px 0 0; color: #888; font-size: 12px;"><a href="${siteUrl}" style="color: #FFC81A; text-decoration: none;">${siteUrl}</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // ==========================================
  // EMAIL 2: Confirmation to Client
  // ==========================================
  const clientEmailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Message</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: #1a1a1a; padding: 50px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFC81A; font-size: 28px; font-weight: 700;">Thank You, ${name}</h1>
              <p style="margin: 12px 0 0; color: #cccccc; font-size: 16px;">We have received your message and will get back to you shortly.</p>
            </td>
          </tr>

          <!-- Confirmation Details -->
          <tr>
            <td style="padding: 30px;">
              <div style="background: #fff9e6; border-left: 4px solid #FFC81A; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 8px; color: #1a1a1a; font-size: 15px;">What happens next?</h3>
                <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.6;">Our team typically responds within <strong>24-48 hours</strong>. We will review your inquiry and get back to you at this email address as soon as possible.</p>
              </div>

              <h2 style="margin: 0 0 20px; font-size: 16px; color: #1a1a1a; border-bottom: 2px solid #FFC81A; padding-bottom: 10px;">Your Submission</h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f9fa; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">
                    <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Subject</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8; text-align: right;">
                    <strong style="color: #1a1a1a; font-size: 15px;">${subject}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8;">
                    <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Your Message</strong>
                  </td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e8e8e8; text-align: right; max-width: 300px;">
                    <span style="color: #1a1a1a; font-size: 14px;">${message.substring(0, 100)}${message.length > 100 ? "..." : ""}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #666; font-size: 12px; text-transform: uppercase;">Submitted</strong>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="color: #1a1a1a; font-size: 14px;">${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- While You Wait -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h2 style="margin: 0 0 15px; font-size: 16px; color: #1a1a1a; border-bottom: 2px solid #FFC81A; padding-bottom: 10px;">While You Wait</h2>
              <p style="color: #666; font-size: 14px; line-height: 1.7; margin: 0 0 15px;">In the meantime, feel free to explore our work and see how we have helped other businesses achieve their goals:</p>
              
              <a href="${siteUrl}/portfolio" style="display: block; background: #f8f9fa; border-left: 4px solid #FFC81A; padding: 15px 20px; border-radius: 4px; text-decoration: none; color: #1a1a1a; font-weight: 600; margin-bottom: 10px;">View Our Portfolio</a>
              <a href="${siteUrl}/blog" style="display: block; background: #f8f9fa; border-left: 4px solid #1a1a1a; padding: 15px 20px; border-radius: 4px; text-decoration: none; color: #1a1a1a; font-weight: 600;">Read Our Blog</a>
            </td>
          </tr>

          <!-- Need Immediate Help? -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #fff9e6; border-radius: 8px; padding: 20px; text-align: center; border: 1px solid #FFC81A;">
                <h3 style="margin: 0 0 8px; color: #1a1a1a; font-size: 15px;">Need Immediate Assistance?</h3>
                <p style="margin: 0 0 12px; color: #666; font-size: 14px;">If your inquiry is urgent, you can also reach us directly:</p>
                <p style="margin: 0; font-size: 15px;">
                  <a href="mailto:${marketingEmail}" style="color: #FFC81A; text-decoration: none; font-weight: 600;">${marketingEmail}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1a1a1a; padding: 25px 30px; text-align: center; border-top: 1px solid #333;">
              <p style="margin: 0 0 10px; color: #FFC81A; font-size: 18px; font-weight: 700;">${companyName}</p>
              <p style="margin: 0 0 10px; color: #cccccc; font-size: 13px;">Transforming businesses through digital excellence</p>
              <div style="margin: 12px 0;">
                ${socialIconsHTML}
              </div>
              <p style="margin: 10px 0 0; color: #888; font-size: 12px;">
                <a href="${siteUrl}" style="color: #FFC81A; text-decoration: none;">${siteUrl}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  // Send both emails
  try {
    // Verify transporter configuration
    await transporter.verify();
    
    // Email to marketing team (assurancezoom@gmail.com)
    await transporter.sendMail({
      from: `"${companyName}" <${fromEmail}>`,
      to: marketingEmail,
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
