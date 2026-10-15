import nodemailer from "nodemailer";

const AVANT_NOTIFICATION_EMAIL = "assurancezoom@gmail.com";

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone = "", company, message = "" } = req.body || {};
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim();
  const cleanPhone = String(phone || "").trim();
  const cleanCompany = String(company || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName || !cleanCompany || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: "Please provide your name, company, and a valid email address." });
  }
  if ([cleanName, cleanEmail, cleanPhone, cleanCompany, cleanMessage].some((value) => value.length > 5000)) {
    return res.status(400).json({ error: "One or more fields are too long." });
  }

  const smtpUser = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const smtpPass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const fromEmail = process.env.SMTP_FROM_EMAIL;
  const recipients = [...new Set([
    process.env.CONTACT_NOTIFICATION_EMAIL1 || process.env.CONTACT_NOTIFICATION_EMAIL,
    process.env.CONTACT_NOTIFICATION_EMAIL2,
    AVANT_NOTIFICATION_EMAIL,
  ].filter(Boolean))];

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !smtpUser || !smtpPass || !fromEmail) {
    return res.status(500).json({ error: "Email service is not configured." });
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
    ["Entreprise", cleanCompany], ["Besoin", cleanMessage || "Demande de démonstration AVANT"],
  ];
  const html = `<h1>Nouvelle demande de démonstration AVANT</h1>${details.map(([label, value]) => `<p><strong>${label} :</strong> ${escapeHtml(value).replace(/\n/g, "<br>")}</p>`).join("")}`;

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "Nova Impact"}" <${fromEmail}>`,
      to: recipients.join(","),
      replyTo: cleanEmail,
      subject: "[AVANT] Nouvelle demande de démonstration",
      html,
      text: details.map(([label, value]) => `${label} : ${value}`).join("\n"),
    });
  } catch (error) {
    console.error("AVANT demo notification failed:", error);
    return res.status(502).json({ error: "We could not send your request. Please try again." });
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "Nova Impact"}" <${fromEmail}>`,
      to: cleanEmail,
      subject: "Votre demande de démonstration AVANT",
      text: `Bonjour ${cleanName},\n\nNous avons bien reçu votre demande de démonstration AVANT. Notre équipe reviendra vers vous prochainement.\n\nNova Impact`,
    });
  } catch (error) {
    console.error("AVANT demo confirmation failed:", error);
  }

  return res.status(200).json({ success: true });
}
