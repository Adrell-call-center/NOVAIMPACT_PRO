import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    if (existing.status === 'UNSUBSCRIBED') {
      await prisma.subscriber.update({ where: { email }, data: { status: 'ACTIVE', unsubscribedAt: null } });
    }
    return res.status(200).json({ message: 'Already subscribed' });
  }

  await prisma.subscriber.create({ data: { email } });
  return res.status(201).json({ message: 'Subscribed successfully' });
}
