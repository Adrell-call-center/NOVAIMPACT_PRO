import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange, uploads = [], onUpload, placeholder = 'Start writing...', preview = false }) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showLinkPicker, setShowLinkPicker] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);
  const [showPdfPicker, setShowPdfPicker] = useState(false);
  const [showCodeBlock, setShowCodeBlock] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [showHrPicker, setShowHrPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [uploading, setUploading] = useState(false);
  const [quill, setQuill] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const quillRef = useRef(null);

  // Custom toolbar handlers
  const insertImage = (url) => {
    if (quill) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      quill.insertEmbed(range.index, 'image', url);
      quill.setSelection(range.index + 1);
    }
    setShowMediaPicker(false);
  };

  const insertLink = () => {
    if (quill && linkUrl) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      const text = linkText || quill.getText(range.index, range.length)?.trim() || linkUrl;
      quill.deleteText(range.index, range.length || 1);
      quill.insertText(range.index, text, { link: linkUrl });
      quill.setSelection(range.index + text.length);
    }
    setShowLinkPicker(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertVideo = () => {
    if (quill && videoUrl) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      let embedUrl = videoUrl;
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const match = videoUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
        if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}`;
      } else if (videoUrl.includes('vimeo.com')) {
        const match = videoUrl.match(/vimeo\.com\/(\d+)/);
        if (match) embedUrl = `https://player.vimeo.com/video/${match[1]}`;
      }
      quill.insertEmbed(range.index, 'video', embedUrl);
      quill.setSelection(range.index + 1);
    }
    setShowVideoPicker(false);
    setVideoUrl('');
  };

  const insertPdf = () => {
    if (quill && pdfUrl) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      const html = `<a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: #f8f9fa; color: #1a1d21; border: 1px solid #e8e8e8; border-radius: 4px; text-decoration: none; margin: 8px 0;">📄 View PDF</a>`;
      quill.clipboard.dangerouslyPasteHTML(range.index, html);
      quill.setSelection(range.index + 2);
    }
    setShowPdfPicker(false);
    setPdfUrl('');
  };

  const insertCodeBlock = () => {
    if (quill && codeContent) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      const html = `<pre class="ql-syntax" spellcheck="false">${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre><p><br></p>`;
      quill.clipboard.dangerouslyPasteHTML(range.index, html);
      quill.setSelection(range.index + 1);
    }
    setShowCodeBlock(false);
    setCodeContent('');
  };

  const insertTable = () => {
    if (quill) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      let tableHTML = '<table style="width: 100%; border-collapse: collapse; margin: 16px 0;"><thead><tr>';
      for (let j = 0; j < tableCols; j++) {
        tableHTML += `<th style="padding: 10px; border: 1px solid #e8e8e8; text-align: left; background: #f8f9fa;">Header ${j + 1}</th>`;
      }
      tableHTML += '</tr></thead><tbody>';
      for (let i = 1; i < tableRows; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < tableCols; j++) {
          tableHTML += `<td style="padding: 10px; border: 1px solid #e8e8e8;">Cell</td>`;
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</tbody></table><p><br></p>';
      quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML);
      quill.setSelection(range.index + 2);
    }
    setShowTablePicker(false);
  };

  const insertHorizontalRule = () => {
    if (quill) {
      const range = quill.getSelection(true) || { index: quill.getLength() };
      quill.insertEmbed(range.index, 'hr', true);
    }
    setShowHrPicker(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    if (onUpload) {
      const url = await onUpload(file);
      if (url) insertImage(url);
    }
    setUploading(false);
  };

  // WordPress-like Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }, { align: [] }],
      ['link', 'image', 'video', 'blockquote', 'code-block'],
      ['clean'],
    ],
    history: {
      delay: 2000,
      maxStack: 500,
      userOnly: true
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'video', 'blockquote', 'code-block',
  ];

  // WordPress-like Preview
  if (preview) {
    return (
      <div className="wp-preview-container">
        <div className="wp-preview-header">
          <div className="wp-preview-title"><i className="fa-solid fa-eye me-2"></i>Post Preview</div>
          <button className="wp-btn wp-btn-primary" onClick={() => onChange && onChange(value)}>
            <i className="fa-solid fa-pen me-2"></i>Back to Editor
          </button>
        </div>
        <div className="wp-preview-content">
          <div className="wp-content-body" dangerouslySetInnerHTML={{ __html: value || '<p style="color: #6c757d; font-style: italic;">Nothing to preview yet...</p>' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`wp-editor-container ${isFullscreen ? 'wp-editor-fullscreen' : ''}`}>
        {/* WordPress-like Toolbar */}
        <div className="wp-toolbar">
          <div className="wp-toolbar-row">
            <div className="wp-toolbar-group">
              <button className="wp-toolbar-btn" title="Fullscreen" onClick={() => setIsFullscreen(!isFullscreen)}>
                <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
              </button>
            </div>
            <div className="wp-toolbar-spacer"></div>
            <div className="wp-toolbar-group">
              <button className="wp-toolbar-btn" title="Media Library" onClick={() => setShowMediaPicker(true)}>
                <i className="fa-solid fa-image"></i>
              </button>
              <button className="wp-toolbar-btn" title="Video" onClick={() => setShowVideoPicker(true)}>
                <i className="fa-solid fa-video"></i>
              </button>
              <button className="wp-toolbar-btn" title="Table" onClick={() => setShowTablePicker(true)}>
                <i className="fa-solid fa-table"></i>
              </button>
              <button className="wp-toolbar-btn" title="Code Block" onClick={() => setShowCodeBlock(true)}>
                <i className="fa-solid fa-code"></i>
              </button>
              <button className="wp-toolbar-btn" title="PDF" onClick={() => setShowPdfPicker(true)}>
                <i className="fa-solid fa-file-pdf"></i>
              </button>
              <button className="wp-toolbar-btn" title="Horizontal Rule" onClick={() => setShowHrPicker(true)}>
                <i className="fa-solid fa-minus"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="wp-editor-content-wrapper">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value || ''}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="wp-quill-editor"
            onEditorChange={(content, delta, source, editor) => setQuill(editor)}
          />
        </div>

        {/* Footer */}
        <div className="wp-editor-footer">
          <span className="wp-word-count">{value ? value.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length : 0} words</span>
          <span className="wp-editor-info">WordPress Editor</span>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="wp-modal-overlay" onClick={() => setShowMediaPicker(false)}>
          <div className="wp-modal wp-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="wp-modal-header">
              <h3><i className="fa-solid fa-image me-2"></i>Add Image</h3>
              <button className="wp-modal-close" onClick={() => setShowMediaPicker(false)}>×</button>
            </div>
            <div className="wp-modal-body">
              <div className="wp-media-grid">
                {uploads.map((u) => (
                  <div key={u.id} className="wp-media-item" onClick={() => insertImage(u.path)}>
                    <img src={u.path} alt={u.filename} />
                    <div className="wp-media-overlay"><button className="wp-btn wp-btn-sm">Insert</button></div>
                  </div>
                ))}
                {uploads.length === 0 && (
                  <div className="wp-media-empty">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <p>No images in library</p>
                  </div>
                )}
              </div>
              <div className="wp-form-group">
                <label>Or enter image URL:</label>
                <div className="wp-input-row">
                  <input type="text" className="wp-input" placeholder="https://example.com/image.jpg" id="customImageUrl" />
                  <button className="wp-btn wp-btn-primary" onClick={() => {
                    const url = document.getElementById('customImageUrl').value;
                    if (url) insertImage(url);
                  }}>Insert</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Picker Modal */}
      {showLinkPicker && (
        <div className="wp-modal-overlay" onClick={() => setShowLinkPicker(false)}>
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wp-modal-header">
              <h3><i className="fa-solid fa-link me-2"></i>Insert Link</h3>
              <button className="wp-modal-close" onClick={() => setShowLinkPicker(false)}>×</button>
            </div>
            <div className="wp-modal-body">
              <div className="wp-form-group">
                <label>URL</label>
                <input type="url" className="wp-input" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" />
              </div>
              <div className="wp-form-group">
                <label>Link Text (optional)</label>
                <input type="text" className="wp-input" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Click here" />
              </div>
            </div>
            <div className="wp-modal-footer">
              <button className="wp-btn wp-btn-secondary" onClick={() => setShowLinkPicker(false)}>Cancel</button>
              <button className="wp-btn wp-btn-primary" onClick={insertLink}>Insert Link</button>
            </div>
          </div>
        </div>
      )}

      {/* Video Picker Modal */}
      {showVideoPicker && (
        <div className="wp-modal-overlay" onClick={() => setShowVideoPicker(false)}>
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wp-modal-header">
              <h3><i className="fa-solid fa-video me-2"></i>Insert Video</h3>
              <button className="wp-modal-close" onClick={() => setShowVideoPicker(false)}>×</button>
            </div>
            <div className="wp-modal-body">
              <div className="wp-form-group">
                <label>Video URL</label>
                <input type="url" className="wp-input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
            <div className="wp-modal-footer">
              <button className="wp-btn wp-btn-secondary" onClick={() => setShowVideoPicker(false)}>Cancel</button>
              <button className="wp-btn wp-btn-primary" onClick={insertVideo}>Insert Video</button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Picker Modal */}
      {showPdfPicker && (
        <div className="wp-modal-overlay" onClick={() => setShowPdfPicker(false)}>
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wp-modal-header">
              <h3><i className="fa-solid fa-file-pdf me-2"></i>Insert PDF Link</h3>
              <button className="wp-modal-close" onClick={() => setShowPdfPicker(false)}>×</button>
            </div>
            <div className="wp-modal-body">
              <div className="wp-form-group">
                <label>PDF URL</label>
                <input type="url" className="wp-input" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://example.com/document.pdf" />
              </div>
            </div>
            <div className="wp-modal-footer">
              <button className="wp-btn wp-btn-secondary" onClick={() => setShowPdfPicker(false)}>Cancel</button>
              <button className="wp-btn wp-btn-primary" onClick={insertPdf}>Insert PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* Code Block Modal */}
      {showCodeBlock && (
        <div className="wp-modal-overlay" onClick={() => setShowCodeBlock(false)}>
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wp-modal-header">
              <h3><i className="fa-solid fa-code me-2"></i>Insert Code Block</h3>
              <button className="wp-modal-close" onClick={() => setShowCodeBlock(false)}>×</button>
            </div>
            <div className="wp-modal-body">
              <div className="wp-form-group">
                <label>Code Content</label>
                <textarea className="wp-textarea wp-textarea-code" rows={8} value={codeContent} onChange={(e) => setCodeContent(e.target.value)} placeholder="Paste your code here..." />
              </div>
            </div>
            <div className="wp-modal-footer">
              <button className="wp-btn wp-btn-secondary" onClick={() => setShowCodeBlock(false)}>Cancel</button>
              <button className="wp-btn wp-btn-primary" onClick={insertCodeBlock}>Insert Code</button>
            </div>
          </div>
        </div>
      )}

      {/* Table Picker Modal */}
      {showTablePicker && (
        <div className="wp-modal-overlay" onClick={() => setShowTablePicker(false)}>
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wp-modal-header">
              <h3><i className="fa-solid fa-table me-2"></i>Insert Table</h3>
              <button className="wp-modal-close" onClick={() => setShowTablePicker(false)}>×</button>
            </div>
            <div className="wp-modal-body">
              <div className="wp-form-row">
                <div className="wp-form-group">
                  <label>Rows</label>
                  <input type="number" className="wp-input" value={tableRows} onChange={(e) => setTableRows(parseInt(e.target.value) || 3)} min="1" max="20" />
                </div>
                <div className="wp-form-group">
                  <label>Columns</label>
                  <input type="number" className="wp-input" value={tableCols} onChange={(e) => setTableCols(parseInt(e.target.value) || 3)} min="1" max="10" />
                </div>
              </div>
            </div>
            <div className="wp-modal-footer">
              <button className="wp-btn wp-btn-secondary" onClick={() => setShowTablePicker(false)}>Cancel</button>
              <button className="wp-btn wp-btn-primary" onClick={insertTable}>Insert Table</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Editor Container */
        .wp-editor-container {
          background: #ffffff;
          border: 1px solid #e8e8e8;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        .wp-editor-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          border-radius: 0;
        }

        /* Toolbar */
        .wp-toolbar {
          background: #f8f9fa;
          border-bottom: 1px solid #e8e8e8;
          padding: 8px 12px;
        }

        .wp-toolbar-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
        }

        .wp-toolbar-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .wp-toolbar-spacer {
          flex: 1;
        }

        .wp-toolbar-btn {
          width: 32px;
          height: 32px;
          border: 1px solid transparent;
          background: transparent;
          color: #6c757d;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.15s;
        }

        .wp-toolbar-btn:hover {
          background: #e8e8e8;
          color: #1a1d21;
          border-color: #d0d0d0;
        }

        .wp-toolbar-btn:active {
          background: #d0d0d0;
        }

        /* Editor Content */
        .wp-editor-content-wrapper {
          min-height: 400px;
        }

        .wp-quill-editor .ql-container {
          background: #ffffff;
          border: none;
          font-size: 16px;
          line-height: 1.7;
          color: #1a1d21;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .wp-quill-editor .ql-toolbar {
          background: #ffffff;
          border: none;
          border-bottom: 1px solid #f0f0f0;
          padding: 8px;
        }

        .wp-quill-editor .ql-toolbar .ql-picker {
          color: #1a1d21;
        }

        .wp-quill-editor .ql-toolbar button {
          color: #6c757d;
        }

        .wp-quill-editor .ql-toolbar button:hover,
        .wp-quill-editor .ql-toolbar button.ql-active {
          color: #FFC81A;
        }

        .wp-quill-editor .ql-toolbar .ql-picker-label:hover,
        .wp-quill-editor .ql-toolbar .ql-picker-label.ql-active {
          color: #FFC81A;
        }

        .wp-quill-editor .ql-editor {
          min-height: 400px;
          padding: 24px;
        }

        .wp-quill-editor .ql-editor.ql-blank::before {
          color: #adb5bd;
          font-style: normal;
          left: 24px;
        }

        .wp-quill-editor .ql-editor img {
          max-width: 100%;
          border-radius: 4px;
          margin: 16px 0;
        }

        .wp-quill-editor .ql-editor blockquote {
          border-left: 4px solid #FFC81A;
          padding-left: 16px;
          margin: 16px 0;
          color: #6c757d;
          font-style: italic;
        }

        .wp-quill-editor .ql-editor pre.ql-syntax {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          overflow-x: auto;
        }

        /* Footer */
        .wp-editor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: #f8f9fa;
          border-top: 1px solid #e8e8e8;
          font-size: 12px;
          color: #6c757d;
        }

        /* Preview */
        .wp-preview-container {
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
        }

        .wp-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: #f8f9fa;
          border-bottom: 1px solid #e8e8e8;
        }

        .wp-preview-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
        }

        .wp-preview-content {
          padding: 32px;
        }

        .wp-content-body h1,
        .wp-content-body h2,
        .wp-content-body h3,
        .wp-content-body h4 {
          color: #1a1d21;
          margin-top: 24px;
          margin-bottom: 16px;
        }

        .wp-content-body p {
          margin-bottom: 16px;
          line-height: 1.7;
          color: #495057;
        }

        .wp-content-body img {
          max-width: 100%;
          border-radius: 4px;
          margin: 16px 0;
        }

        .wp-content-body a {
          color: #0d6efd;
        }

        /* Modals */
        .wp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .wp-modal {
          background: #ffffff;
          border-radius: 4px;
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          overflow: hidden;
          border: 1px solid #e8e8e8;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .wp-modal.wp-modal-large {
          max-width: 800px;
        }

        .wp-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e8e8e8;
        }

        .wp-modal-header h3 {
          margin: 0;
          font-size: 16px;
          color: #1a1d21;
        }

        .wp-modal-close {
          background: none;
          border: none;
          color: #6c757d;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .wp-modal-close:hover {
          color: #1a1d21;
        }

        .wp-modal-body {
          padding: 20px;
          overflow-y: auto;
          max-height: 60vh;
        }

        .wp-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 20px;
          background: #f8f9fa;
          border-top: 1px solid #e8e8e8;
        }

        /* Media Grid */
        .wp-media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .wp-media-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .wp-media-item:hover {
          border-color: #FFC81A;
        }

        .wp-media-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wp-media-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255,200,26,0.9);
          padding: 8px;
          text-align: center;
          transform: translateY(100%);
          transition: transform 0.2s;
        }

        .wp-media-item:hover .wp-media-overlay {
          transform: translateY(0);
        }

        .wp-media-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .wp-media-empty i {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        /* Forms */
        .wp-form-group {
          margin-bottom: 16px;
        }

        .wp-form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #495057;
        }

        .wp-input {
          width: 100%;
          padding: 10px 14px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          color: #1a1d21;
          font-size: 14px;
        }

        .wp-input:focus {
          outline: none;
          border-color: #FFC81A;
          box-shadow: 0 0 0 2px rgba(255,200,26,0.15);
        }

        .wp-textarea {
          width: 100%;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 4px;
          color: #1a1d21;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .wp-textarea:focus {
          outline: none;
          border-color: #FFC81A;
          box-shadow: 0 0 0 2px rgba(255,200,26,0.15);
        }

        .wp-textarea-code {
          font-family: 'Monaco', 'Consolas', monospace;
          font-size: 13px;
        }

        .wp-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .wp-input-row {
          display: flex;
          gap: 8px;
        }

        .wp-input-row input {
          flex: 1;
        }

        /* Buttons */
        .wp-btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid transparent;
        }

        .wp-btn-primary {
          background: #FFC81A;
          color: #1a1d21;
          border-color: #FFC81A;
        }

        .wp-btn-primary:hover {
          background: #e6b517;
        }

        .wp-btn-secondary {
          background: #ffffff;
          color: #6c757d;
          border-color: #e8e8e8;
        }

        .wp-btn-secondary:hover {
          background: #f8f9fa;
          color: #1a1d21;
        }

        .wp-btn-sm {
          padding: 4px 12px;
          font-size: 12px;
        }

        /* Utilities */
        .me-2 { margin-right: 8px; }

        /* Responsive */
        @media (max-width: 768px) {
          .wp-quill-editor .ql-editor {
            padding: 16px;
            min-height: 300px;
          }

          .wp-toolbar {
            padding: 6px 8px;
          }

          .wp-toolbar-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .wp-modal {
            max-width: 95%;
            margin: 10px;
          }

          .wp-modal.wp-modal-large {
            max-width: 95%;
          }

          .wp-form-row {
            grid-template-columns: 1fr;
          }

          .wp-media-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }

          .wp-editor-footer {
            flex-direction: column;
            gap: 4px;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .wp-quill-editor .ql-toolbar {
            padding: 4px;
          }

          .wp-quill-editor .ql-toolbar .ql-formats {
            margin-right: 4px;
          }

          .wp-preview-header {
            flex-direction: column;
            gap: 12px;
          }

          .wp-preview-content {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default QuillEditor;
