import { requireAdmin } from '@/lib/adminAuth';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;

  if (req.method === 'DELETE') {
    const upload = await prisma.upload.findUnique({ where: { id } });
    if (!upload) return res.status(404).json({ error: 'Upload not found' });

    await prisma.upload.delete({ where: { id } });
    return res.status(200).json({ message: 'Upload deleted' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
