import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'DELETE') {
    await prisma.subscriber.delete({ where: { id } });
    return res.status(200).json({ message: 'Subscriber removed' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
