import React, { useRef, useState } from 'react';
import {
  Paperclip,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  X,
  RefreshCw,
  UploadCloud,
  FileCheck,
  Eye,
  Trash2,
  Film,
  Plus,
} from 'lucide-react';

export interface FileAttachmentItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: 'image' | 'video' | 'pdf' | 'other';
  previewUrl?: string;
  summary?: string;
}

interface AttachmentPanelProps {
  attachments: FileAttachmentItem[];
  onAddAttachments: (files: File[]) => void;
  onRemoveAttachment: (id: string) => void;
  onReplaceAttachment: (id: string, newFile: File) => void;
  onClearAll: () => void;
}

export const AttachmentPanel: React.FC<AttachmentPanelProps> = ({
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  onReplaceAttachment,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalFile, setPreviewModalFile] = useState<FileAttachmentItem | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileCategory = (type: string, name: string): 'image' | 'video' | 'pdf' | 'other' => {
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) return 'pdf';
    return 'other';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onAddAttachments(filesArray);
      e.target.value = '';
    }
  };

  const handleReplaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (replacingId && e.target.files && e.target.files.length > 0) {
      onReplaceAttachment(replacingId, e.target.files[0]);
      setReplacingId(null);
      e.target.value = '';
    }
  };

  const triggerReplace = (id: string) => {
    setReplacingId(id);
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onAddAttachments(filesArray);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden Native File Inputs for Mobile & Desktop */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/quicktime,video/webm,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/quicktime,video/webm,application/pdf"
        onChange={handleReplaceChange}
        className="hidden"
      />

      {/* Header bar for attachments */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Attached Context & Media
          </span>
          {attachments.length > 0 && (
            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
              {attachments.length} File{attachments.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {attachments.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-4 text-center ${
          isDragging
            ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <UploadCloud className="h-5 w-5 animate-bounce-subtle" />
          </div>

          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-200">
              <span>Drop files here or</span>
              <span className="text-amber-400 underline underline-offset-2 hover:text-amber-300">
                browse files
              </span>
              <span className="text-slate-400 font-normal">(Mobile & Desktop supported)</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ImageIcon className="h-3 w-3 text-cyan-400" /> Images (PNG, JPG, WEBP)
              </span>
              <span className="flex items-center gap-1">
                <VideoIcon className="h-3 w-3 text-pink-400" /> Videos (MP4, MOV, WEBM)
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3 text-emerald-400" /> Documents (PDF)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attached Files Grid */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {attachments.map((item) => {
            const isImage = item.category === 'image';
            const isVideo = item.category === 'video';
            const isPdf = item.category === 'pdf';

            return (
              <div
                key={item.id}
                className="group relative flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-md hover:border-slate-700 transition-all hover:shadow-lg"
              >
                {/* Media Thumbnail or Icon */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
                  {isImage && item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : isVideo && item.previewUrl ? (
                    <div className="relative h-full w-full bg-slate-950 flex items-center justify-center">
                      <video src={item.previewUrl} className="h-full w-full object-cover" />
                      <Film className="absolute h-5 w-5 text-pink-400 drop-shadow-md" />
                    </div>
                  ) : isPdf ? (
                    <FileText className="h-6 w-6 text-emerald-400" />
                  ) : isVideo ? (
                    <VideoIcon className="h-6 w-6 text-pink-400" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-cyan-400" />
                  )}
                </div>

                {/* File Information */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {isPdf ? 'PDF' : isVideo ? 'VIDEO' : isImage ? 'IMAGE' : 'FILE'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatFileSize(item.size)}
                    </span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {item.previewUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewModalFile(item)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                      title="Preview attachment"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => triggerReplace(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                    title="Replace file"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Remove file"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal for Media */}
      {previewModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 truncate">
                <FileCheck className="h-4 w-4 text-amber-400" />
                <h4 className="text-sm font-bold text-slate-100 truncate">
                  {previewModalFile.name}
                </h4>
              </div>
              <button
                onClick={() => setPreviewModalFile(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center items-center max-h-[60vh] overflow-hidden rounded-xl bg-slate-950 p-2">
              {previewModalFile.category === 'image' && previewModalFile.previewUrl && (
                <img
                  src={previewModalFile.previewUrl}
                  alt={previewModalFile.name}
                  className="max-h-[55vh] max-w-full object-contain rounded-lg"
                />
              )}
              {previewModalFile.category === 'video' && previewModalFile.previewUrl && (
                <video
                  src={previewModalFile.previewUrl}
                  controls
                  className="max-h-[55vh] max-w-full rounded-lg"
                />
              )}
              {previewModalFile.category === 'pdf' && (
                <div className="text-center py-12 space-y-3">
                  <FileText className="h-16 w-16 text-emerald-400 mx-auto" />
                  <p className="text-sm text-slate-300 font-semibold">{previewModalFile.name}</p>
                  <p className="text-xs text-slate-400">
                    PDF Document Attached • {formatFileSize(previewModalFile.size)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalFile(null)}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
