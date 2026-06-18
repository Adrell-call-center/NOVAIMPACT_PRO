import { generateLlmsTxt } from '@/lib/seo/llms';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = await generateLlmsTxt();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(body);
  } catch (error) {
    console.error('llms.txt generation failed:', error);
    res.status(500).json({ error: 'Failed to generate llms.txt' });
  }
}
