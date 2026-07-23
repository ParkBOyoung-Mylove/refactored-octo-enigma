import { useState } from 'react';
import { FileText, Plus, Trash2, Calendar, User, Search, Sparkles } from 'lucide-react';
import type { SharedNote } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { ConfirmModal } from '../components/ConfirmModal';

export function SharedNotesModule() {
  const { sharedNotes, addSharedNote, updateSharedNote, deleteSharedNote } = useWorkspace();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<SharedNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const filteredNotes = sharedNotes.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartCreate = () => {
    setTitle('');
    setContent('');
    setActiveNote(null);
    setIsCreating(true);
  };

  const handleStartEdit = (note: SharedNote) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeNote) {
      updateSharedNote({
        ...activeNote,
        title: title.trim(),
        content: content.trim(),
        last_edited_by: user?.id,
        last_edited_by_name: user?.full_name,
        updated_at: new Date().toISOString()
      });
    } else {
      addSharedNote({
        id: `sn-${Date.now()}`,
        title: title.trim(),
        content: content.trim(),
        created_by: user?.id || 'usr-anon',
        created_by_name: user?.full_name || 'User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    setActiveNote(null);
    setIsCreating(false);
  };

  const handleDelete = () => {
    if (noteToDelete) {
      deleteSharedNote(noteToDelete);
      setNoteToDelete(null);
      if (activeNote?.id === noteToDelete) {
        setActiveNote(null);
        setIsCreating(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full font-sans animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Catatan Bersama & Wiki Tim
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
              {sharedNotes.length} Catatan
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Dokumentasi internal, SOP laboratorium, dan catatan kolaboratif tim AndisLab.</p>
        </div>

        <button
          onClick={handleStartCreate}
          className="py-2 px-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Buat Catatan Baru
        </button>
      </div>

      {/* Main Grid View / Editor split */}
      <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Col: Search & Note List */}
        <div className="lg:col-span-1 glass-panel border border-slate-800 rounded-2xl p-4 flex flex-col min-h-0">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul / isi catatan..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 italic">
                Belum ada catatan. Klik tombol di atas untuk membuat catatan baru.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                const updatedDate = new Date(note.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

                return (
                  <div
                    key={note.id}
                    onClick={() => handleStartEdit(note)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500/60 shadow-md"
                        : "glass-card border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-100 line-clamp-1">{note.title}</h4>
                      <button
                        onClick={(e) => { e.stopPropagation(); setNoteToDelete(note.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-opacity"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">{note.content}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                      <span className="flex items-center gap-1"><User className="w-3 h-3 text-slate-400" /> {note.last_edited_by_name || note.created_by_name}</span>
                      <span className="flex items-center gap-1 font-mono"><Calendar className="w-3 h-3 text-slate-400" /> {updatedDate}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 2 Cols: Note Editor or Preview */}
        <div className="lg:col-span-2 glass-panel border border-slate-800 rounded-2xl p-6 flex flex-col min-h-0">
          {isCreating || activeNote ? (
            <form onSubmit={handleSave} className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {isCreating ? 'Membuat Catatan Baru' : 'Mengedit Catatan'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setActiveNote(null); setIsCreating(false); }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul Catatan / SOP..."
                  className="w-full text-base font-bold bg-transparent border-none outline-none text-slate-100 placeholder-slate-500"
                  required
                />
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tuliskan isi catatan, petunjuk teknis, atau instruksi kerja di sini..."
                className="flex-1 w-full p-4 bg-slate-900/60 border border-slate-800 rounded-xl resize-none outline-none focus:border-indigo-500 text-xs text-slate-200 placeholder-slate-500 leading-relaxed font-sans"
              />
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-16">
              <FileText className="w-12 h-12 mb-3 opacity-30 text-indigo-400" />
              <p className="text-xs font-semibold text-slate-300">Pilih catatan dari daftar di kiri atau buat catatan baru.</p>
              <p className="text-[11px] text-slate-500 mt-1">Semua anggota tim dapat membaca & mengedit catatan ini secara bersama-sama.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!noteToDelete}
        title="Hapus Catatan Bersama"
        message="Apakah Anda yakin ingin menghapus catatan ini? Aksi ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setNoteToDelete(null)}
      />
    </div>
  );
}
