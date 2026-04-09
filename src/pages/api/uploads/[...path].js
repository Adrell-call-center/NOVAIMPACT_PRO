import fs from 'fs';
import path from 'path';

const MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  zip: 'application/zip',
  txt: 'text/plain',
};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const segments = req.query.path;
  if (!segments || segments.length === 0) {
    return res.status(404).end();
  }

  // Prevent path traversal
  const filename = path.basename(segments[segments.length - 1]);
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).end();
  }

  const ext = filename.split('.').pop()?.toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}
