import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AdminPostNew() {
  const router = useRouter();
  const [tab, setTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [existingCategories, setExistingCategories] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [publishStatus, setPublishStatus] = useState('draft');

  const [form, setForm] = useState({
    titleFr: '', slug: '', excerptFr: '', contentFr: '',
    category: '', tags: '', coverImage: '', status: 'DRAFT', publishedAt: '',
    metaTitleFr: '', metaDescFr: '',
    focusKeywordFr: '', canonicalUrl: '', noIndex: false,
    ogImageUrl: '', schemaOverridesRaw: '',
  });

  useEffect(() => {
    fetchUploads();
    fetchExistingData();
  }, []);

  const fetchUploads = async () => {
    const res = await fetch('/api/admin/uploads');
    const data = await res.json();
    setUploads(data.uploads || []);
  };

  const fetchExistingData = async () => {
    try {
      const res = await fetch('/api/admin/posts');
      const data = await res.json();
      const posts = data.posts || [];
      const categories = [...new Set(posts.flatMap(p => (p.category || '').split(',').map(c => c.trim())).filter(Boolean))];
      setExistingCategories(categories);
      const tags = [...new Set(posts.flatMap(p => (p.tags || '').split(',').map(t => t.trim())).filter(Boolean))];
      setExistingTags(tags);
    } catch (error) { console.error('Failed to fetch existing data:', error); }
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
    if (data.error) alert(data.error);
    else router.push('/admin/posts');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const uploadRes = await fetch('/api/admin/uploads', { method: 'POST', body: fd });
    const uploadData = await uploadRes.json();
    if (uploadData.path) handleChange('coverImage', uploadData.path);
    setUploading(false);
    fetchUploads();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'fa-solid fa-gear' },
    { id: 'content', label: 'Content', icon: 'fa-solid fa-file-lines' },
    { id: 'media', label: 'Media', icon: 'fa-solid fa-image' },
    { id: 'seo', label: 'SEO & Meta', icon: 'fa-solid fa-magnifying-glass' },
    { id: 'preview', label: 'Preview', icon: 'fa-solid fa-eye' },
  ];

  const filteredCategories = existingCategories.filter(c => !categorySearch || c.toLowerCase().includes(categorySearch.toLowerCase()));
  const filteredTags = existingTags.filter(t => !tagSearch || t.toLowerCase().includes(tagSearch.toLowerCase()));

  return (
    <>
      <Head><title>New Post — Nova Impact</title></Head>
      <AdminLayout title="New Post">
        <div className="admin-create-page">
          {/* Top Actions */}
          <div className="admin-create-header">
            <Link href="/admin/posts" className="btn-back">
              <i className="fa-solid fa-arrow-left"></i> Back to Posts
            </Link>
            <div className="admin-create-actions">
              <button className="btn-outline" onClick={() => setShowPreview(!showPreview)}>
                <i className="fa-solid fa-eye"></i> Preview
              </button>
              <button className="btn-outline" onClick={() => handleSubmit('DRAFT')} disabled={saving}>
                <i className="fa-solid fa-save"></i> {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button className="btn-primary" onClick={() => handleSubmit('PUBLISHED')} disabled={saving}>
                <i className="fa-solid fa-check"></i> {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="admin-create-layout">
            {/* Main Content */}
            <div className="admin-create-main">
              {/* General Tab */}
              {tab === 'general' && (
                <div className="stripe-card">
                  <div className="stripe-card-body">
                    <div className="form-group">
                      <label className="form-label">Title (French)</label>
                      <input className="form-input" value={form.titleFr} onChange={e => handleChange('titleFr', e.target.value)} placeholder="Enter post title" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Slug</label>
                      <input className="form-input form-input-mono" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="auto-generated-slug" />
                      <p className="form-hint">Auto-generated from title. Edit if needed.</p>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Excerpt (French)</label>
                      <textarea className="form-textarea" rows={3} value={form.excerptFr} onChange={e => handleChange('excerptFr', e.target.value)} placeholder="Brief summary of the post" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input className="form-input" value={form.category} onChange={e => handleChange('category', e.target.value)} placeholder="e.g. Technology, Marketing" list="categories-list" />
                      <datalist id="categories-list">
                        {existingCategories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tags</label>
                      <input className="form-input" value={form.tags} onChange={e => handleChange('tags', e.target.value)} placeholder="Comma-separated tags" />
                    </div>
                  </div>
                </div>
              )}

              {/* Content Tab */}
              {tab === 'content' && (
                <div className="stripe-card">
                  <div className="stripe-card-body">
                    <RichTextEditor value={form.contentFr} onChange={v => handleChange('contentFr', v)} />
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {tab === 'media' && (
                <div className="stripe-card">
                  <div className="stripe-card-header">
                    <h3 className="stripe-card-title">Cover Image</h3>
                    <label className="btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                      <i className="fa-solid fa-upload"></i> Upload
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                  <div className="stripe-card-body">
                    {form.coverImage ? (
                      <div className="cover-image-preview">
                        <img src={form.coverImage} alt="Cover" />
                        <button className="btn-remove-cover" onClick={() => handleChange('coverImage', '')}>
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="cover-upload-placeholder">
                        <i className="fa-solid fa-image"></i>
                        <p>No cover image yet</p>
                        <label className="btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                          Upload Image
                          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>
                      </div>
                    )}
                    {uploads.length > 0 && (
                      <div style={{ marginTop: 24 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>Recent Uploads</h4>
                        <div className="media-grid-compact">
                          {uploads.filter(u => u.mimeType?.startsWith('image')).slice(0, 12).map(u => (
                            <div key={u.id} className="media-thumb" onClick={() => handleChange('coverImage', u.path)}>
                              <img src={u.path} alt="" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {tab === 'seo' && (
                <div className="stripe-card">
                  <div className="stripe-card-body">
                    <div className="form-group">
                      <label className="form-label">Meta Title</label>
                      <input className="form-input" value={form.metaTitleFr} onChange={e => handleChange('metaTitleFr', e.target.value)} placeholder={form.titleFr || 'Meta title'} maxLength={60} />
                      <p className="form-hint">{(form.metaTitleFr || form.titleFr).length}/60 characters</p>
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
                      <input className="form-input form-input-mono" value={form.canonicalUrl} onChange={e => handleChange('canonicalUrl', e.target.value)} placeholder="https://..." />
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

              {/* Preview Tab */}
              {tab === 'preview' && (
                <div className="stripe-card">
                  <div className="stripe-card-body">
                    {form.titleFr ? (
                      <div className="post-preview">
                        {form.coverImage && <img src={form.coverImage} alt="Cover" className="preview-cover" />}
                        <h1>{form.titleFr}</h1>
                        {form.excerptFr && <p className="preview-excerpt">{form.excerptFr}</p>}
                        <div className="preview-content" dangerouslySetInnerHTML={{ __html: form.contentFr || '<p style="color:#999">No content yet...</p>' }} />
                      </div>
                    ) : (
                      <div className="empty-preview">
                        <i className="fa-solid fa-file-lines"></i>
                        <p>Start writing to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="admin-create-sidebar">
              {/* Tabs Navigation */}
              <div className="sidebar-tabs">
                {tabs.map(t => (
                  <button key={t.id} className={`sidebar-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                    <i className={t.icon}></i>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Status Card */}
              <div className="stripe-card sidebar-card">
                <div className="stripe-card-header"><h3 className="stripe-card-title">Status</h3></div>
                <div className="stripe-card-body">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <select className="form-select" value={form.status} onChange={e => handleChange('status', e.target.value)}>
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Publish Card */}
              <div className="stripe-card sidebar-card">
                <div className="stripe-card-header"><h3 className="stripe-card-title">Publish</h3></div>
                <div className="stripe-card-body">
                  <div className="publish-actions">
                    <button className="btn-outline btn-sm btn-block" onClick={() => handleSubmit('DRAFT')} disabled={saving}>
                      <i className="fa-solid fa-save"></i> Save Draft
                    </button>
                    <button className="btn-primary btn-sm btn-block" onClick={() => handleSubmit('PUBLISHED')} disabled={saving}>
                      <i className="fa-solid fa-check"></i> Publish
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <style jsx global>{`
          .admin-create-page { max-width: 1400px; }
          .admin-create-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
          .btn-back { color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 6px; transition: color 0.1s; }
          .btn-back:hover { color: var(--primary); }
          .admin-create-actions { display: flex; gap: 8px; }
          .admin-create-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
          .admin-create-main { min-width: 0; }
          .admin-create-sidebar { position: sticky; top: 80px; height: fit-content; max-height: calc(100vh - 100px); overflow-y: auto; }
          
          /* Sidebar Tabs */
          .sidebar-tabs { display: flex; flex-direction: column; gap: 4px; background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 8px; margin-bottom: 20px; }
          .sidebar-tab { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: none; background: transparent; color: var(--text-secondary); border-radius: var(--radius); cursor: pointer; font-size: 13px; font-weight: 500; text-align: left; transition: all 0.1s; }
          .sidebar-tab:hover { background: var(--bg-primary); color: var(--text-primary); }
          .sidebar-tab.active { background: var(--primary); color: white; }
          .sidebar-tab i { width: 18px; text-align: center; font-size: 14px; }
          
          /* Sidebar Cards */
          .sidebar-card { margin-bottom: 16px; }
          .sidebar-card .stripe-card-header { padding: 14px 16px; }
          .sidebar-card .stripe-card-body { padding: 14px 16px; }
          
          /* Cover Image */
          .cover-image-preview { position: relative; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
          .cover-image-preview img { width: 100%; display: block; }
          .btn-remove-cover { position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; background: rgba(0,0,0,0.6); border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.1s; }
          .btn-remove-cover:hover { background: var(--danger); }
          .cover-upload-placeholder { text-align: center; padding: 40px 20px; background: var(--bg-primary); border: 2px dashed var(--border); border-radius: var(--radius); }
          .cover-upload-placeholder i { font-size: 32px; color: var(--text-tertiary); margin-bottom: 12px; }
          .cover-upload-placeholder p { color: var(--text-tertiary); font-size: 14px; margin: 0 0 16px; }
          
          /* Media Grid */
          .media-grid-compact { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .media-thumb { aspect-ratio: 1; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.1s; }
          .media-thumb:hover { border-color: var(--primary); transform: scale(1.02); }
          .media-thumb img { width: 100%; height: 100%; object-fit: cover; }
          
          /* Preview */
          .post-preview { max-width: 800px; margin: 0 auto; }
          .post-preview .preview-cover { width: 100%; border-radius: var(--radius-lg); margin-bottom: 24px; }
          .post-preview h1 { font-size: 28px; font-weight: 700; margin: 0 0 12px; }
          .post-preview .preview-excerpt { color: var(--text-secondary); font-size: 16px; margin: 0 0 24px; line-height: 1.6; }
          .preview-content { line-height: 1.8; color: var(--text-primary); }
          .preview-content img { max-width: 100%; border-radius: 8px; }
          .empty-preview { text-align: center; padding: 60px 20px; color: var(--text-tertiary); }
          .empty-preview i { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
          
          /* Publish Actions */
          .publish-actions { display: flex; flex-direction: column; gap: 8px; }
          .btn-block { width: 100%; justify-content: center; }
          
          /* Form */
          .form-input-mono { font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; font-size: 13px; }
          
          @media (max-width: 1023px) {
            .admin-create-layout { grid-template-columns: 1fr; }
            .admin-create-sidebar { position: static; max-height: none; }
          }
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
