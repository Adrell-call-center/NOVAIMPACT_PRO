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

  const filtered = uploads.filter(u => {
    if (typeFilter === 'image' && !u.mimeType?.startsWith('image')) return false;
    if (typeFilter === 'pdf' && u.mimeType !== 'application/pdf') return false;
    if (typeFilter === 'other' && (u.mimeType?.startsWith('image') || u.mimeType === 'application/pdf')) return false;
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

          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-slate-bg)', '--stat-color': 'var(--stripe-slate)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div></div>
              <div className="stat-value">{imageCount}</div><p className="stat-label">Images</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-purple-bg)', '--stat-color': 'var(--stripe-purple)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div></div>
              <div className="stat-value">{otherCount}</div><p className="stat-label">Other Files</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-info-bg)', '--stat-color': 'var(--stripe-info-text)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div></div>
              <div className="stat-value">{formatSize(totalSize)}</div><p className="stat-label">Storage Used</p>
            </div>
          </div>

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

          <div className="stripe-card">
            <div className="stripe-card-header">
              <h3 className="stripe-card-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>All Files</h3>
              <div className="header-actions">
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
                <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--stripe-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="checkbox"><input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={(e) => { if (e.target.checked) setSelected(paginated.map(u => u.id)); else setSelected([]); }} /></label>
                  <span className="table-cell-text" style={{ fontSize: '13px' }}>Select all on this page</span>
                </div>
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
                          <div className="media-file-icon"><i className={`fa-solid ${getFileIcon(u)}`} style={{ color: getFileColor(u), fontSize: '32px' }}></i><span className="media-file-label">{u.filename?.split('.').pop()?.toUpperCase() || 'FILE'}</span></div>
                        )}
                      </div>
                      <div className="media-info">
                        <span className="media-name" title={u.filename}>{u.filename}</span>
                        <div className="media-meta">
                          <span>{formatSize(u.size)}</span>
                          <button className="media-delete-btn" onClick={() => handleDelete(u.id)} title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} total={filtered.length} perPage={ITEMS_PER_PAGE} />}
              </>
            ) : (
              <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>} title="No files uploaded yet" description="Upload images, PDFs, and other media files" action={{ label: 'Upload Files', isUpload: true }} />
            )}
          </div>
        </div>

        {preview && (
          <div className="preview-modal" onClick={() => setPreview(null)}>
            <img src={preview.path} alt={preview.filename} onClick={e => e.stopPropagation()} />
            <button onClick={() => setPreview(null)}>&times;</button>
          </div>
        )}

        <style jsx global>{`
          .stripe-page { max-width: 1280px; }
          .stripe-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
          .stripe-page-title { margin: 0 0 6px; font-size: 24px; font-weight: 700; color: var(--stripe-text-primary); letter-spacing: -0.02em; }
          .stripe-page-subtitle { margin: 0; font-size: 15px; color: var(--stripe-text-secondary); }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
          .stat-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); padding: 20px; transition: all 0.15s; }
          .stat-card:hover { box-shadow: var(--stripe-shadow-md); transform: translateY(-1px); }
          .stat-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
          .stat-icon { width: 36px; height: 36px; border-radius: var(--stripe-radius); display: flex; align-items: center; justify-content: center; background: var(--stat-bg); color: var(--stat-color); }
          .stat-value { font-size: 28px; font-weight: 700; color: var(--stripe-text-primary); line-height: 1; margin-bottom: 6px; letter-spacing: -0.02em; }
          .stat-label { font-size: 13px; color: var(--stripe-text-secondary); font-weight: 500; margin: 0 0 4px; }
          .action-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); padding: 14px 20px; }
          .stripe-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); overflow: hidden; }
          .stripe-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--stripe-border); flex-wrap: wrap; gap: 12px; }
          .stripe-card-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); display: flex; align-items: center; gap: 8px; }
          .stripe-card-title svg { width: 16px; height: 16px; color: var(--stripe-text-tertiary); }
          .header-actions { display: flex; align-items: center; gap: 12px; }
          .search-box { position: relative; }
          .search-box svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--stripe-text-tertiary); pointer-events: none; }
          .filter-tabs { display: flex; gap: 4px; background: var(--stripe-bg); border-radius: var(--stripe-radius); padding: 4px; }
          .filter-tab { padding: 6px 14px; border: none; background: transparent; color: var(--stripe-text-secondary); border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.1s; }
          .filter-tab:hover { color: var(--stripe-text-primary); }
          .filter-tab.active { background: #fff; color: var(--stripe-text-primary); box-shadow: var(--stripe-shadow-sm); }
          .checkbox { display: flex; align-items: center; }
          .checkbox input { width: 16px; height: 16px; accent-color: var(--stripe-primary); cursor: pointer; }
          .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; padding: 20px; }
          .media-item { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); overflow: hidden; transition: all 0.15s; position: relative; }
          .media-item:hover { box-shadow: var(--stripe-shadow-md); transform: translateY(-2px); }
          .media-item.selected { border-color: var(--stripe-primary); box-shadow: 0 0 0 2px var(--stripe-primary-subtle); }
          .media-checkbox { position: absolute; top: 8px; left: 8px; z-index: 10; width: 20px; height: 20px; background: rgba(255,255,255,0.9); border-radius: 4px; display: flex; align-items: center; justify-content: center; }
          .media-checkbox input { width: 16px; height: 16px; cursor: pointer; }
          .media-preview { height: 140px; background: var(--stripe-bg); display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; overflow: hidden; }
          .media-preview img { width: 100%; height: 100%; object-fit: cover; }
          .media-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.15s; color: #fff; }
          .media-preview:hover .media-overlay { opacity: 1; }
          .media-file-icon { display: flex; flex-direction: column; align-items: center; gap: 8px; }
          .media-file-label { font-size: 11px; font-weight: 700; color: var(--stripe-text-tertiary); letter-spacing: 0.05em; }
          .media-info { padding: 12px; }
          .media-name { display: block; font-size: 12px; font-weight: 500; color: var(--stripe-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 6px; }
          .media-meta { display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--stripe-text-tertiary); }
          .media-delete-btn { background: none; border: none; color: var(--stripe-text-tertiary); cursor: pointer; padding: 4px; border-radius: 4px; transition: all 0.1s; display: flex; }
          .media-delete-btn:hover { background: var(--stripe-danger-bg); color: var(--stripe-danger); }
          .preview-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 40px; }
          .preview-modal img { max-width: 100%; max-height: 90vh; border-radius: 8px; object-fit: contain; }
          .preview-modal button { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: white; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center; }
          .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: var(--stripe-radius); font-size: 14px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.1s; }
          .btn-primary { background: var(--stripe-primary); color: white; box-shadow: 0 1px 2px rgba(99, 91, 255, 0.2); }
          .btn-primary:hover { background: var(--stripe-primary-hover); }
          .btn-secondary { background: #fff; color: var(--stripe-text-primary); border: 1px solid var(--stripe-border); }
          .btn-secondary:hover { background: var(--stripe-bg); }
          .btn-danger { background: var(--stripe-danger); color: white; }
          .btn-sm { padding: 6px 12px; font-size: 13px; font-weight: 500; }
          .btn-ghost { background: transparent; color: var(--stripe-text-tertiary); border: none; padding: 8px 14px; }
          .btn-ghost:hover { background: var(--stripe-bg); color: var(--stripe-text-primary); }
          .empty-state { text-align: center; padding: 48px 24px; }
          .empty-state svg { color: var(--stripe-text-tertiary); margin-bottom: 16px; opacity: 0.4; }
          .empty-state-title { margin: 0 0 6px; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); }
          .empty-state-desc { margin: 0 0 20px; font-size: 13px; color: var(--stripe-text-tertiary); }
          .pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-top: 1px solid var(--stripe-border); }
          .pagination-info { font-size: 13px; color: var(--stripe-text-tertiary); }
          .pagination-controls { display: flex; gap: 4px; }
          .pagination-btn { width: 32px; height: 32px; border: 1px solid var(--stripe-border); background: #fff; color: var(--stripe-text-secondary); border-radius: var(--stripe-radius); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; transition: all 0.1s; }
          .pagination-btn:hover:not(:disabled) { background: var(--stripe-bg); }
          .pagination-btn.active { background: var(--stripe-primary); color: white; border-color: var(--stripe-primary); }
          .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
          .table-cell-text { font-size: 13px; color: var(--stripe-text-secondary); }
          @media (max-width: 768px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .stripe-page-header { flex-direction: column; gap: 16px; }
            .header-actions { flex-direction: column; align-items: stretch; }
            .media-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
          }
          @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
        `}</style>
      </AdminLayout>
    </>
  );
}

function Pagination({ currentPage, totalPages, onPageChange, total, perPage }) {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);
  return (
    <div className="pagination">
      <span className="pagination-info">Showing {start}–{end} of {total}</span>
      <div className="pagination-controls">
        <button className="pagination-btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
          return <button key={page} className={`pagination-btn ${currentPage === page ? 'active' : ''}`} onClick={() => onPageChange(page)}>{page}</button>;
        })}
        <button className="pagination-btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon}
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {action && (
        action.isUpload ? (
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            {action.label}
            <input type="file" accept="image/*,application/pdf" multiple onChange={() => {}} style={{ display: 'none' }} />
          </label>
        ) : (
          <a href={action.href} className="btn btn-primary">{action.label}</a>
        )
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
