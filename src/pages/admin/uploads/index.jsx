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
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [compressionEnabled, setCompressionEnabled] = useState(true);
  const [compressionQuality, setCompressionQuality] = useState(0.7); // 70% quality

  useEffect(() => { fetchUploads(); }, []);

  const fetchUploads = async () => {
    const res = await fetch('/api/admin/uploads');
    const data = await res.json();
    setUploads(data.uploads || []);
  };

  // Compress image before upload
  const compressImage = (file, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max 1920x1080)
          let width = img.width;
          let height = img.height;
          const maxWidth = 1920;
          const maxHeight = 1080;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log(`Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB (${((1 - blob.size / file.size) * 100).toFixed(0)}% reduction)`);
                resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg', lastModified: Date.now() }));
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Compress PDF before upload (client-side optimization)
  const compressPdf = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Dynamically import pdf-lib
        const { PDFDocument } = await import('pdf-lib');
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF
        const pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
          updateMetadata: false,
        });

        // Remove unnecessary metadata and optimize
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');

        // Save with compression
        const compressedBytes = await pdfDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
        });

        const compressedBlob = new Blob([compressedBytes], { type: 'application/pdf' });
        const compressedFile = new File([compressedBlob], file.name, { type: 'application/pdf', lastModified: Date.now() });
        
        console.log(`PDF Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB (${((1 - compressedFile.size / file.size) * 100).toFixed(0)}% reduction)`);
        resolve(compressedFile);
      } catch (err) {
        console.warn('PDF compression failed, uploading original:', err);
        resolve(file); // Fallback to original
      }
    });
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    for (const file of files) {
      try {
        let fileToUpload = file;

        // Compress images if enabled
        if (compressionEnabled && file.type.startsWith('image/')) {
          setCompressing(true);
          try {
            fileToUpload = await compressImage(file, compressionQuality);
          } catch (err) {
            console.warn('Image compression failed, uploading original:', err);
          }
          setCompressing(false);
        }

        // Compress PDFs if enabled
        if (compressionEnabled && file.type === 'application/pdf') {
          setCompressing(true);
          try {
            fileToUpload = await compressPdf(file);
          } catch (err) {
            console.warn('PDF compression failed, uploading original:', err);
          }
          setCompressing(false);
        }

        const fd = new FormData();
        fd.append('file', fileToUpload);
        await fetch('/api/admin/uploads', { method: 'POST', body: fd });
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setUploading(false);
    e.target.value = ''; // Reset file input
    fetchUploads();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return;
    await fetch(`/api/admin/uploads/${id}`, { method: 'DELETE' });
    fetchUploads();
    // Remove from selection if present
    setSelected(prev => prev.filter(s => s !== id));
  };

  // Selection handlers
  const toggleSelect = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(paginatedUploads.map(u => u.id));
    }
    setSelectAll(!selectAll);
  };

  // Bulk actions
  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} selected files?`)) return;
    
    for (const id of selected) {
      await fetch(`/api/admin/uploads/${id}`, { method: 'DELETE' });
    }
    
    setSelected([]);
    setSelectAll(false);
    fetchUploads();
  };

  const downloadSelected = () => {
    const selectedFiles = uploads.filter(u => selected.includes(u.id));
    
    for (const file of selectedFiles) {
      const link = document.createElement('a');
      link.href = file.path;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearSelection = () => {
    setSelected([]);
    setSelectAll(false);
  };

  // Bulk copy URL to clipboard
  const copyUrlsToClipboard = () => {
    const selectedFiles = uploads.filter(u => selected.includes(u.id));
    const urls = selectedFiles.map(f => window.location.origin + f.path).join('\n');
    
    navigator.clipboard.writeText(urls).then(() => {
      alert(`✅ Copied ${selected.length} URLs to clipboard!`);
    }).catch(() => {
      alert('Failed to copy URLs');
    });
  };

  // Bulk compress selected files (images + PDFs)
  const bulkCompress = async () => {
    const selectedFiles = uploads.filter(u => selected.includes(u.id));
    const compressibleFiles = selectedFiles.filter(u =>
      u.mimeType?.startsWith('image') ||
      u.mimeType === 'application/pdf' ||
      /\.(jpe?g|png|webp|gif|pdf)$/i.test(u.filename)
    );

    if (compressibleFiles.length === 0) {
      alert('⚠️ No compressible files selected. Please select images or PDFs.');
      return;
    }

    const imageCount = compressibleFiles.filter(f => f.mimeType?.startsWith('image')).length;
    const pdfCount = compressibleFiles.filter(f => f.mimeType === 'application/pdf').length;

    // Calculate estimated savings
    const estimatedOriginalSize = compressibleFiles.reduce((acc, f) => acc + (f.size || 0), 0);
    const estimatedCompressedSize = estimatedOriginalSize * compressionQuality * 0.6;
    const estimatedSavings = ((1 - estimatedCompressedSize / estimatedOriginalSize) * 100).toFixed(0);

    if (!confirm(`Compress ${compressibleFiles.length} file(s)?

📊 ${imageCount} image(s), ${pdfCount} PDF(s)
📊 Quality: ${Math.round(compressionQuality * 100)}%
📊 Original size: ${(estimatedOriginalSize / 1024 / 1024).toFixed(2)} MB
📊 Estimated size: ~${(estimatedCompressedSize / 1024 / 1024).toFixed(2)} MB
📊 Space saved: ~${estimatedSavings}%

This will replace the originals and cannot be undone.`)) {
      return;
    }

    setCompressing(true);
    let successCount = 0;
    let failCount = 0;
    let totalSaved = 0;

    for (const file of compressibleFiles) {
      try {
        console.log(`Compressing: ${file.filename} (${(file.size / 1024).toFixed(0)}KB)`);

        // Fetch the original file
        const response = await fetch(file.path);
        const blob = await response.blob();
        const originalSize = blob.size;
        const originalFile = new File([blob], file.filename, { type: file.mimeType });

        let compressedFile;
        let compressedSize;
        let saved;

        // Compress based on file type
        if (file.mimeType?.startsWith('image')) {
          compressedFile = await compressImage(originalFile, compressionQuality);
          compressedSize = compressedFile.size;
          saved = ((1 - compressedSize / originalSize) * 100).toFixed(0);
        } else if (file.mimeType === 'application/pdf') {
          compressedFile = await compressPdf(originalFile);
          compressedSize = compressedFile.size;
          saved = ((1 - compressedSize / originalSize) * 100).toFixed(0);
        } else {
          console.warn(`Skipping ${file.filename} - unsupported type`);
          failCount++;
          continue;
        }

        totalSaved += originalSize - compressedSize;
        console.log(`✅ ${file.filename}: ${saved}% reduction (${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB)`);

        // Upload compressed version
        const fd = new FormData();
        fd.append('file', compressedFile);
        fd.append('replaceId', file.id);
        fd.append('deleteOriginal', 'true');

        await fetch('/api/admin/uploads', { method: 'POST', body: fd });

        // Delete original
        await fetch(`/api/admin/uploads/${file.id}`, { method: 'DELETE' });

        successCount++;
      } catch (error) {
        console.error(`❌ Failed to compress ${file.filename}:`, error);
        failCount++;
      }
    }
    
    setCompressing(false);
    setSelected([]);
    setSelectAll(false);
    fetchUploads();
    
    const totalSavedMB = (totalSaved / 1024 / 1024).toFixed(2);
    if (failCount === 0) {
      alert(`✅ Successfully compressed ${successCount} image(s)!
      
📊 Total space saved: ${totalSavedMB} MB`);
    } else {
      alert(`✅ ${successCount} compressed
❌ ${failCount} failed

📊 Total space saved: ${totalSavedMB} MB`);
    }
  };

  // Helper to determine file type icon
  const getFileIcon = (mimeType, filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    
    if (mimeType?.includes('image') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      return 'fa-file-image';
    }
    if (mimeType?.includes('pdf') || ext === 'pdf') {
      return 'fa-file-pdf';
    }
    if (mimeType?.includes('json') || ext === 'json') {
      return 'fa-file-code';
    }
    if (mimeType?.includes('video') || ['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
      return 'fa-file-video';
    }
    if (mimeType?.includes('audio') || ['mp3', 'wav', 'ogg'].includes(ext)) {
      return 'fa-file-audio';
    }
    if (mimeType?.includes('word') || ext === 'docx' || ext === 'doc') {
      return 'fa-file-word';
    }
    if (mimeType?.includes('excel') || mimeType?.includes('spreadsheet') || ext === 'xlsx' || ext === 'xls') {
      return 'fa-file-excel';
    }
    if (mimeType?.includes('zip') || ext === 'zip') {
      return 'fa-file-zipper';
    }
    return 'fa-file';
  };

  // Helper to get file type color
  const getFileTypeColor = (mimeType, filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    
    if (mimeType?.includes('image') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      return '#10b981'; // Green
    }
    if (mimeType?.includes('pdf') || ext === 'pdf') {
      return '#ef4444'; // Red
    }
    if (mimeType?.includes('json') || ext === 'json') {
      return '#f59e0b'; // Amber
    }
    if (mimeType?.includes('video') || ['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
      return '#8b5cf6'; // Purple
    }
    return '#6b7280'; // Gray
  };

  // Helper to get file type label
  const getFileTypeLabel = (mimeType, filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    
    if (mimeType?.includes('image') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
      return 'Image';
    }
    if (mimeType?.includes('pdf') || ext === 'pdf') {
      return 'PDF';
    }
    if (mimeType?.includes('json') || ext === 'json') {
      return 'JSON';
    }
    if (mimeType?.includes('video') || ['mp4', 'webm', 'mov', 'avi'].includes(ext)) {
      return 'Video';
    }
    if (ext) return ext.toUpperCase();
    return 'File';
  };

  // Check if file is previewable as image
  const isImage = (mimeType, filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    return mimeType?.includes('image') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
  };

  // Pagination
  const totalPages = Math.ceil(uploads.length / ITEMS_PER_PAGE);
  const paginatedUploads = uploads.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Head><title>Media Library — Nova Impact Admin</title></Head>
      <AdminLayout title="Media Library">
        <div className="admin-page-header">
          <div>
            <div className="admin-upload-stats">
              <span className="admin-stat">{uploads.length}</span> files uploaded
              <span className="admin-stat-total">({(uploads.reduce((acc, u) => acc + (u.size || 0), 0) / 1024 / 1024).toFixed(2)} MB total)</span>
            </div>
            
            {/* Compression Settings */}
            <div className="admin-compression-settings">
              <label className="compression-toggle">
                <input 
                  type="checkbox" 
                  checked={compressionEnabled} 
                  onChange={(e) => setCompressionEnabled(e.target.checked)} 
                />
                <span>Auto-compress images & PDFs</span>
              </label>
              {compressionEnabled && (
                <div className="compression-quality">
                  <span>Quality: {Math.round(compressionQuality * 100)}%</span>
                  <input 
                    type="range" 
                    min="0.3" 
                    max="1" 
                    step="0.1" 
                    value={compressionQuality} 
                    onChange={(e) => setCompressionQuality(parseFloat(e.target.value))} 
                  />
                </div>
              )}
            </div>
          </div>
          
          <label className="btn-gold btn-upload">
            <i className="fa-solid fa-upload me-2"></i>
            {uploading ? (compressing ? 'Compressing & Uploading...' : 'Uploading...') : 'Upload Files'}
            <input type="file" accept="image/*,application/pdf" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>

        {/* Bulk Actions Bar */}
        {selected.length > 0 && (
          <div className="admin-bulk-actions">
            <div className="bulk-actions-left">
              <span className="bulk-selected-count">{selected.length} selected</span>
              <button className="bulk-btn" onClick={bulkCompress} disabled={compressing}>
                <i className="fa-solid fa-compress"></i> {compressing ? 'Compressing...' : 'Compress'}
              </button>
              <button className="bulk-btn" onClick={bulkDelete} disabled={compressing}>
                <i className="fa-solid fa-trash"></i> Delete
              </button>
              <button className="bulk-btn" onClick={downloadSelected} disabled={compressing}>
                <i className="fa-solid fa-download"></i> Download
              </button>
              <button className="bulk-btn" onClick={copyUrlsToClipboard} disabled={compressing}>
                <i className="fa-solid fa-copy"></i> Copy URLs
              </button>
              <button className="bulk-btn bulk-btn-clear" onClick={clearSelection} disabled={compressing}>
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {preview && (
          <div className="admin-preview-modal">
            <div className="admin-preview-content">
              {preview.endsWith('.pdf') || preview.includes('pdf') ? (
                <iframe src={preview} style={{ width: '90vw', height: '90vh', border: 'none', borderRadius: '8px' }} />
              ) : (
                <img src={preview} alt="Preview" />
              )}
              <button className="admin-preview-close" onClick={() => setPreview('')}><i className="fa-solid fa-times"></i></button>
            </div>
          </div>
        )}

        {uploads.length > 0 ? (
          <>
            <div className="admin-upload-grid">
              {/* Select All Header */}
              <div className="admin-select-all-header">
                <label className="admin-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={selectAll} 
                    onChange={toggleSelectAll} 
                  />
                  <span>Select All</span>
                </label>
              </div>
              
              {paginatedUploads.map(u => (
                <div className={`admin-upload-card ${selected.includes(u.id) ? 'selected' : ''}`} key={u.id}>
                  <div className="admin-upload-checkbox" onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(u.id);
                  }}>
                    <input 
                      type="checkbox" 
                      checked={selected.includes(u.id)} 
                      onChange={() => {}} 
                    />
                  </div>
                  <div className="admin-upload-thumb" onClick={() => setPreview(u.path)}>
                    {isImage(u.mimeType, u.filename) ? (
                      <>
                        <img src={u.path} alt={u.filename} />
                        <div className="admin-upload-overlay">
                          <i className="fa-solid fa-expand"></i>
                        </div>
                      </>
                    ) : (
                      <div className="admin-file-icon">
                        <i className={`fa-solid ${getFileIcon(u.mimeType, u.filename)}`} style={{ color: getFileTypeColor(u.mimeType, u.filename) }}></i>
                        <span className="admin-file-type-label">{getFileTypeLabel(u.mimeType, u.filename)}</span>
                      </div>
                    )}
                  </div>
                  <div className="admin-upload-info">
                    <p className="admin-upload-name" title={u.filename}>{u.filename}</p>
                    <div className="admin-upload-meta">
                      <span className="admin-upload-size">{u.size ? (u.size / 1024).toFixed(1) + ' KB' : 'N/A'}</span>
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
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <h3>No files uploaded yet</h3>
              <p>Upload your first files to get started</p>
              <label className="btn-gold">
                <i className="fa-solid fa-upload me-2"></i>Upload Files
                <input type="file" accept="image/*,application/pdf" multiple onChange={handleUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        )}
      </AdminLayout>

      <style jsx global>{`
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .admin-upload-stats {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 12px;
        }

        .admin-compression-settings {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 13px;
        }

        .compression-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #495057;
        }

        .compression-toggle input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .compression-quality {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .compression-quality input[type="range"] {
          width: 100px;
          cursor: pointer;
        }

        .compression-quality span {
          font-weight: 600;
          color: #FFC81A;
          min-width: 50px;
        }

        /* Bulk Actions Bar */
        .admin-bulk-actions {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          padding: 12px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bulk-actions-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .bulk-selected-count {
          font-weight: 600;
          font-size: 14px;
          margin-right: 8px;
        }

        .bulk-btn {
          background: rgba(255,255,255,0.2);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .bulk-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bulk-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }

        .bulk-btn:first-child:not(.bulk-btn-clear) {
          background: rgba(255,200,26,0.3);
          border-color: rgba(255,200,26,0.5);
          font-weight: 600;
        }

        .bulk-btn:first-child:not(.bulk-btn-clear):hover {
          background: rgba(255,200,26,0.4);
        }

        .bulk-btn-clear {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          margin-left: 8px;
        }

        .bulk-btn-clear:hover {
          background: rgba(255,255,255,0.25);
        }

        /* Select All Header */
        .admin-select-all-header {
          background: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
          color: #495057;
          font-size: 14px;
        }

        .admin-checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
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
          border: 2px solid #e8e8e8;
          transition: all 0.3s ease;
          position: relative;
        }

        .admin-upload-card.selected {
          border-color: #FFC81A;
          box-shadow: 0 0 0 3px rgba(255,200,26,0.2);
        }

        .admin-upload-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
          border-color: #FFC81A;
        }

        .admin-upload-checkbox {
          position: absolute;
          top: 10px;
          left: 10px;
          z-index: 10;
          cursor: pointer;
        }

        .admin-upload-checkbox input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          border: 2px solid #fff;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .admin-upload-thumb {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          cursor: pointer;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .admin-upload-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .admin-file-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .admin-file-icon i {
          font-size: 64px;
          transition: transform 0.3s;
        }

        .admin-file-type-label {
          font-size: 12px;
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-upload-card:hover .admin-file-icon i {
          transform: scale(1.1);
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
