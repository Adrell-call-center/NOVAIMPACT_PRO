"use client";

import "quill/dist/quill.snow.css";
import { useEffect, useRef, useState, useCallback } from "react";

const HTML_ICON      = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
const TABLE_ICON     = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`;
const PDF_ICON       = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15v-2h1.5a1 1 0 0 1 0 2H9z"/><path d="M13 13h1a2 2 0 0 1 0 4h-1v-4z"/><line x1="17" y1="13" x2="17" y2="17"/></svg>`;
const PDF_EMBED_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><rect x="3" y="14" width="18" height="7" rx="1"/></svg>`;

const PDF_SVG_STR = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`;

function insertAfterCursor(quill, node, para) {
  const sel = quill.getSelection();
  let block = null;
  if (sel) {
    const [leaf] = quill.getLeaf(sel.index);
    block = leaf?.domNode?.closest?.(".ql-editor > *") ?? null;
  }
  if (!block) block = quill.root.lastElementChild;
  if (block) { block.after(node, para); } else { quill.root.append(node, para); }
}

function buildCardNode(url, name) {
  const wrap = document.createElement("div");
  wrap.setAttribute("data-pdf-url", url);
  wrap.setAttribute("data-pdf-name", encodeURIComponent(name));
  wrap.setAttribute("contenteditable", "false");
  wrap.style.cssText = "display:block;width:100%;max-width:500px;border-radius:12px;border:1.5px solid #e5e7eb;background:#f8fafc;margin:1em 0;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;cursor:default;user-select:none;";

  const header = document.createElement("div");
  header.style.cssText = "display:flex;align-items:center;gap:12px;padding:12px 18px;background:#fff;border-bottom:1px solid #e5e7eb;";

  const iconWrap = document.createElement("div");
  iconWrap.style.cssText = "flex-shrink:0;";
  iconWrap.innerHTML = PDF_SVG_STR;

  const info = document.createElement("div");
  info.style.cssText = "flex:1;min-width:0;";
  const nameEl = document.createElement("div");
  nameEl.style.cssText = "font-size:0.875rem;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
  nameEl.textContent = name;
  const sub = document.createElement("div");
  sub.style.cssText = "font-size:0.75rem;color:#6b7280;margin-top:2px;";
  sub.textContent = "PDF Document";
  info.append(nameEl, sub);

  const btn = document.createElement("a");
  btn.href = url;
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.style.cssText = "flex-shrink:0;display:inline-flex;align-items:center;padding:7px 14px;border-radius:8px;background:#0f172a;color:#fff;font-size:0.8rem;font-weight:600;text-decoration:none;white-space:nowrap;";
  btn.textContent = "Open ↗";
  btn.addEventListener("click", (e) => e.stopPropagation());

  header.append(iconWrap, info, btn);

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.cssText = "display:block;width:100%;height:400px;border:none;";

  wrap.append(header, iframe);
  return wrap;
}

function buildEmbedNode(url, name) {
  const wrap = document.createElement("div");
  wrap.setAttribute("data-pdf-url", url);
  wrap.setAttribute("data-pdf-name", encodeURIComponent(name));
  wrap.setAttribute("data-pdf-embed", "true");
  wrap.setAttribute("contenteditable", "false");
  wrap.style.cssText = "display:block;width:100%;border-radius:12px;border:1.5px solid #e5e7eb;background:#f8fafc;margin:1em 0;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;";

  const header = document.createElement("div");
  header.style.cssText = "display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border-bottom:1px solid #e5e7eb;";
  const hIcon = document.createElement("div");
  hIcon.style.cssText = "flex-shrink:0;";
  hIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  const hName = document.createElement("span");
  hName.style.cssText = "flex:1;font-size:0.85rem;font-weight:600;color:#111827;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";
  hName.textContent = name;
  const hBtn = document.createElement("span");
  hBtn.style.cssText = "flex-shrink:0;padding:4px 10px;border-radius:6px;background:#0f172a;color:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;";
  hBtn.textContent = "Open ↗";
  hBtn.addEventListener("click", () => window.open(url, "_blank", "noopener,noreferrer"));
  header.append(hIcon, hName, hBtn);

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.cssText = "display:block;width:100%;height:500px;border:none;";

  wrap.append(header, iframe);
  return wrap;
}

export function QuillEditor({
  defaultValue = "",
  onChange,
  placeholder = "Write your post content here…",
  minHeight = 420,
  onImageUpload,
  onPdfUpload,
}) {
  const wrapperRef       = useRef(null);
  const quillRef         = useRef(null);
  const onChangeRef      = useRef(onChange);
  const onImageUploadRef = useRef(onImageUpload);
  const onPdfUploadRef   = useRef(onPdfUpload);
  const mountedRef       = useRef(false);

  const [sourceMode,   setSourceMode]   = useState(false);
  const [sourceHtml,   setSourceHtml]   = useState("");

  useEffect(() => { onChangeRef.current      = onChange; });
  useEffect(() => { onImageUploadRef.current  = onImageUpload; });
  useEffect(() => { onPdfUploadRef.current    = onPdfUpload; });

  const exitSourceMode = useCallback(() => {
    setSourceMode(false);
    if (quillRef.current) {
      quillRef.current.clipboard.dangerouslyPasteHTML(sourceHtml);
      onChangeRef.current(sourceHtml);
    }
  }, [sourceHtml]);

  useEffect(() => {
    if (mountedRef.current || !wrapperRef.current) return;
    mountedRef.current = true;

    void (async () => {
      const { default: Quill } = await import("quill");

      // ── Register custom PDF Blot ──────────────────────────────────────────
      const BlockEmbed = Quill.import("blots/block/embed");
      class PdfBlot extends BlockEmbed {
        static match(node) {
          return node.hasAttribute?.("data-pdf-url");
        }

        static create(value) {
          const node = super.create();
          const name = value.name || "Document.pdf";
          node.setAttribute("data-pdf-url", value.url);
          node.setAttribute("data-pdf-name", encodeURIComponent(name));
          if (value.isEmbed) node.setAttribute("data-pdf-embed", "true");
          node.setAttribute("contenteditable", "false");

          const inner = value.isEmbed
            ? buildEmbedNode(value.url, name).innerHTML
            : buildCardNode(value.url, name).innerHTML;

          node.innerHTML = inner;
          node.setAttribute("style", value.isEmbed
            ? "display:block;width:100%;border-radius:12px;border:1.5px solid #e5e7eb;background:#f8fafc;margin:1em 0;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;"
            : "display:block;width:100%;max-width:500px;border-radius:12px;border:1.5px solid #e5e7eb;background:#f8fafc;margin:1em 0;box-shadow:0 2px 8px rgba(0,0,0,0.06);overflow:hidden;cursor:default;user-select:none;");

          return node;
        }

        static value(node) {
          return {
            url: node.getAttribute("data-pdf-url"),
            name: decodeURIComponent(node.getAttribute("data-pdf-name") || ""),
            isEmbed: node.hasAttribute("data-pdf-embed"),
          };
        }
      }
      PdfBlot.blotName = "pdf-card";
      PdfBlot.tagName = "div";
      Quill.register(PdfBlot);

      const editorEl = document.createElement("div");
      wrapperRef.current.appendChild(editorEl);

      async function uploadPdf() {
        return new Promise((resolve) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "application/pdf";
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) { resolve(null); return; }
            const uploadFn = onPdfUploadRef.current;
            try {
              if (uploadFn) {
                const r = await uploadFn(file);
                resolve({ url: r.url, name: r.name });
              } else {
                resolve({ url: URL.createObjectURL(file), name: file.name });
              }
            } catch {
              resolve(null);
            }
          };
          input.click();
        });
      }

      const quill = new Quill(editorEl, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ font: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ script: "sub" }, { script: "super" }],
              ["blockquote", "code-block"],
              [{ align: [] }],
              [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["link", "image", "video"],
              ["pdf-insert", "pdf-embed", "table-insert", "html-source"],
              ["clean"],
            ],
            handlers: {
              "image": function () {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml";
                input.click();
                input.onchange = async () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const uploadFn = onImageUploadRef.current;
                  let url;
                  if (uploadFn) {
                    try { url = await uploadFn(file); } catch { return; }
                  } else {
                    url = URL.createObjectURL(file);
                  }
                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, "image", url);
                  quill.setSelection(range.index + 1, 0);
                };
              },
              "video": function () {
                const savedRange = quill.getSelection() ?? { index: quill.getLength(), length: 0 };

                function toEmbedUrl(raw) {
                  const s = raw.trim();
                  if (!s) return null;
                  let m = s.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
                  if (m) return `https://www.youtube.com/embed/${m[1]}`;
                  m = s.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);
                  if (m) return `https://www.youtube.com/embed/${m[1]}`;
                  m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
                  if (m) return `https://player.vimeo.com/video/${m[1]}`;
                  return s;
                }

                const videoBtn = wrapperRef.current?.querySelector(".ql-video");
                if (!videoBtn) return;

                document.querySelector("#ql-video-tooltip")?.remove();

                const tip = document.createElement("div");
                tip.id = "ql-video-tooltip";
                tip.style.cssText = "position:absolute;z-index:1000;background:#fff;border:1.5px solid #e2e8f0;border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,0.13);padding:10px 12px;display:flex;gap:8px;align-items:center;min-width:340px;";

                const inp = document.createElement("input");
                inp.type = "url";
                inp.placeholder = "YouTube / Vimeo URL or direct link…";
                inp.style.cssText = "flex:1;height:34px;border:1.5px solid #e2e8f0;border-radius:7px;padding:0 10px;font-size:13px;outline:none;color:#0f172a;background:#f8fafc;";

                const okBtn = document.createElement("button");
                okBtn.type = "button";
                okBtn.textContent = "Insert";
                okBtn.style.cssText = "height:34px;padding:0 14px;border-radius:7px;background:linear-gradient(135deg,#14B8A6,#6366F1);color:#fff;font-size:13px;font-weight:600;border:none;cursor:pointer;white-space:nowrap;";

                const cancelBtn = document.createElement("button");
                cancelBtn.type = "button";
                cancelBtn.textContent = "✕";
                cancelBtn.style.cssText = "height:34px;width:34px;border-radius:7px;background:#f1f5f9;color:#64748b;font-size:15px;border:none;cursor:pointer;flex-shrink:0;";

                tip.append(inp, okBtn, cancelBtn);

                const btnRect = videoBtn.getBoundingClientRect();
                const wrapRect = wrapperRef.current.getBoundingClientRect();
                tip.style.top = `${btnRect.bottom - wrapRect.top + 6}px`;
                tip.style.left = `${btnRect.left - wrapRect.left}px`;
                wrapperRef.current.style.position = "relative";
                wrapperRef.current.appendChild(tip);
                inp.focus();

                function commit() {
                  const embed = toEmbedUrl(inp.value);
                  tip.remove();
                  if (!embed) return;
                  quill.focus();
                  quill.setSelection(savedRange.index, savedRange.length);
                  quill.insertEmbed(savedRange.index, "video", embed);
                  quill.setSelection(savedRange.index + 1, 0);
                }

                okBtn.addEventListener("click", commit);
                cancelBtn.addEventListener("click", () => tip.remove());
                inp.addEventListener("keydown", (e) => {
                  if (e.key === "Enter") { e.preventDefault(); commit(); }
                  if (e.key === "Escape") tip.remove();
                });

                setTimeout(() => {
                  document.addEventListener("mousedown", function outside(e) {
                    if (!tip.contains(e.target)) { tip.remove(); document.removeEventListener("mousedown", outside); }
                  });
                }, 0);
              },
              "pdf-insert": function () {
                uploadPdf().then((result) => {
                  if (!result) return;
                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, "pdf-card", { url: result.url, name: result.name });
                  quill.setSelection(range.index + 1, 0);
                });
              },
              "pdf-embed": function () {
                uploadPdf().then((result) => {
                  if (!result) return;
                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, "pdf-card", { url: result.url, name: result.name, isEmbed: true });
                  quill.setSelection(range.index + 1, 0);
                });
              },
              "table-insert": function () {
                const rows = parseInt(window.prompt("Rows:", "3") ?? "3") || 3;
                const cols = parseInt(window.prompt("Columns:", "3") ?? "3") || 3;
                const headerRow = `<tr>${Array.from({ length: cols }, () => `<td style="border:1px solid #cbd5e1;padding:6px 10px;background:#1f2937;color:#FF40A0;font-weight:700;">Header</td>`).join("")}</tr>`;
                const bodyRows = Array.from({ length: rows - 1 }, () =>
                  `<tr>${Array.from({ length: cols }, () => `<td style="border:1px solid #cbd5e1;padding:6px 10px;">Cell</td>`).join("")}</tr>`
                ).join("");
                const range = quill.getSelection(true);
                quill.clipboard.dangerouslyPasteHTML(range.index, `<table style="border-collapse:collapse;width:100%;margin:12px 0;"><tbody>${headerRow}${bodyRows}</tbody></table><p><br></p>`);
              },
              "html-source": function () { /* handled via React state */ },
            },
          },
        },
      });

      quillRef.current = quill;

      requestAnimationFrame(() => {
        const toolbar = wrapperRef.current?.querySelector(".ql-toolbar");
        if (!toolbar) return;
        const tip = (el, label) => el && el.setAttribute("data-ql-tip", label);

        const pdfBtn = toolbar.querySelector(".ql-pdf-insert");
        if (pdfBtn) { pdfBtn.innerHTML = PDF_ICON; tip(pdfBtn, "Insert PDF Card"); }

        const embedBtn = toolbar.querySelector(".ql-pdf-embed");
        if (embedBtn) { embedBtn.innerHTML = PDF_EMBED_ICON; tip(embedBtn, "Embed PDF Viewer"); }

        const tableBtn = toolbar.querySelector(".ql-table-insert");
        if (tableBtn) { tableBtn.innerHTML = TABLE_ICON; tip(tableBtn, "Insert Table"); }

        const htmlBtn = toolbar.querySelector(".ql-html-source");
        if (htmlBtn) {
          htmlBtn.innerHTML = HTML_ICON;
          tip(htmlBtn, "HTML Source");
          htmlBtn.addEventListener("click", () => {
            setSourceHtml(quill.root.innerHTML);
            setSourceMode(true);
          });
        }

        const TIPS = {
          ".ql-bold": "Bold (Ctrl+B)", ".ql-italic": "Italic (Ctrl+I)",
          ".ql-underline": "Underline (Ctrl+U)", ".ql-strike": "Strikethrough",
          ".ql-blockquote": "Blockquote", ".ql-code-block": "Code Block",
          ".ql-link": "Insert Link", ".ql-image": "Insert Image", ".ql-video": "Insert Video",
          ".ql-clean": "Clear Formatting", ".ql-header": "Heading", ".ql-size": "Font Size",
          ".ql-font": "Font Family", ".ql-color": "Text Color", ".ql-background": "Highlight Color",
          ".ql-align": "Alignment", ".ql-list[value=ordered]": "Ordered List",
          ".ql-list[value=bullet]": "Bullet List", ".ql-list[value=check]": "Checklist",
          ".ql-indent[value='-1']": "Decrease Indent", ".ql-indent[value='+1']": "Increase Indent",
          ".ql-script[value=sub]": "Subscript", ".ql-script[value=super]": "Superscript",
        };
        Object.entries(TIPS).forEach(([sel, label]) => toolbar.querySelectorAll(sel).forEach((el) => tip(el, label)));
      });

      if (defaultValue) {
        quill.clipboard.dangerouslyPasteHTML(defaultValue);
        quill.setSelection(quill.getLength(), 0);
      }

      editorEl.addEventListener("paste", (e) => {
        const html = e.clipboardData?.getData("text/html") ?? "";
        const text = e.clipboardData?.getData("text/plain") ?? "";

        if (html && html.includes("data-quill")) return;

        e.preventDefault();
        e.stopPropagation();

        const range = quill.getSelection() ?? { index: quill.getLength(), length: 0 };

        if (html) {
          const doc = new DOMParser().parseFromString(html, "text/html");

          const DANGEROUS_TAGS = [
            "script","style","iframe","frame","frameset","object","embed","applet",
            "noscript","base","meta","link","form","input","button","select","textarea",
            "canvas","audio","video","source","track","map","area",
          ];
          doc.querySelectorAll(DANGEROUS_TAGS.join(",")).forEach((el) => el.remove());

          const SAFE_ATTRS = {
            a:   ["href", "title"],
            img: ["src", "alt", "width", "height"],
            td:  ["colspan", "rowspan"],
            th:  ["colspan", "rowspan"],
            col: ["span"],
          };
          doc.body.querySelectorAll("*").forEach((el) => {
            const allowed = SAFE_ATTRS[el.tagName.toLowerCase()] ?? [];
            Array.from(el.attributes).forEach((attr) => {
              if (!allowed.includes(attr.name)) el.removeAttribute(attr.name);
            });
            if (el.tagName === "A") {
              const href = el.href ?? "";
              if (!/^https?:\/\//i.test(href)) el.removeAttribute("href");
              el.setAttribute("rel", "noopener noreferrer");
              el.setAttribute("target", "_blank");
            }
          });

          doc.querySelectorAll("thead").forEach((el) => {
            const tbody = doc.createElement("tbody");
            tbody.innerHTML = el.innerHTML;
            el.replaceWith(tbody);
          });
          doc.querySelectorAll("th").forEach((el) => {
            const td = doc.createElement("td");
            td.innerHTML = el.innerHTML;
            el.replaceWith(td);
          });

          let changed = true;
          while (changed) {
            changed = false;
            doc.body.querySelectorAll("div, section, article, aside, nav, header, footer, main, figure, figcaption").forEach((el) => {
              if (Array.from(el.attributes).some((a) => a.name.startsWith("data-"))) return;
              const parent = el.parentNode;
              if (!parent) return;
              while (el.firstChild) parent.insertBefore(el.firstChild, el);
              el.remove();
              changed = true;
            });
          }

          quill.clipboard.dangerouslyPasteHTML(range.index, doc.body.innerHTML);
          return;
        }

        if (text) {
          const stripped = text
            .split("\n")
            .filter((line) => !/^[\s]*[┌┐└┘├┤┬┴┼─│╌╍╎╏]+/.test(line))
            .filter((line) => !/^BLOC\s+\d+\s*[—–-]/.test(line.trim()))
            .join("\n")
            .trim();

          const paragraphs = stripped
            .split(/\n{2,}/)
            .map((block) => {
              const lines = block.trim();
              if (!lines) return "";
              const quoteLines = lines.split("\n");
              if (quoteLines.every((l) => /^>\s?/.test(l))) {
                const inner = quoteLines
                  .map((l) => l.replace(/^>\s?/, ""))
                  .join("<br>");
                return `<blockquote>${inner}</blockquote>`;
              }
              return `<p>${lines.replace(/\n/g, "<br>")}</p>`;
            })
            .filter(Boolean)
            .join("");

          quill.clipboard.dangerouslyPasteHTML(range.index, paragraphs);
        }
      }, true);

      const observer = new MutationObserver(() => {
        onChangeRef.current(quill.root.innerHTML);
      });
      observer.observe(quill.root, { childList: true, subtree: true, characterData: true });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="quill-admin-editor relative"
      style={{ "--editor-min-height": `${minHeight}px` }}
    >
      {sourceMode && (
        <div className="absolute inset-0 z-10 flex flex-col bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 bg-slate-50">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">HTML Source</span>
            <button type="button" onClick={exitSourceMode} className="rounded bg-teal-500 px-3 py-1 text-xs font-semibold text-white hover:bg-teal-600 transition">
              Apply &amp; Close
            </button>
          </div>
          <textarea
            className="flex-1 resize-none bg-zinc-950 p-4 font-mono text-sm text-green-300 outline-none"
            value={sourceHtml}
            onChange={(e) => setSourceHtml(e.target.value)}
            spellCheck={false}
          />
        </div>
      )}

      <div ref={wrapperRef} />
    </div>
  );
}

export default QuillEditor;
