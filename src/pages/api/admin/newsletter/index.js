import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const subscribers = await prisma.subscriber.findMany({ orderBy: { subscribedAt: 'desc' } });
    return res.status(200).json({ subscribers });
  }

  if (req.method === 'POST') {
    const { subject, body } = req.body;
    if (!subject || !body) return res.status(400).json({ error: 'subject and body required' });

    const activeSubscribers = await prisma.subscriber.findMany({
      where: { status: 'ACTIVE' },
      select: { email: true },
    });

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'tls',
      auth: { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const emails = activeSubscribers.map(s => s.email);
    if (emails.length === 0) return res.status(200).json({ message: 'No active subscribers' });

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      bcc: emails,
      subject,
      text: body,
      html: body,
    });

    return res.status(200).json({ message: `Broadcast sent to ${emails.length} subscribers` });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
