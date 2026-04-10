import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { generateSlug } from '@/lib/slugify';
import { buildSchema } from '@/lib/schema-builder';

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
      
      // Extract unique categories
      const categories = [...new Set(posts.flatMap(p => (p.category || '').split(',').map(c => c.trim())).filter(Boolean))];
      setExistingCategories(categories);
      
      // Extract unique tags
      const allTags = posts.flatMap(p => p.tags || []);
      const tags = [...new Set(allTags)];
      setExistingTags(tags);
    } catch (error) {
      console.error('Failed to fetch existing data:', error);
    }
  };

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleFileUpload = async (file) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd });
      const data = await res.json();
      fetchUploads();
      return data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImagePick = (path) => {
    update('coverImage', path);
    if (!form.ogImageUrl) update('ogImageUrl', path);
  };

  const handleSubmit = async (status = 'DRAFT') => {
    setSaving(true);
    const body = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: status,
      publishedAt: status === 'PUBLISHED' && form.publishedAt ? new Date(form.publishedAt).toISOString() : (status === 'PUBLISHED' ? new Date().toISOString() : null),
      schemaOverrides: form.schemaOverridesRaw ? JSON.parse(form.schemaOverridesRaw) : null,
    };
    const res = await fetch('/api/admin/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/posts');
    else alert('Error saving post');
  };

  const SchemaPreview = () => {
    if (!form.schemaOverridesRaw.trim()) return <p className="schema-empty">No JSON-LD entered yet.</p>;
    try {
      const parsed = JSON.parse(form.schemaOverridesRaw);
      return <pre className="schema-preview">{JSON.stringify(parsed, null, 2)}</pre>;
    } catch { return <p className="text-danger">⚠ Invalid JSON</p>; }
  };

  return (
    <>
      <Head><title>New Post — Nova Impact Admin</title></Head>
      <AdminLayout title="New Post">
        <div className="admin-editor-header">
          <div className="admin-editor-left">
            <button className="btn-outline" onClick={() => handleSubmit('DRAFT')} disabled={saving}>
              <i className="fa-solid fa-file me-2"></i>Save Draft
            </button>
            <button className="btn-outline" onClick={() => setShowPreview(true)} disabled={saving}>
              <i className="fa-solid fa-eye me-2"></i>Preview
            </button>
          </div>
          <div className="admin-editor-right">
            <div className="admin-publish-controls">
              <label className="admin-schedule-toggle">
                <input type="checkbox" checked={scheduleMode} onChange={(e) => setScheduleMode(e.target.checked)} />
                <span className="admin-schedule-label">Schedule</span>
              </label>
              {scheduleMode && (
                <input type="datetime-local" className="admin-input admin-input-sm admin-schedule-date" value={form.publishedAt ? new Date(form.publishedAt).toISOString().slice(0, 16) : ''} onChange={(e) => update('publishedAt', e.target.value)} />
              )}
            </div>
            <button className="btn-primary" onClick={() => handleSubmit('PUBLISHED')} disabled={saving}>
              {saving ? <><span className="spinner me-2"></span>Saving...</> : (
                scheduleMode && form.publishedAt ? (
                  <><i className="fa-solid fa-calendar me-2"></i>Schedule</>
                ) : (
                  <><i className="fa-solid fa-rocket me-2"></i>Publish</>
                )
              )}
            </button>
          </div>
        </div>

        <div className="admin-editor-2col">

          {/* LEFT — editor */}
          <div className="admin-col-left editor-scroll">
            <div className="admin-light-card admin-editor-card">
              <div className="form-group mb-0">
                <label className="admin-label">Title *</label>
                <input className="admin-input admin-input-lg" value={form.titleFr} onChange={e => { update('titleFr', e.target.value); update('metaTitleFr', e.target.value); if (!form._slugEdited) update('slug', generateSlug(e.target.value)); }} placeholder="Enter post title" />
              </div>
              <div className="form-group mb-0 mt-3">
                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <i className="fa-solid fa-link" style={{ color: '#6c757d', fontSize: 12 }}></i>
                  Slug
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '6px 12px' }}>
                  <span style={{ color: '#94a3b8', fontSize: 13, whiteSpace: 'nowrap' }}>/blog/</span>
                  <input
                    className="admin-input"
                    style={{ border: 'none', background: 'transparent', padding: 0, margin: 0, flex: 1, fontSize: 13 }}
                    value={form.slug}
                    onChange={e => { update('slug', e.target.value); update('_slugEdited', true); }}
                    placeholder="auto-generated-from-title"
                  />
                </div>
              </div>
            </div>

            <div className="admin-quill-card mt-4">
              <RichTextEditor defaultValue={form.contentFr} onChange={(val) => update('contentFr', val)} onImageUpload={handleFileUpload} onPdfUpload={async (file) => { const url = await handleFileUpload(file); return { url, name: file.name }; }} placeholder="Write your post content..." minHeight={600} />
            </div>

            <div className="admin-light-card admin-editor-card mt-4">
              <div className="form-group mb-0">
                <label className="admin-label">Excerpt</label>
                <textarea className="admin-textarea" rows={4} value={form.excerptFr} onChange={e => update('excerptFr', e.target.value)} placeholder="Short description shown on blog cards and in SEO..." />
              </div>
            </div>
          </div>

          {/* RIGHT — meta sidebar */}
          <div className="admin-col-right">

            {/* Featured Image */}
            <div className="admin-light-card admin-sidebar-card">
              <h3 className="admin-sidebar-title"><i className="fa-solid fa-image me-2" style={{ color: '#1a1a1a' }}></i>Featured Image</h3>
              <div className="admin-featured-image">
                {form.coverImage ? (
                  <div className="admin-image-preview">
                    <img src={form.coverImage} alt="Featured" />
                    <button className="admin-image-remove" onClick={() => update('coverImage', '')}>
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div className="admin-image-placeholder">
                    <i className="fa-solid fa-image"></i>
                    <p>No image selected</p>
                  </div>
                )}
              </div>
              <div className="admin-upload-section">
                <label className="admin-upload-btn" title="Upload New Image">
                  <i className="fa-solid fa-upload me-2"></i>Upload New
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUploading(true);
                      const fd = new FormData();
                      fd.append('file', file);
                      const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data.url) { handleImagePick(data.url); fetchUploads(); }
                      setUploading(false);
                    }
                  }} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
              <div className="admin-library-section">
                <h4 className="admin-library-title">Choose from Library</h4>
                <div className="admin-library-grid">
                  {uploads.filter(u => u.path && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(u.path)).map(u => (
                    <div key={u.id} className={`admin-library-item ${form.coverImage === u.path ? 'selected' : ''}`} onClick={() => handleImagePick(u.path)}>
                      <img src={u.path} alt={u.filename} />
                      {form.coverImage === u.path && <div className="admin-library-check"><i className="fa-solid fa-check"></i></div>}
                    </div>
                  ))}
                  {uploads.filter(u => u.path && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(u.path)).length === 0 && <p className="admin-library-empty">No images uploaded yet</p>}
                </div>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="admin-light-card admin-sidebar-card mt-4">
              <div className="admin-sidebar-title-row">
                <h3 className="admin-sidebar-title" style={{ border: 'none', padding: 0, margin: 0 }}><i className="fa-solid fa-folder me-2" style={{ color: '#14B8A6' }}></i>Category &amp; Tags</h3>
                <button className="admin-manage-btn" onClick={() => setShowManageCategories(v => !v)}>
                  {showManageCategories ? 'Done' : 'Manage'}
                </button>
              </div>

              {showManageCategories ? (
                <div className="admin-manage-categories" style={{ marginTop: 12 }}>
                  <p className="admin-manage-hint">Click × to remove a category from suggestions</p>
                  <div className="admin-cat-manage-list">
                    {existingCategories.length === 0 && <p className="admin-library-empty">No categories yet</p>}
                    {existingCategories.map((cat, i) => (
                      <span key={i} className="admin-cat-manage-chip">
                        {cat}
                        <button onClick={() => setExistingCategories(prev => prev.filter((_, j) => j !== i))}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label className="admin-label">Categories</label>
                  <div className="admin-tags-container">
                    {(form.category || '').split(',').map((cat, i) => cat.trim() && (
                      <span key={i} className="admin-tag-chip admin-cat-chip">
                        {cat.trim()}
                        <button className="admin-tag-remove" onClick={() => {
                          const cats = form.category.split(',').map(c => c.trim()).filter(c => c);
                          cats.splice(i, 1);
                          update('category', cats.join(', '));
                        }}>×</button>
                      </span>
                    ))}
                    <div className="admin-tag-input-wrapper">
                      <input className="admin-input admin-input-sm admin-tag-input"
                        value={categorySearch}
                        onChange={e => setCategorySearch(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && categorySearch.trim()) {
                            e.preventDefault();
                            const cats = form.category.split(',').map(c => c.trim()).filter(c => c);
                            if (!cats.includes(categorySearch.trim())) {
                              update('category', [...cats, categorySearch.trim()].join(', '));
                              if (!existingCategories.includes(categorySearch.trim())) {
                                setExistingCategories(prev => [...prev, categorySearch.trim()]);
                              }
                            }
                            setCategorySearch('');
                          }
                        }}
                        placeholder="Type and press Enter..."
                      />
                      {categorySearch && existingCategories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).length > 0 && (
                        <div className="admin-tag-suggestions">
                          {existingCategories.filter(c => c.toLowerCase().includes(categorySearch.toLowerCase())).slice(0, 6).map((cat, i) => (
                            <button key={i} className="admin-tag-suggestion" onClick={() => {
                              const cats = form.category.split(',').map(c => c.trim()).filter(c => c);
                              if (!cats.includes(cat)) update('category', [...cats, cat].join(', '));
                              setCategorySearch('');
                            }}>{cat}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="form-group mb-0">
                <label className="admin-label">Tags</label>
                <div className="admin-tags-container">
                  {form.tags.split(',').map((tag, i) => tag.trim() && (
                    <span key={i} className="admin-tag-chip">
                      {tag.trim()}
                      <button className="admin-tag-remove" onClick={() => {
                        const currentTags = form.tags.split(',').map(t => t.trim()).filter(t => t);
                        currentTags.splice(i, 1);
                        update('tags', currentTags.join(', '));
                      }}>×</button>
                    </span>
                  ))}
                  <div className="admin-tag-input-wrapper">
                    <input className="admin-input admin-input-sm admin-tag-input"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagSearch.trim()) {
                          e.preventDefault();
                          const currentTags = form.tags.split(',').map(t => t.trim()).filter(t => t);
                          if (!currentTags.includes(tagSearch.trim())) {
                            update('tags', [...currentTags, tagSearch.trim()].join(', '));
                          }
                          setTagSearch('');
                        }
                      }}
                      placeholder="Type and press Enter..."
                    />
                    {tagSearch && existingTags.filter(t => t.toLowerCase().includes(tagSearch.toLowerCase())).length > 0 && (
                      <div className="admin-tag-suggestions">
                        {existingTags.filter(t => t.toLowerCase().includes(tagSearch.toLowerCase())).slice(0, 5).map((tag, i) => (
                          <button key={i} className="admin-tag-suggestion" onClick={() => {
                            const currentTags = form.tags.split(',').map(t => t.trim()).filter(t => t);
                            if (!currentTags.includes(tag)) update('tags', [...currentTags, tag].join(', '));
                            setTagSearch('');
                          }}>{tag}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO & Meta */}
            <div className="admin-light-card admin-sidebar-card mt-4">
              <h3 className="admin-sidebar-title"><i className="fa-solid fa-magnifying-glass me-2" style={{ color: '#1a1a1a' }}></i>SEO &amp; Meta</h3>
              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="admin-label">Meta Title <span className="char-count">{form.metaTitleFr?.length || 0}/60</span></label>
                <input className={`admin-input ${form.metaTitleFr?.length > 60 ? 'input-error' : ''}`} value={form.metaTitleFr} onChange={e => update('metaTitleFr', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="admin-label">Meta Description <span className="char-count">{form.metaDescFr?.length || 0}/160</span></label>
                <textarea className={`admin-textarea ${form.metaDescFr?.length > 160 ? 'input-error' : ''}`} rows={3} value={form.metaDescFr} onChange={e => update('metaDescFr', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="admin-label">Focus Keyword</label>
                <input className="admin-input" value={form.focusKeywordFr} onChange={e => update('focusKeywordFr', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="admin-label">Canonical URL</label>
                <input className="admin-input" value={form.canonicalUrl} onChange={e => update('canonicalUrl', e.target.value)} placeholder="https://example.com/canonical-url" />
              </div>
              <div className="form-group">
                <label className="admin-label">OG Image URL</label>
                <input className="admin-input" value={form.ogImageUrl} onChange={e => update('ogImageUrl', e.target.value)} placeholder="https://..." />
              </div>
              <div className="checkbox-group">
                <input className="admin-checkbox" type="checkbox" checked={form.noIndex} onChange={e => update('noIndex', e.target.checked)} id="noIndex" />
                <label className="admin-checkbox-label" htmlFor="noIndex">No Index (hide from search engines)</label>
              </div>
            </div>

            {/* Schema / JSON-LD */}
            <div className="admin-light-card admin-sidebar-card mt-4">
              <h3 className="admin-sidebar-title"><i className="fa-solid fa-code me-2" style={{ color: '#6366f1' }}></i>Schema / JSON-LD</h3>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="admin-label">JSON-LD
                  <span className="admin-schema-hint"> — paste your full structured data</span>
                </label>
                <textarea className="admin-textarea admin-textarea-code" rows={10} value={form.schemaOverridesRaw} onChange={e => update('schemaOverridesRaw', e.target.value)} placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your Post Title",\n  "author": { "@type": "Person", "name": "Author Name" },\n  "datePublished": "2024-01-01",\n  "description": "Post description"\n}`} />
              </div>
              <div className="schema-preview-wrapper">
                <h4 className="admin-schema-title">Preview</h4>
                <SchemaPreview />
              </div>
            </div>


          </div>
        </div>

        {/* Post Preview Modal */}
        {showPreview && (
          <div className="wp-modal-overlay" onClick={() => setShowPreview(false)}>
            <div className="wp-modal wp-modal-preview" onClick={(e) => e.stopPropagation()}>
              <div className="wp-modal-header">
                <h3><i className="fa-solid fa-eye me-2"></i>Post Preview</h3>
                <div className="wp-modal-header-actions">
                  <span className="wp-preview-badge">{form.status === 'PUBLISHED' ? (scheduleMode ? 'Scheduled' : 'Published') : 'Draft'}</span>
                  <button className="wp-modal-close" onClick={() => setShowPreview(false)}>×</button>
                </div>
              </div>
              <div className="wp-modal-body wp-preview-body">
                <div className="wp-preview-single-post">
                  {form.coverImage && (
                    <div className="wp-preview-featured-image">
                      <img src={form.coverImage} alt="Featured" />
                    </div>
                  )}
                  <div className="wp-preview-meta">
                    {form.category && <span className="wp-preview-category">{form.category}</span>}
                    <span className="wp-preview-date">
                      {scheduleMode && form.publishedAt ? `Scheduled: ${new Date(form.publishedAt).toLocaleDateString()}` : 
                       form.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h1 className="wp-preview-title">{form.titleFr}</h1>
                  <p className="wp-preview-excerpt">{form.excerptFr}</p>
                  <div className="wp-preview-tags">
                    {form.tags.split(',').map((tag, i) => tag.trim() && (
                      <span key={i} className="wp-preview-tag">{tag.trim()}</span>
                    ))}
                  </div>
                  <div className="wp-preview-content" dangerouslySetInnerHTML={{ __html: form.contentFr }} />
                </div>
              </div>
              <div className="wp-modal-footer">
                <button className="wp-btn wp-btn-secondary" onClick={() => setShowPreview(false)}>Close Preview</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>

      <style jsx global>{`
        .admin-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          margin-bottom: 24px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
        }

        .admin-editor-left {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .admin-editor-right {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        /* Publish Controls */
        .admin-publish-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e8e8e8;
        }

        .admin-schedule-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .admin-schedule-toggle input {
          accent-color: #1a1a1a;
          width: 16px;
          height: 16px;
        }

        .admin-schedule-label {
          font-size: 13px;
          font-weight: 500;
          color: #495057;
        }

        .admin-schedule-date {
          width: 180px;
        }

        .btn-outline {
          background: #ffffff;
          color: var(--stripe-text-secondary);
          border: 1px solid var(--stripe-border);
          padding: 9px 16px;
          border-radius: var(--stripe-radius);
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.1s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        .btn-outline:hover {
          background: var(--stripe-bg);
          color: var(--stripe-text-primary);
          border-color: #cbd5e1;
        }

        .btn-primary {
          background: var(--stripe-primary);
          color: #ffffff;
          border: none;
          padding: 9px 20px;
          border-radius: var(--stripe-radius);
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.1s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          box-shadow: 0 1px 2px rgba(99, 91, 255, 0.2);
        }

        .btn-primary:hover {
          background: var(--stripe-primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(99, 91, 255, 0.3);
        }

        .btn-primary:disabled, .btn-outline:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(26,29,33,0.3);
          border-top-color: #1a1d21;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Normal page scroll */
        body, html { overflow: auto; height: auto; }
        .admin-main { height: auto; overflow: visible; display: block; }
        .admin-content { overflow: visible; flex: none; display: block; padding: 24px 32px; }
        .admin-editor-header { flex-shrink: 0; }

        .admin-editor-2col {
          flex: 1;
          display: flex;
          gap: 24px;
        }

        @media (max-width: 1199px) {
          .admin-editor-2col { flex-direction: column; }
        }

        .admin-col-left {
          flex: 1;
          min-width: 0;
          padding-bottom: 40px;
        }

        .admin-col-right {
          width: 360px;
          min-width: 360px;
          max-width: 360px;
          height: fit-content;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1199px) {
          .admin-col-right {
            width: 100%;
            min-width: 100%;
            max-width: 100%;
          }
        }

        .admin-sidebar-card {
          padding: 20px;
          flex-shrink: 0;
        }

        .admin-light-card {
          background: #ffffff;
          border-radius: var(--stripe-radius-lg);
          border: 1px solid var(--stripe-border);
          overflow: hidden;
          transition: box-shadow 0.15s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        .admin-light-card:hover {
          box-shadow: var(--stripe-shadow-md);
        }

        .admin-editor-card {
          padding: 24px;
        }

        /* Language Tabs */
        .admin-editor-lang-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .admin-lang-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #f8f9fa;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          color: #6c757d;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-lang-tab:hover {
          background: #ffffff;
          color: #1a1d21;
          border-color: #d0d0d0;
        }

        .admin-lang-tab.active {
          background: #1a1a1a;
          color: #1a1d21;
          border-color: #1a1a1a;
        }

        .admin-lang-flag {
          font-size: 18px;
        }

        .admin-editor-lang-content {
          min-height: 400px;
        }

        .admin-section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0 0 8px 0;
        }

        .admin-section-desc {
          font-size: 13px;
          color: #6c757d;
          margin: 0 0 20px 0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group.mb-0 {
          margin-bottom: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 767px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .admin-label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 600;
          color: var(--stripe-text-secondary);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        .char-count {
          float: right;
          font-weight: normal;
          color: var(--stripe-text-tertiary);
        }

        .admin-input {
          width: 100%;
          padding: 10px 14px;
          background: #ffffff;
          border: 1px solid var(--stripe-border);
          border-radius: var(--stripe-radius);
          color: var(--stripe-text-primary);
          font-size: 14px;
          transition: all 0.1s;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        .admin-input-lg {
          padding: 12px 14px;
          font-size: 16px;
          font-weight: 600;
        }

        .admin-input:focus {
          outline: none;
          border-color: var(--stripe-primary);
          box-shadow: 0 0 0 3px var(--stripe-primary-subtle);
        }

        .admin-input.input-error {
          border-color: var(--stripe-danger);
        }

        .admin-textarea {
          width: 100%;
          padding: 10px 14px;
          background: #ffffff;
          border: 1px solid var(--stripe-border);
          border-radius: var(--stripe-radius);
          color: var(--stripe-text-primary);
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .admin-textarea:focus {
          outline: none;
          border-color: var(--stripe-primary);
          box-shadow: 0 0 0 3px var(--stripe-primary-subtle);
        }

        .admin-textarea.input-error {
          border-color: #dc3545;
        }

        .admin-textarea-code {
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 13px;
        }

        .admin-select {
          width: 100%;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          color: #1a1d21;
          font-size: 14px;
        }

        .admin-select:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(255,200,26,0.15);
        }

        /* Category Select */
        .admin-category-select {
          position: relative;
        }

        .admin-new-category-input {
          margin-top: 8px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e8e8e8;
        }

        .admin-input-sm {
          padding: 8px 12px;
          font-size: 13px;
        }

        .admin-new-category-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .admin-btn-sm {
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .admin-btn-primary {
          background: #1a1a1a;
          color: #1a1d21;
          border-color: #1a1a1a;
        }

        .admin-btn-primary:hover {
          background: #333333;
        }

        .admin-btn-secondary {
          background: #ffffff;
          color: #6c757d;
          border-color: #e8e8e8;
        }

        .admin-btn-secondary:hover {
          background: #f8f9fa;
        }

        /* Tags */
        .admin-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          min-height: 44px;
        }

        .admin-tags-container:focus-within {
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(255,200,26,0.15);
        }

        .admin-tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          background: #1a1a1a;
          color: #1a1d21;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .admin-tag-remove {
          background: none;
          border: none;
          color: #1a1d21;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 0;
          opacity: 0.6;
        }

        .admin-tag-remove:hover {
          opacity: 1;
        }

        .admin-tag-input-wrapper {
          position: relative;
          flex: 1;
          min-width: 150px;
        }

        .admin-tag-input {
          border: none;
          padding: 4px 8px;
          background: transparent;
        }

        .admin-tag-input:focus {
          box-shadow: none;
          outline: none;
        }

        .admin-tag-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 100;
          max-height: 200px;
          overflow-y: auto;
        }

        .admin-tag-suggestion {
          display: block;
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          text-align: left;
          font-size: 13px;
          color: #1a1d21;
          cursor: pointer;
        }

        .admin-tag-suggestion:hover {
          background: #f8f9fa;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #1a1a1a;
        }

        .admin-checkbox-label {
          font-size: 14px;
          color: #495057;
          cursor: pointer;
        }

        .admin-schema-title {
          font-size: 14px;
          font-weight: 600;
          color: #6c757d;
          margin: 0 0 12px 0;
        }

        .schema-preview {
          background: #f8f9fa;
          color: #495057;
          padding: 16px;
          border-radius: 8px;
          font-size: 12px;
          max-height: 400px;
          overflow: auto;
          margin: 0;
        }

        .schema-preview-wrapper {
          margin-top: 24px;
        }

        /* Sidebar Cards */
        .admin-sidebar-card {
          padding: 20px;
        }

        .admin-sidebar-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1d21;
          padding: 0 0 16px 0;
          margin: 0;
          border-bottom: 1px solid #f0f0f0;
        }

        /* Featured Image */
        .admin-featured-image {
          margin-bottom: 16px;
        }

        .admin-image-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .admin-image-preview img {
          width: 100%;
          height: auto;
          display: block;
        }

        .admin-image-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.6);
          border: none;
          border-radius: 50%;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-image-placeholder {
          aspect-ratio: 16/9;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }

        .admin-image-placeholder i {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .admin-image-placeholder p {
          margin: 0;
          font-size: 13px;
        }

        .admin-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: #f8f9fa;
          border: 1px dashed #e8e8e8;
          border-radius: 8px;
          color: #6c757d;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .admin-upload-btn:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
          background: rgba(255,200,26,0.05);
        }

        .admin-library-section {
          margin-top: 16px;
        }

        .admin-library-title {
          font-size: 13px;
          font-weight: 500;
          color: #6c757d;
          margin: 0 0 12px 0;
        }

        .admin-library-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .admin-library-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .admin-library-item:hover {
          border-color: #1a1a1a;
        }

        .admin-library-item.selected {
          border-color: #1a1a1a;
        }

        .admin-library-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admin-library-check {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: #1a1a1a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1d21;
          font-size: 10px;
        }

        .admin-library-empty {
          grid-column: 1 / -1;
          text-align: center;
          color: #6c757d;
          font-size: 12px;
          padding: 20px 0;
        }

        .text-danger {
          color: #dc3545;
        }

        .mt-4 {
          margin-top: 24px;
        }

        /* Preview Modal */
        .wp-modal.wp-modal-preview {
          max-width: 900px;
        }

        .wp-modal-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wp-preview-badge {
          padding: 4px 12px;
          background: #1a1a1a;
          color: #1a1d21;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .wp-preview-body {
          padding: 0;
          max-height: 70vh;
          overflow-y: auto;
        }

        .wp-preview-single-post {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
        }

        .wp-preview-featured-image {
          margin-bottom: 24px;
          border-radius: 8px;
          overflow: hidden;
        }

        .wp-preview-featured-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .wp-preview-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .wp-preview-category {
          padding: 4px 12px;
          background: #1a1a1a;
          color: #1a1d21;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .wp-preview-date {
          font-size: 13px;
          color: #6c757d;
        }

        .wp-preview-title {
          font-size: 36px;
          font-weight: 700;
          color: #1a1d21;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }

        .wp-preview-excerpt {
          font-size: 18px;
          color: #6c757d;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .wp-preview-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #e8e8e8;
        }

        .wp-preview-tag {
          padding: 4px 12px;
          background: #f8f9fa;
          color: #495057;
          border-radius: 20px;
          font-size: 12px;
        }

        .wp-preview-content {
          line-height: 1.8;
          color: #495057;
        }

        .wp-preview-content h1,
        .wp-preview-content h2,
        .wp-preview-content h3,
        .wp-preview-content h4 {
          color: #1a1d21;
          margin-top: 32px;
          margin-bottom: 16px;
        }

        .wp-preview-content p {
          margin-bottom: 16px;
        }

        .wp-preview-content img {
          max-width: 100%;
          border-radius: 4px;
          margin: 16px 0;
        }

        .wp-preview-content blockquote {
          border-left: 4px solid #1a1a1a;
          padding-left: 16px;
          margin: 16px 0;
          color: #6c757d;
          font-style: italic;
        }

        .wp-preview-content pre {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
        }

        .wp-preview-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }

        .wp-preview-content th,
        .wp-preview-content td {
          padding: 12px 16px;
          border: 1px solid #e8e8e8;
          text-align: left;
        }

        .wp-preview-content th {
          background: #f8f9fa;
          font-weight: 600;
        }

        .wp-preview-content a {
          color: #0d6efd;
        }

        /* Preview Language Tabs */
        .wp-preview-lang-tabs {
          display: flex;
          gap: 4px;
        }

        .wp-preview-lang-tab {
          padding: 6px 12px;
          background: #f8f9fa;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          color: #6c757d;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wp-preview-lang-tab:hover {
          background: #ffffff;
          color: #1a1d21;
        }

        .wp-preview-lang-tab.active {
          background: #1a1a1a;
          color: #1a1d21;
          border-color: #1a1a1a;
        }

        /* Status Info */
        .admin-status-info {
          margin-top: 16px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 13px;
        }

        .admin-status-info p {
          margin: 0;
        }

        .admin-status-scheduled {
          color: #0d6efd;
        }

        .admin-status-published {
          color: #198754;
        }

        .admin-status-draft {
          color: #6c757d;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-editor-header {
            flex-direction: column;
            gap: 16px;
          }

          .admin-editor-left,
          .admin-editor-right {
            width: 100%;
            justify-content: center;
          }

          .admin-publish-controls {
            flex-wrap: wrap;
          }

          .wp-modal.wp-modal-preview {
            max-width: 95%;
            margin: 10px;
          }

          .wp-preview-single-post {
            padding: 20px;
          }

          .wp-preview-title {
            font-size: 24px;
          }
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
