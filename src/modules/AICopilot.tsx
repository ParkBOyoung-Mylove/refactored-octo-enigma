import { useState } from 'react';
import { Bot, Check, X, Loader2, Sparkles, UserPlus, CheckSquare } from 'lucide-react';
import type { Task } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';

export function AICopilot() {
  const { addTask, addLead, routines, saveRoutine } = useWorkspace();
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<Task[]>([]);

  const handleGenerate = () => {
    if (!transcript.trim()) return;
    
    setIsGenerating(true);
    setSuggestions([]);
    
    setTimeout(() => {
      setIsGenerating(false);
      setSuggestions([
        {
          id: `ai-${Date.now()}-1`,
          title: 'Follow up penawaran pengadaan alat lab ke departemen QC',
          assignee: 'Tim Sales',
          deadline: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          priority: 'Sedang',
          status: 'Backlog'
        },
        {
          id: `ai-${Date.now()}-2`,
          title: 'Siapkan draft desain Custom Fume Hood untuk project baru',
          assignee: 'Tim Teknisi',
          deadline: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          priority: 'Tinggi',
          status: 'Backlog'
        }
      ]);
    }, 1000);
  };

  const handleApproveAsTask = (taskToApprove: Task) => {
    addTask({ ...taskToApprove, source: 'dari AI' });
    setSuggestions(prev => prev.filter(t => t.id !== taskToApprove.id));
  };

  const handleApproveAsLead = (taskToApprove: Task) => {
    addLead({
      id: `l-ai-${Date.now()}`,
      companyName: taskToApprove.title,
      contactName: 'Dari AI Copilot',
      contactPhone: '-',
      segment: 'Industri/Manufaktur',
      status: 'New',
      orderType: 'Ready Stock',
      nextFollowUp: taskToApprove.deadline
    });
    setSuggestions(prev => prev.filter(t => t.id !== taskToApprove.id));
  };

  const handleApproveAsDaily = (taskToApprove: Task) => {
    const today = new Date().toISOString().split('T')[0];
    const todayRoutine = routines.find(r => r.date === today) || {
      date: today,
      morningTasks: [],
      noonBlockers: '',
      eveningEvaluation: ''
    };
    
    saveRoutine({
      ...todayRoutine,
      morningTasks: [...todayRoutine.morningTasks, {
        id: `dr-ai-${Date.now()}`,
        title: taskToApprove.title,
        isPareto: taskToApprove.priority === 'Tinggi' || taskToApprove.priority === 'Urgent',
        completed: false
      }]
    });
    setSuggestions(prev => prev.filter(t => t.id !== taskToApprove.id));
  };

  const handleReject = (taskId: string) => {
    setSuggestions(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-full font-sans animate-fade-in">
      {/* Input Section */}
      <div className="flex flex-col glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">Meeting AI Copilot</h2>
            <p className="text-xs text-slate-400">Ubah transkrip rapat / notulen menjadi tugas aksi secara otomatis</p>
          </div>
        </div>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Tempelkan hasil transkrip rapat / notulen di sini..."
          className="flex-1 w-full p-4 bg-slate-900/80 border border-slate-800 rounded-xl resize-none focus:outline-none focus:border-indigo-500 mb-4 text-xs text-slate-200 placeholder-slate-500"
        />

        <button
          onClick={handleGenerate}
          disabled={!transcript.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-xl disabled:opacity-50 text-xs shadow-lg shadow-indigo-600/20 transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menganalisis Transkrip...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Actionable Tasks
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="flex flex-col glass-panel rounded-2xl p-6 border border-slate-800 overflow-y-auto">
        <h3 className="font-bold text-sm text-slate-100 mb-4">Draft Tugas Usulan AI</h3>
        
        {suggestions.length === 0 && !isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-12">
            <Bot className="w-12 h-12 mb-3 opacity-30 text-indigo-400" />
            <p className="text-xs">Belum ada usulan tugas. Tempelkan notulen dan klik Generate.</p>
          </div>
        )}

        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id}
              className="glass-card p-4 rounded-xl border border-slate-800 animate-scale-in"
            >
              <div className="flex gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-semibold">
                  {suggestion.priority} Priority
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded font-semibold">
                  {suggestion.assignee}
                </span>
              </div>
              <h4 className="font-semibold text-slate-200 mb-4 text-xs">{suggestion.title}</h4>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(suggestion.id)}
                  className="p-2 border border-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 rounded-xl transition-all"
                  title="Tolak Usulan"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex gap-1.5">
                  <button
                    onClick={() => handleApproveAsTask(suggestion)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                    title="Jadikan Task Kanban"
                  >
                    <Check className="w-3.5 h-3.5" /> Task
                  </button>
                  <button
                    onClick={() => handleApproveAsLead(suggestion)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold transition-all"
                    title="Jadikan Prospek CRM"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-purple-400" /> Lead
                  </button>
                  <button
                    onClick={() => handleApproveAsDaily(suggestion)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold transition-all"
                    title="Tambahkan ke Daily Routine"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-blue-400" /> Daily
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
