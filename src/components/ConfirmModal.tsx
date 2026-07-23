import { AlertCircle, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isSuccess?: boolean;
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Ya, Hapus", 
  cancelText = "Batal", 
  isSuccess = false 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md font-sans">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border",
                isSuccess 
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" 
                  : "bg-rose-500/15 border-rose-500/30 text-rose-400"
              )}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">{title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{message}</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-300 hover:bg-slate-800 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="px-6 py-3.5 bg-slate-900/60 flex justify-end gap-2 border-t border-slate-800">
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 bg-slate-800/60 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl transition-all shadow-md",
              isSuccess 
                ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/20" 
                : "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/20"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
