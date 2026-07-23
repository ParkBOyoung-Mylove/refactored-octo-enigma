import { useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';

interface CommentsThreadProps {
  entityType: 'task' | 'lead' | 'report' | 'note';
  entityId: string;
  title?: string;
}

export function CommentsThread({ entityType, entityId, title }: CommentsThreadProps) {
  const { comments, addComment } = useWorkspace();
  const { user } = useAuth();
  const [newContent, setNewContent] = useState('');

  const entityComments = comments.filter(c => c.entity_type === entityType && c.entity_id === entityId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    addComment({
      id: `c-${Date.now()}`,
      entity_type: entityType,
      entity_id: entityId,
      user_id: user?.id || 'usr-anon',
      user_name: user?.full_name || 'User',
      content: newContent.trim(),
      created_at: new Date().toISOString()
    });

    setNewContent('');
  };

  return (
    <div className="flex flex-col h-full font-sans space-y-4">
      {title && (
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          {title} ({entityComments.length})
        </h4>
      )}

      {/* List of comments */}
      <div className="flex-1 overflow-y-auto space-y-3 max-h-80 pr-1">
        {entityComments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
            Belum ada catatan/komentar. Jadilah yang pertama memberikan catatan!
          </div>
        ) : (
          entityComments.map((comment) => {
            const dateStr = new Date(comment.created_at).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={comment.id} className="glass-card p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] text-indigo-200 font-bold">
                      {comment.user_name.charAt(0)}
                    </div>
                    {comment.user_name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{dateStr}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap pl-6">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <div className="relative flex-1">
          <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Tulis catatan / komentar..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={!newContent.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20"
          title="Kirim Komentar"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
