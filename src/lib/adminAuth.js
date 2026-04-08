import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function requireAdmin(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return session;
}
