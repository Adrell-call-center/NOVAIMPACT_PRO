import nodemailer from "nodemailer";

const SOLUTION_CONTACT_EMAIL = "contact@novaimpactltd.com";
const SOLUTION_NAME = "SOLUTION DÉMARCHAGE TÉLÉPHONIQUE · FRANCE";
const SOLUTION_PATH = "/demarchage-telephonique-solution";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const nativeForm = String(req.headers["content-type"] || "").includes("application/x-www-form-urlencoded");
  const respondError = (status, error) => nativeForm
    ? res.redirect(303, `${SOLUTION_PATH}#contact-error`)
    : res.status(status).json({ error });

  const { name, email, phone = "", company, message = "" } = req.body || {};
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanPhone = String(phone || "").trim();
  const cleanCompany = String(company || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName || !cleanCompany || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return respondError(400, "Please provide your name, company, and a valid email address.");
  }
  if ([cleanName, cleanEmail, cleanPhone, cleanCompany, cleanMessage].some((value) => value.length > 5000)) {
    return respondError(400, "One or more fields are too long.");
  }

  const smtpUser = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const fromEmail = process.env.SMTP_FROM_EMAIL;

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !smtpUser || !smtpPass || !fromEmail) {
    return respondError(500, "Email service is not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "ssl",
    auth: { user: smtpUser, pass: smtpPass },
    tls: { rejectUnauthorized: false },
  });

  const details = [
    ["Nom", cleanName], ["Email", cleanEmail], ["Téléphone", cleanPhone || "Non renseigné"],
    ["Entreprise", cleanCompany], ["Besoin", cleanMessage || "Demande de démonstration"],
  ];
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://novaimpactltd.com";
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;color:#0f1115">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2;padding:32px 16px"><tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border-radius:14px;overflow:hidden">
        <tr><td style="background:#0f1115;padding:23px 32px;text-align:center"><img src="${siteUrl}/assets/imgs/logo/footer-logo-white.png" width="180" alt="Nova Impact" style="display:block;max-width:180px;height:auto;margin:auto"></td></tr>
        <tr><td style="background:#ffc81a;padding:28px 32px"><p style="margin:0 0 8px;font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase">Nouvelle demande de démonstration</p><h1 style="margin:0;font-size:27px;line-height:1.25;color:#0f1115">${SOLUTION_NAME}</h1></td></tr>
        <tr><td style="padding:30px 32px 12px"><p style="margin:0 0 20px;font-size:15px;line-height:1.6">Une personne a demandé une démonstration depuis la page de la solution. Voici les informations transmises :</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden">${details.map(([label, value], index) => `<tr style="background:${index % 2 ? "#fff" : "#f8f9fa"}"><td style="width:115px;padding:12px 15px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:800;text-transform:uppercase;vertical-align:top">${label}</td><td style="padding:12px 15px;border-bottom:1px solid #e5e7eb;font-size:14px;line-height:1.5;overflow-wrap:anywhere">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>
        </td></tr>
        <tr><td style="padding:18px 32px 34px"><a href="mailto:${encodeURIComponent(cleanEmail)}?subject=${encodeURIComponent(`Re: ${SOLUTION_NAME}`)}" style="display:inline-block;background:#ffc81a;color:#0f1115;border-radius:8px;padding:13px 22px;text-decoration:none;font-size:14px;font-weight:800">Répondre à ${escapeHtml(cleanName)}</a></td></tr>
        <tr><td style="background:#0f1115;padding:20px 32px;color:#aeb4be;text-align:center;font-size:12px">Nova Impact · ${SOLUTION_NAME}</td></tr>
      </table>
    </td></tr></table></body></html>`;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "Nova Impact"}" <${fromEmail}>`,
      to: SOLUTION_CONTACT_EMAIL,
      replyTo: cleanEmail,
      subject: `[Contact] ${SOLUTION_NAME} — Demande de démonstration`,
      html,
      text: `${SOLUTION_NAME}\nDemande de démonstration\n\n${details.map(([label, value]) => `${label} : ${value}`).join("\n")}`,
    });
  } catch (error) {
    console.error("AVANT demo email failed:", error);
    return respondError(502, "We could not send your request. Please try again.");
  }

  return nativeForm ? res.redirect(303, `${SOLUTION_PATH}#contact-sent`) : res.status(200).json({ success: true });
}
