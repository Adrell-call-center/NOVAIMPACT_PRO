import { requireAdmin } from '@/lib/adminAuth';
import upload from '@/lib/upload';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

export const config = { api: { bodyParser: false } };

async function compressPdf(filePath) {
  try {
    const original = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(original, { ignoreEncryption: true });
    const compressed = await pdfDoc.save({ useObjectStreams: true });

    // Only overwrite if we actually made it smaller
    if (compressed.byteLength < original.byteLength) {
      fs.writeFileSync(filePath, compressed);
      return compressed.byteLength;
    }
    return original.byteLength;
  } catch (err) {
    console.error('PDF compression failed, keeping original:', err.message);
    return fs.statSync(filePath).size;
  }
}

export default async function handler(req, res) {
  const session = await requireAdmin(req, res);
  if (!session) return;

  if (req.method === 'GET') {
    const uploads = await prisma.upload.findMany({ orderBy: { createdAt: 'desc' } });
    return res.status(200).json({ uploads });
  }

  if (req.method === 'POST') {
    return new Promise((resolve) => {
      upload.single('file')(req, res, async (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File too large (max 50MB)' });
          }
          return res.status(400).json({ error: err.message });
        }
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        try {
          const filePath = path.join(process.cwd(), 'public/uploads', req.file.filename);
          let finalSize = req.file.size;

          // Compress PDFs after saving to disk
          if (req.file.mimetype === 'application/pdf') {
            finalSize = await compressPdf(filePath);
          }

          const uploadRecord = await prisma.upload.create({
            data: {
              filename: req.file.originalname,
              path: `/api/uploads/${req.file.filename}`,
              size: finalSize,
              mimeType: req.file.mimetype,
            },
          });

          res.status(201).json({ upload: uploadRecord, url: uploadRecord.path });
        } catch (dbErr) {
          console.error('Upload DB error:', dbErr);
          res.status(500).json({ error: 'Failed to save upload record' });
        }
        resolve();
      });
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
