import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

const ITEMS_PER_PAGE = 18;

export default function AdminUploads() {
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

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
    e.target.value = '';
    fetchUploads();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/uploads/${id}`, { method: 'DELETE' });
    setSelected(prev => prev.filter(s => s !== id));
    fetchUploads();
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} files?`)) return;
    for (const id of selected) await fetch(`/api/admin/uploads/${id}`, { method: 'DELETE' });
    setSelected([]);
    fetchUploads();
  };

  const copyUrls = () => {
    const urls = uploads.filter(u => selected.includes(u.id)).map(f => window.location.origin + f.path).join('\n');
    navigator.clipboard.writeText(urls);
  };

  // Filter
  const filtered = uploads.filter(u => {
    if (typeFilter !== 'all') {
      if (typeFilter === 'image' && !u.mimeType?.startsWith('image')) return false;
      if (typeFilter === 'pdf' && u.mimeType !== 'application/pdf') return false;
      if (typeFilter === 'other' && (u.mimeType?.startsWith('image') || u.mimeType === 'application/pdf')) return false;
    }
    if (searchQuery) return (u.filename || '').toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const totalSize = uploads.reduce((acc, u) => acc + (u.size || 0), 0);
  const imageCount = uploads.filter(u => u.mimeType?.startsWith('image')).length;
  const otherCount = uploads.length - imageCount;

  const isImage = (u) => u.mimeType?.startsWith('image') || /\.(jpe?g|png|webp|gif|svg)$/i.test(u.filename || '');

  const getFileIcon = (u) => {
    if (u.mimeType?.includes('pdf') || u.filename?.endsWith('.pdf')) return 'fa-file-pdf';
    if (u.mimeType?.includes('json') || u.filename?.endsWith('.json')) return 'fa-file-code';
    if (u.mimeType?.includes('video') || /\.(mp4|webm|mov)$/i.test(u.filename || '')) return 'fa-file-video';
    if (u.mimeType?.includes('zip') || u.filename?.endsWith('.zip')) return 'fa-file-zipper';
    return 'fa-file';
  };

  const getFileColor = (u) => {
    if (u.mimeType?.includes('pdf')) return '#ef4444';
    if (u.mimeType?.includes('json')) return '#f59e0b';
    if (u.mimeType?.includes('video')) return '#8b5cf6';
    return '#6b7280';
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <>
      <Head><title>Media Library — Nova Impact</title></Head>
      <AdminLayout title="Media Library">
        <div className="stripe-page">
          <div className="stripe-page-header">
            <div>
              <h1 className="stripe-page-title">Media Library</h1>
              <p className="stripe-page-subtitle">{uploads.length} files · {formatSize(totalSize)} total storage</p>
            </div>
            <label className="btn btn-primary" style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {uploading ? 'Uploading...' : 'Upload Files'}
              <input type="file" accept="image/*,application/pdf" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-bg': 'var(--slate-bg)', '--stat-color': 'var(--slate)' }}>
              <div className="stat-card-header"><div className="stat-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div></div>
              <div className="stat-card-value">{imageCount}</div><p className="stat-card-label">Images</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--purple-bg)', '--stat-color': 'var(--purple)' }}>
              <div className="stat-card-header"><div className="stat-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div></div>
              <div className="stat-card-value">{otherCount}</div><p className="stat-card-label">Other Files</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--info-bg)', '--stat-color': 'var(--info-text)' }}>
              <div className="stat-card-header"><div className="stat-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div></div>
              <div className="stat-card-value">{formatSize(totalSize)}</div><p className="stat-card-label">Storage Used</p>
            </div>
          </div>

          {/* Bulk Actions */}
          {selected.length > 0 && (
            <div className="action-bar">
              <span className="table-cell-text">{selected.length} file{selected.length > 1 ? 's' : ''} selected</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" onClick={copyUrls}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy URLs</button>
                <button className="btn btn-danger btn-sm" onClick={bulkDelete}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Delete</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelected([])}>Clear</button>
              </div>
            </div>
          )}

          {/* Media Card */}
          <div className="stripe-card">
            <div className="stripe-card-header">
              <h3 className="stripe-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                All Files
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="search-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input className="form-input" style={{ width: '180px', padding: '7px 14px 7px 34px', fontSize: '13px' }} placeholder="Search files..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
                </div>
                <div className="filter-tabs">
                  <button className={`filter-tab ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => { setTypeFilter('all'); setCurrentPage(1); }}>All</button>
                  <button className={`filter-tab ${typeFilter === 'image' ? 'active' : ''}`} onClick={() => { setTypeFilter('image'); setCurrentPage(1); }}>Images</button>
                  <button className={`filter-tab ${typeFilter === 'pdf' ? 'active' : ''}`} onClick={() => { setTypeFilter('pdf'); setCurrentPage(1); }}>PDF</button>
                  <button className={`filter-tab ${typeFilter === 'other' ? 'active' : ''}`} onClick={() => { setTypeFilter('other'); setCurrentPage(1); }}>Other</button>
                </div>
              </div>
            </div>

            {paginated.length > 0 ? (
              <>
                {/* Select All */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="checkbox">
                    <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={(e) => { if (e.target.checked) setSelected(paginated.map(u => u.id)); else setSelected([]); }} />
                  </label>
                  <span className="table-cell-text" style={{ fontSize: '13px' }}>Select all on this page</span>
                </div>

                {/* Grid */}
                <div className="media-grid">
                  {paginated.map(u => (
                    <div key={u.id} className={`media-item ${selected.includes(u.id) ? 'selected' : ''}`}>
                      <div className="media-checkbox" onClick={(e) => { e.stopPropagation(); setSelected(prev => prev.includes(u.id) ? prev.filter(s => s !== u.id) : [...prev, u.id]); }}>
                        <input type="checkbox" checked={selected.includes(u.id)} readOnly />
                      </div>
                      <div className="media-preview" onClick={() => isImage(u) && setPreview(u)}>
                        {isImage(u) ? (
                          <>
                            <img src={u.path} alt={u.filename} />
                            <div className="media-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg></div>
                          </>
                        ) : (
                          <div className="media-file-icon">
                            <i className={`fa-solid ${getFileIcon(u)}`} style={{ color: getFileColor(u), fontSize: '32px' }}></i>
                            <span className="media-file-label">{u.filename?.split('.').pop()?.toUpperCase() || 'FILE'}</span>
                          </div>
                        )}
                      </div>
                      <div className="media-info">
                        <span className="media-name" title={u.filename}>{u.filename}</span>
                        <div className="media-meta">
                          <span>{formatSize(u.size)}</span>
                          <button className="media-delete-btn" onClick={() => handleDelete(u.id)} title="Delete">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <span className="pagination-info">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
                    <div className="pagination-controls">
                      <button className="pagination-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
                        return <button key={page} className={`pagination-btn ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>;
                      })}
                      <button className="pagination-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-tertiary)', opacity: 0.4, marginBottom: 16 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <h4 className="empty-state-title">No files uploaded yet</h4>
                <p className="empty-state-desc">Upload images, PDFs, and other media files</p>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  Upload Files
                  <input type="file" accept="image/*,application/pdf" multiple onChange={handleUpload} style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {preview && (
          <div className="modal-overlay" onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 40 }}>
            <img src={preview.path} alt={preview.filename} style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }} onClick={e => e.stopPropagation()} />
            <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>&times;</button>
          </div>
        )}

        <style jsx global>{`
          .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; padding: 20px; }
          .media-item { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.15s; position: relative; }
          .media-item:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
          .media-item.selected { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-subtle); }
          .media-checkbox { position: absolute; top: 8px; left: 8px; z-index: 10; width: 20px; height: 20px; background: rgba(255,255,255,0.9); border-radius: 4px; display: flex; align-items: center; justify-content: center; }
          .media-checkbox input { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }
          .media-preview { height: 140px; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; }
          .media-preview img { width: 100%; height: 100%; object-fit: cover; }
          .media-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.15s; color: white; }
          .media-preview:hover .media-overlay { opacity: 1; }
          .media-file-icon { display: flex; flex-direction: column; align-items: center; gap: 8px; }
          .media-file-label { font-size: 11px; font-weight: 700; color: var(--text-tertiary); letter-spacing: 0.05em; }
          .media-info { padding: 12px; }
          .media-name { display: block; font-size: 12px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px; }
          .media-meta { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--text-tertiary); }
          .media-delete-btn { background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 4px; border-radius: 4px; transition: all 0.1s; display: flex; }
          .media-delete-btn:hover { background: var(--danger-bg); color: var(--danger); }
          @media (max-width: 768px) { .media-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); } }
        `}</style>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
