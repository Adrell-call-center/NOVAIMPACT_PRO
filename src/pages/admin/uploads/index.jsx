import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/admin/Pagination';

const ITEMS_PER_PAGE = 12;

export default function AdminUploads() {
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchUploads(); }, []);

  const fetchUploads = async () => {
    const res = await fetch('/api/admin/uploads');
    const data = await res.json();
    setUploads(data.uploads || []);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      await fetch('/api/admin/uploads', { method: 'POST', body: fd });
    }
    
    setUploading(false);
    fetchUploads();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`/api/admin/uploads/${id}`, { method: 'DELETE' });
    fetchUploads();
  };

  // Pagination
  const totalPages = Math.ceil(uploads.length / ITEMS_PER_PAGE);
  const paginatedUploads = uploads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Head><title>Media Library — Nova Impact Admin</title></Head>
      <AdminLayout title="Media Library">
        <div className="admin-page-header">
          <div className="admin-upload-stats">
            <span className="admin-stat">{uploads.length}</span> files uploaded
            <span className="admin-stat-total">({(uploads.reduce((acc, u) => acc + (u.size || 0), 0) / 1024 / 1024).toFixed(2)} MB total)</span>
          </div>
          <label className="btn-gold btn-upload">
            <i className="fa-solid fa-upload me-2"></i>{uploading ? 'Uploading...' : 'Upload Images'}
            <input type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>

        {preview && (
          <div className="admin-preview-modal">
            <div className="admin-preview-content">
              <img src={preview} alt="Preview" />
              <button className="admin-preview-close" onClick={() => setPreview('')}><i className="fa-solid fa-times"></i></button>
            </div>
          </div>
        )}

        {uploads.length > 0 ? (
          <>
            <div className="admin-upload-grid">
              {paginatedUploads.map(u => (
                <div className="admin-upload-card" key={u.id}>
                  <div className="admin-upload-thumb" onClick={() => setPreview(u.path)}>
                    <img src={u.path} alt={u.filename} />
                    <div className="admin-upload-overlay">
                      <i className="fa-solid fa-expand"></i>
                    </div>
                  </div>
                  <div className="admin-upload-info">
                    <p className="admin-upload-name" title={u.filename}>{u.filename}</p>
                    <div className="admin-upload-meta">
                      <span className="admin-upload-size">{(u.size / 1024).toFixed(1)} KB</span>
                      <button className="admin-upload-delete" onClick={() => handleDelete(u.id)}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={uploads.length} />
          </>
        ) : (
          <div className="admin-light-card">
            <div className="admin-empty-state">
              <i className="fa-solid fa-image"></i>
              <h3>No images uploaded yet</h3>
              <p>Upload your first images to get started</p>
              <label className="btn-gold">
                <i className="fa-solid fa-upload me-2"></i>Upload Images
                <input type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        )}
      </AdminLayout>

      <style jsx global>{`
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-upload-stats {
          font-size: 14px;
          color: #6c757d;
        }

        .admin-stat {
          font-size: 24px;
          font-weight: 700;
          color: #1a1d21;
          margin-right: 8px;
        }

        .admin-stat-total {
          margin-left: 8px;
          color: #6c757d;
        }

        .btn-gold {
          background: #FFC81A;
          color: #1a1d21;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-gold:hover {
          background: #e6b517;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255,200,26,0.3);
        }

        .btn-gold:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 40px;
        }

        .admin-preview-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
        }

        .admin-preview-content img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .admin-preview-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
        }

        .admin-upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .admin-upload-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e8e8e8;
          transition: all 0.3s ease;
        }

        .admin-upload-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          border-color: #FFC81A;
        }

        .admin-upload-thumb {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          cursor: pointer;
          background: #f8f9fa;
        }

        .admin-upload-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .admin-upload-card:hover .admin-upload-thumb img {
          transform: scale(1.05);
        }

        .admin-upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .admin-upload-card:hover .admin-upload-overlay {
          opacity: 1;
        }

        .admin-upload-overlay i {
          color: #fff;
          font-size: 24px;
        }

        .admin-upload-info {
          padding: 14px 16px;
        }

        .admin-upload-name {
          font-size: 13px;
          margin: 0 0 10px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #1a1d21;
        }

        .admin-upload-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .admin-upload-size {
          font-size: 12px;
          color: #6c757d;
        }

        .admin-upload-delete {
          width: 28px;
          height: 28px;
          border: 1px solid #e8e8e8;
          background: #ffffff;
          border-radius: 6px;
          color: #6c757d;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .admin-upload-delete:hover {
          background: #dc3545;
          color: #fff;
          border-color: #dc3545;
        }

        .admin-light-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e8e8e8;
          overflow: hidden;
        }

        .admin-empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .admin-empty-state i {
          font-size: 64px;
          color: #e8e8e8;
          margin-bottom: 24px;
        }

        .admin-empty-state h3 {
          font-size: 20px;
          color: #1a1d21;
          margin: 0 0 8px 0;
        }

        .admin-empty-state p {
          color: #6c757d;
          margin: 0 0 24px 0;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
