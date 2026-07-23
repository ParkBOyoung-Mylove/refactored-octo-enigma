import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Star, AlertTriangle, Lightbulb, ArrowRight, Plus, Users, Sparkles, Send, Trash2, RefreshCw } from 'lucide-react';
import type { DailyRoutineTask, DailyRoutine } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/StarRating';
import { ConfirmModal, cn } from '../components/ConfirmModal';

export function DailyRoutineModule() {
  const today = new Date().toISOString().split('T')[0];
  const { routines, saveRoutine: saveRoutineToContext, deleteDailyTask, clearDailyRoutine, reviewDailyRoutine, promoteDailyToKanban } = useWorkspace();
  const { user } = useAuth();

  const [currentRoutine, setCurrentRoutine] = useState<DailyRoutine>({
    date: today,
    morningTasks: [],
    noonBlockers: '',
    eveningEvaluation: ''
  });

  const [activeTab, setActiveTab] = useState<'pagi' | 'siang' | 'sore' | 'tim'>('pagi');
  const [newTaskText, setNewTaskText] = useState('');
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Admin Review Form State
  const [selectedStaffRoutine, setSelectedStaffRoutine] = useState<DailyRoutine | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(4);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  useEffect(() => {
    const existing = routines.find(r => r.date === today && (r.user_id === user?.id || (!r.user_id && user?.id === 'usr-ahnaf')));
    if (existing) {
      setCurrentRoutine(existing);
    } else {
      setCurrentRoutine({
        date: today,
        morningTasks: [],
        noonBlockers: '',
        eveningEvaluation: ''
      });
    }
  }, [routines, today, user]);

  const saveRoutine = (updated: DailyRoutine) => {
    setCurrentRoutine(updated);
    saveRoutineToContext(updated);
  };

  const handleAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskText.trim()) {
      const newTask: DailyRoutineTask = {
        id: `dr-${Date.now()}`,
        title: newTaskText.trim(),
        isPareto: false,
        completed: false
      };
      saveRoutine({
        ...currentRoutine,
        morningTasks: [...currentRoutine.morningTasks, newTask]
      });
      setNewTaskText('');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = currentRoutine.morningTasks.filter(t => t.id !== taskId);
    saveRoutine({ ...currentRoutine, morningTasks: updatedTasks });
    deleteDailyTask(taskId);
  };

  const handleClearRoutine = () => {
    clearDailyRoutine(today);
    setCurrentRoutine({
      date: today,
      morningTasks: [],
      noonBlockers: '',
      eveningEvaluation: ''
    });
    setIsConfirmClearOpen(false);
  };

  const togglePareto = (taskId: string) => {
    const updatedTasks = currentRoutine.morningTasks.map(t => 
      t.id === taskId ? { ...t, isPareto: !t.isPareto } : t
    );
    saveRoutine({ ...currentRoutine, morningTasks: updatedTasks });
  };

  const toggleComplete = (taskId: string) => {
    const updatedTasks = currentRoutine.morningTasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveRoutine({ ...currentRoutine, morningTasks: updatedTasks });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffRoutine || !reviewFeedback.trim()) return;

    reviewDailyRoutine(
      selectedStaffRoutine.user_id || 'usr-ahnaf',
      reviewFeedback.trim(),
      reviewRating
    );

    setSelectedStaffRoutine(null);
    setReviewFeedback('');
  };

  const completedParetoCount = currentRoutine.morningTasks.filter(t => t.isPareto && t.completed).length;
  const totalParetoCount = currentRoutine.morningTasks.filter(t => t.isPareto).length;

  // Filter team routines for Admin view
  const teamRoutines = routines.filter(r => r.date === today);

  return (
    <div className="max-w-4xl mx-auto font-sans animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 mb-1">Daily Routine & Pareto 80/20</h1>
          <p className="text-xs text-slate-400">
            Kerangka Kerja PDCA (Plan-Do-Check-Act) Tim AndisLab • {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {currentRoutine.morningTasks.length > 0 && (
          <button
            onClick={() => setIsConfirmClearOpen(true)}
            className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Reset / Hapus Brief Hari Ini"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Brief Hari Ini
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('pagi')}
          className={cn(
            "pb-3 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2",
            activeTab === 'pagi' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          )}
        >
          Brief Pagi (Plan)
        </button>
        <button 
          onClick={() => setActiveTab('siang')}
          className={cn(
            "pb-3 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2",
            activeTab === 'siang' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          )}
        >
          Review Siang (Check)
        </button>
        <button 
          onClick={() => setActiveTab('sore')}
          className={cn(
            "pb-3 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2",
            activeTab === 'sore' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          )}
        >
          Evaluasi Sore (Act)
        </button>
        {isAdmin && (
          <button 
            onClick={() => setActiveTab('tim')}
            className={cn(
              "pb-3 px-4 text-xs font-semibold transition-all border-b-2 flex items-center gap-2 text-purple-300",
              activeTab === 'tim' ? 'border-purple-500 text-purple-300 bg-purple-500/10' : 'border-transparent text-purple-400/70 hover:text-purple-200'
            )}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" /> Review Brief Tim (Admin)
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* === PAGI === */}
        {activeTab === 'pagi' && (
          <div className="animate-fade-in space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-1">Prinsip Pareto (80/20 Rule) — {user?.full_name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tuliskan rencana tugas Anda hari ini. Berikan bintang (<Star className="w-3 h-3 text-amber-400 inline" />) pada 20% tugas yang memiliki dampak terbesar (High Impact).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {currentRoutine.morningTasks.map(task => (
                <div key={task.id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center gap-3 group">
                  <button onClick={() => toggleComplete(task.id)} className="text-slate-400 hover:text-indigo-400 transition-colors">
                    {task.completed ? <CheckCircle2 className="w-5 h-5 text-indigo-400" /> : <Circle className="w-5 h-5" />}
                  </button>

                  <span className={cn("flex-1 text-xs font-medium", task.completed ? 'text-slate-500 line-through' : 'text-slate-200')}>
                    {task.title}
                  </span>

                  <button 
                    onClick={() => togglePareto(task.id)}
                    className={cn(
                      "p-1.5 rounded-lg border transition-all",
                      task.isPareto ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/20' : 'text-slate-600 border-transparent group-hover:text-slate-400 hover:bg-slate-800'
                    )}
                    title="Tandai Pareto (High Impact)"
                  >
                    <Star className={cn("w-3.5 h-3.5", task.isPareto ? "fill-current" : "")} />
                  </button>

                  <button
                    onClick={() => promoteDailyToKanban(task)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Kirim Tugas ke Kanban Board"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Hapus Tugas Routine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {currentRoutine.morningTasks.length === 0 && (
                <div className="h-24 flex flex-col items-center justify-center text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                  Belum ada tugas rutin untuk hari ini. Tambahkan di bawah.
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 p-3 glass-panel rounded-xl border border-slate-800/80">
              <Plus className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={handleAddTask}
                placeholder="Ketik tugas harian baru dan tekan Enter..."
                className="flex-1 bg-transparent border-none outline-none text-xs text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>
        )}

        {/* === SIANG === */}
        {activeTab === 'siang' && (
          <div className="animate-fade-in space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-1">Check Blockers Tengah Hari</h3>
                <p className="text-xs text-slate-400">Evaluasi apakah ada hambatan teknis, stok, atau kendala komunikasi yang menghalangi pencapaian tugas Pareto Anda.</p>
              </div>
            </div>

            <h4 className="font-bold text-xs text-slate-300">Tugas Pareto Hari Ini:</h4>
            <div className="space-y-2">
              {currentRoutine.morningTasks.filter(t => t.isPareto).length === 0 ? (
                <p className="text-xs text-slate-500 italic">Belum ada tugas Pareto yang ditandai pagi ini.</p>
              ) : (
                currentRoutine.morningTasks.filter(t => t.isPareto).map(task => (
                  <div key={task.id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                    <button onClick={() => toggleComplete(task.id)} className="text-slate-400">
                      {task.completed ? <CheckCircle2 className="w-5 h-5 text-indigo-400" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={cn("text-xs font-medium flex-1", task.completed ? 'text-slate-500 line-through' : 'text-slate-200')}>
                      {task.title}
                    </span>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-slate-500 hover:text-rose-400 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <h4 className="font-bold text-xs text-slate-300 pt-2">Catatan Blocker & Kendala</h4>
            <textarea
              value={currentRoutine.noonBlockers}
              onChange={(e) => saveRoutine({ ...currentRoutine, noonBlockers: e.target.value })}
              placeholder="Tuliskan kendala teknis / koordinasi di sini..."
              className="w-full h-32 p-3 bg-slate-900/80 border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-xs text-slate-200 placeholder-slate-500 resize-none"
            />
          </div>
        )}

        {/* === SORE === */}
        {activeTab === 'sore' && (
          <div className="animate-fade-in space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-1">Evaluasi & Refleksi Sore</h3>
                <p className="text-xs text-slate-400">Catat pencapaian dan hal yang perlu disesuaikan untuk strategi kerja besok.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-extrabold text-slate-100">
                  {currentRoutine.morningTasks.filter(t => t.completed).length} / {currentRoutine.morningTasks.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Total Tugas Selesai</div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 text-center">
                <div className="text-3xl font-extrabold text-amber-400">
                  {completedParetoCount} / {totalParetoCount}
                </div>
                <div className="text-xs text-slate-400 mt-1">Tugas Pareto Selesai</div>
              </div>
            </div>

            {/* Display Supervisor Feedback if available */}
            {currentRoutine.supervisor_feedback && (
              <div className="glass-panel p-4 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Review & Rating dari Atasan ({currentRoutine.reviewed_by_name || 'Mas Kukuh'})
                  </span>
                  <StarRating value={currentRoutine.supervisor_rating || 5} readOnly size="sm" />
                </div>
                <p className="text-xs text-slate-200 leading-snug">{currentRoutine.supervisor_feedback}</p>
              </div>
            )}

            <h4 className="font-bold text-xs text-slate-300 pt-2">Refleksi & Rencana Penyesuaian Besok</h4>
            <textarea
              value={currentRoutine.eveningEvaluation}
              onChange={(e) => saveRoutine({ ...currentRoutine, eveningEvaluation: e.target.value })}
              placeholder="Apa yang berjalan baik hari ini? Apa yang perlu diperbaiki esok?"
              className="w-full h-36 p-3 bg-slate-900/80 border border-slate-800 rounded-xl outline-none focus:border-indigo-500 text-xs text-slate-200 placeholder-slate-500 resize-none"
            />
          </div>
        )}

        {/* === TAB ADMIN: REVIEW TIM === */}
        {activeTab === 'tim' && isAdmin && (
          <div className="animate-fade-in space-y-4">
            <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 flex items-start gap-3">
              <Users className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-1">Evaluasi & Review Daily Tim — {user?.full_name}</h3>
                <p className="text-xs text-slate-400">Sebagai atasan (Mas Kukuh / Pak Setiyo), Anda dapat meninjau brief harian staff, memberi catatan evaluasi, dan rating bintang.</p>
              </div>
            </div>

            {/* Dynamic Team Members Brief Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ahnaf Card */}
              {(() => {
                const ahnafRoutine = teamRoutines.find(r => r.user_id === 'usr-ahnaf' || !r.user_id);
                const paretoTasksList = ahnafRoutine?.morningTasks.filter(t => t.isPareto) || [];

                return (
                  <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-slate-100">Ahnaf (Sales & Marketing)</h4>
                        <p className="text-[10px] text-slate-400">Brief Hari Ini: {today}</p>
                      </div>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-semibold border",
                        ahnafRoutine?.morningTasks.length ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-slate-800 text-slate-400 border-slate-700"
                      )}>
                        {ahnafRoutine?.morningTasks.length ? "Brief Active" : "Belum Brief"}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 border-t border-slate-800/80 pt-2">
                      <p className="font-semibold text-slate-400 text-[11px]">Tugas Pareto Pagi:</p>
                      {paretoTasksList.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">Belum ada tugas Pareto yang dibuat.</p>
                      ) : (
                        <ul className="list-disc list-inside space-y-0.5 text-slate-200">
                          {paretoTasksList.map(t => (
                            <li key={t.id}>{t.title} {t.completed ? '(✅ Selesai)' : ''}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedStaffRoutine(ahnafRoutine || {
                          user_id: 'usr-ahnaf',
                          user_name: 'Ahnaf',
                          date: today,
                          morningTasks: [],
                          noonBlockers: '',
                          eveningEvaluation: ''
                        });
                        setReviewFeedback(ahnafRoutine?.supervisor_feedback || 'Kinerja hari ini cukup baik dan fokus.');
                        setReviewRating(ahnafRoutine?.supervisor_rating || 4);
                      }}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Beri Evaluasi & Rating
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Review Form Modal */}
            {selectedStaffRoutine && (
              <form onSubmit={handleReviewSubmit} className="glass-panel p-5 rounded-2xl border border-purple-500/50 space-y-3 animate-scale-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Form Review Atasan untuk {selectedStaffRoutine.user_name || 'Staff'}
                  </h4>
                  <button type="button" onClick={() => setSelectedStaffRoutine(null)} className="text-slate-400 hover:text-slate-200 text-xs">Batal</button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Beri Rating Kinerja Hari Ini</label>
                  <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Evaluasi / Arahan Atasan *</label>
                  <textarea
                    value={reviewFeedback}
                    onChange={(e) => setReviewFeedback(e.target.value)}
                    placeholder="Tuliskan arahan, pujian, atau poin perbaikan untuk staff..."
                    rows={3}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim Review ke Staff
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title="Reset Brief Hari Ini"
        message="Apakah Anda yakin ingin menghapus seluruh tugas brief harian untuk hari ini?"
        onConfirm={handleClearRoutine}
        onCancel={() => setIsConfirmClearOpen(false)}
      />
    </div>
  );
}
