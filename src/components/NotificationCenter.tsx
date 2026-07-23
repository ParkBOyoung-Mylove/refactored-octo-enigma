import { useState, useRef, useEffect } from 'react';
import { Bell, Sparkles, MessageSquare, CheckSquare, UserPlus, AlertTriangle } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { cn } from './ConfirmModal';

export function NotificationCenter() {
  const { notifications, markNotificationRead } = useWorkspace();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter notifications for current user or broadcast
  const userNotifs = notifications.filter(n => n.user_id === user?.id || n.user_id === 'all' || !n.user_id);
  const unreadCount = userNotifs.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />;
      case 'review': return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'task_assigned': return <CheckSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'lead_update': return <UserPlus className="w-3.5 h-3.5 text-purple-400" />;
      default: return <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-all"
        title="Notifikasi"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-500 text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-panel rounded-2xl border border-slate-800 shadow-2xl z-50 overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-indigo-400" /> Notifikasi Aktivitas
            </h4>
            {unreadCount > 0 && (
              <span className="text-[10px] text-indigo-300 font-mono bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                {unreadCount} belum dibaca
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {userNotifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                Tidak ada notifikasi baru.
              </div>
            ) : (
              userNotifs.map((notif) => {
                const dateStr = new Date(notif.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn(
                      "p-3 transition-colors cursor-pointer flex gap-3 items-start",
                      notif.is_read ? "bg-slate-950/40 hover:bg-slate-900/40 opacity-70" : "bg-indigo-950/20 hover:bg-indigo-900/30 font-medium"
                    )}
                  >
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs text-slate-200 font-semibold truncate">{notif.title}</p>
                        <span className="text-[9px] text-slate-500 font-mono">{dateStr}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{notif.detail}</p>
                    </div>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
