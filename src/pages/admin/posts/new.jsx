import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminPostNew() {
  const router = useRouter();
  const [tab, setTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [existingCategories, setExistingCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [form, setForm] = useState({
    titleFr: '', slug: '', excerptFr: '', contentFr: '',
    category: '', tags: '', coverImage: '', status: 'DRAFT', publishedAt: '',
    metaTitleFr: '', metaDescFr: '', focusKeywordFr: '', canonicalUrl: '', noIndex: false, ogImageUrl: '',
  });

  useEffect(() => {
    fetchUploads();
    fetchCategories();
  }, []);

  const fetchUploads = async () => {
    const res = await fetch('/api/admin/uploads');
    const data = await res.json();
    setUploads(data.uploads || []);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    const cats = [...new Set((data.posts || []).flatMap(p => (p.category || '').split(',').map(c => c.trim())).filter(Boolean))];
    setExistingCategories(cats);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'titleFr' && !form.slug) {
      setForm(prev => ({ ...prev, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
    }
  };

  const handleSubmit = async (status) => {
    setSaving(true);
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, status: status || form.status }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.id) router.push('/admin/posts');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    await fetch('/api/admin/uploads', { method: 'POST', body: fd });
    setUploading(false);
    fetchUploads();
  };

  return (
    <>
      <Head><title>New Post — Nova Impact</title></Head>
      <AdminLayout title="New Post">
        <div className="stripe-page">
          {/* Header */}
          <div className="stripe-page-header">
            <div>
              <h1 className="stripe-page-title">New Post</h1>
              <p className="stripe-page-subtitle">Create a new blog post or article</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/admin/posts" className="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                Back
              </Link>
              <button className="btn btn-secondary" onClick={() => handleSubmit('DRAFT')} disabled={saving}>
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button className="btn btn-primary" onClick={() => handleSubmit('PUBLISHED')} disabled={saving}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Publish
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="filter-tabs" style={{ marginBottom: 24, width: 'fit-content' }}>
            <button className={`filter-tab ${tab === 'content' ? 'active' : ''}`} onClick={() => setTab('content')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Content
            </button>
            <button className={`filter-tab ${tab === 'media' ? 'active' : ''}`} onClick={() => setTab('media')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Media
            </button>
            <button className={`filter-tab ${tab === 'seo' ? 'active' : ''}`} onClick={() => setTab('seo')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              SEO
            </button>
          </div>

          <div className="content-grid content-grid-full">
            {/* Content Tab */}
            {tab === 'content' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
                  <div className="stripe-card">
                    <div className="stripe-card-body">
                      <div className="form-group">
                        <label className="form-label">Title</label>
                        <input className="form-input" value={form.titleFr} onChange={e => handleChange('titleFr', e.target.value)} placeholder="Enter post title" style={{ fontSize: '16px', fontWeight: 600, padding: '12px 14px' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Slug</label>
                        <input className="form-input" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="post-url-slug" style={{ fontFamily: 'monospace', fontSize: '13px' }} />
                        <p className="form-hint">Auto-generated from title. Can be edited manually.</p>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Content</label>
                        <RichTextEditor value={form.contentFr} onChange={v => handleChange('contentFr', v)} />
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Status */}
                    <div className="stripe-card">
                      <div className="stripe-card-header"><h3 className="stripe-card-title">Status</h3></div>
                      <div className="stripe-card-body">
                        <div className="form-group" style={{ marginBottom: 12 }}>
                          <label className="form-label">Status</label>
                          <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                          </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Category</label>
                          <div style={{ position: 'relative' }}>
                            <input className="form-input" value={form.category} onChange={e => { handleChange('category', e.target.value); setShowCategoryDropdown(true); }} placeholder="Select or type" onFocus={() => setShowCategoryDropdown(true)} />
                            {showCategoryDropdown && existingCategories.length > 0 && (
                              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: 4, maxHeight: 160, overflowY: 'auto', zIndex: 100, boxShadow: 'var(--shadow-md)' }}>
                                {existingCategories.map(cat => (
                                  <div key={cat} style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid var(--border-light)' }} onClick={() => { handleChange('category', cat); setShowCategoryDropdown(false); }} className="hover-bg">{cat}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="stripe-card">
                      <div className="stripe-card-header"><h3 className="stripe-card-title">Cover Image</h3></div>
                      <div className="stripe-card-body">
                        {form.coverImage ? (
                          <>
                            <img src={form.coverImage} alt="Cover" style={{ width: '100%', borderRadius: 'var(--radius)', marginBottom: 12 }} />
                            <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => handleChange('coverImage', '')}>Remove</button>
                          </>
                        ) : (
                          <>
                            <label className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', cursor: uploading ? 'not-allowed' : 'pointer' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                              {uploading ? 'Uploading...' : 'Upload Image'}
                              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                            {uploads.length > 0 && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 12 }}>
                                {uploads.slice(0, 9).map(u => (
                                  <img key={u.id} src={u.path} alt="" onClick={() => handleChange('coverImage', u.path)} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: '2px solid transparent' }} />
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Media Tab */}
            {tab === 'media' && (
              <div className="stripe-card">
                <div className="stripe-card-header">
                  <h3 className="stripe-card-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Cover Image
                  </h3>
                  <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <div className="stripe-card-body">
                  {form.coverImage && (
                    <div style={{ marginBottom: 20 }}>
                      <p className="form-label" style={{ marginBottom: 8 }}>Current Cover</p>
                      <img src={form.coverImage} alt="Cover" style={{ maxWidth: 400, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }} />
                    </div>
                  )}
                  <p className="form-label">Choose from library</p>
                  <div className="media-grid" style={{ padding: 0 }}>
                    {uploads.filter(u => u.mimeType?.startsWith('image')).slice(0, 12).map(u => (
                      <div key={u.id} className="media-library-item" onClick={() => handleChange('coverImage', u.path)} style={{ cursor: 'pointer', border: form.coverImage === u.path ? '2px solid var(--primary)' : '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                        <img src={u.path} alt={u.filename} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                  {uploads.filter(u => u.mimeType?.startsWith('image')).length === 0 && (
                    <div className="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-tertiary)', opacity: 0.4, marginBottom: 16 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <h4 className="empty-state-title">No images uploaded yet</h4>
                      <p className="empty-state-desc">Upload images to use as cover</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {tab === 'seo' && (
              <div className="stripe-card" style={{ maxWidth: 700 }}>
                <div className="stripe-card-header">
                  <h3 className="stripe-card-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    Search Engine Optimization
                  </h3>
                </div>
                <div className="stripe-card-body">
                  <div className="form-group">
                    <label className="form-label">Meta Title</label>
                    <input className="form-input" value={form.metaTitleFr} onChange={e => handleChange('metaTitleFr', e.target.value)} placeholder={form.titleFr || 'Auto-generated from title'} maxLength={60} />
                    <p className="form-hint">{form.metaTitleFr.length || form.titleFr.length}/60 characters</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Meta Description</label>
                    <textarea className="form-textarea" rows={3} value={form.metaDescFr} onChange={e => handleChange('metaDescFr', e.target.value)} placeholder="Brief description for search engines" maxLength={160} />
                    <p className="form-hint">{form.metaDescFr.length}/160 characters</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Focus Keyword</label>
                    <input className="form-input" value={form.focusKeywordFr} onChange={e => handleChange('focusKeywordFr', e.target.value)} placeholder="Primary keyword" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Canonical URL</label>
                    <input className="form-input" value={form.canonicalUrl} onChange={e => handleChange('canonicalUrl', e.target.value)} placeholder="https://..." style={{ fontFamily: 'monospace', fontSize: '13px' }} />
                  </div>
                  <div className="form-group">
                    <label className="checkbox">
                      <input type="checkbox" checked={form.noIndex} onChange={e => handleChange('noIndex', e.target.checked)} />
                      <span className="checkbox-label">No index (hide from search engines)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx global>{`
          .hover-bg:hover { background: var(--bg-primary); }
          .media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
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
