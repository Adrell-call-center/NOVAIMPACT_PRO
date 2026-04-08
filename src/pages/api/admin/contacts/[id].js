import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { isRead } = req.body;
    const contact = await prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
    });
    return res.status(200).json({ contact });
  }

  if (req.method === 'DELETE') {
    await prisma.contactSubmission.delete({ where: { id } });
    return res.status(200).json({ message: 'Contact deleted' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
