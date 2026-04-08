import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const contacts = await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ contacts });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
