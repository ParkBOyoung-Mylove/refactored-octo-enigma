import { useState } from 'react';
import { X, Search, CheckSquare, Kanban, Users } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';

interface QuickAddProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAdd({ isOpen, onClose }: QuickAddProps) {
  const { addTask, addLead, routines, saveRoutine } = useWorkspace();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'task' | 'lead' | 'daily'>('task');
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (activeTab === 'task') {
      addTask({
        id: `t-quick-${Date.now()}`,
        title: inputValue,
        assignee: user?.full_name || 'Saya',
        deadline: new Date().toISOString().split('T')[0],
        priority: 'Sedang',
        status: 'Backlog'
      });
    } else if (activeTab === 'lead') {
      addLead({
        id: `l-quick-${Date.now()}`,
        companyName: inputValue,
        contactName: 'N/A',
        contactPhone: '-',
        segment: 'Industri/Manufaktur',
        status: 'New',
        orderType: 'Ready Stock',
        nextFollowUp: new Date().toISOString().split('T')[0]
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      const todayRoutine = routines.find(r => r.date === today && (r.user_id === user?.id || !r.user_id)) || {
        date: today,
        morningTasks: [],
        noonBlockers: '',
        eveningEvaluation: ''
      };
      
      saveRoutine({
        ...todayRoutine,
        morningTasks: [...todayRoutine.morningTasks, {
          id: `dr-quick-${Date.now()}`,
          title: inputValue,
          isPareto: false,
          completed: false
        }]
      });
    }

    setInputValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] p-4 bg-slate-950/70 backdrop-blur-md font-sans">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header Tabs */}
        <div className="flex items-center gap-2 p-2 border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => setActiveTab('task')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'task' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" /> Task Baru
          </button>
          <button
            onClick={() => setActiveTab('lead')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'lead' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Lead Baru
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'daily' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Tugas Harian
          </button>
          
          <button onClick={onClose} className="ml-auto p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-500" />
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                activeTab === 'task' ? 'Ketik nama task baru dan tekan Enter...' :
                activeTab === 'lead' ? 'Ketik nama perusahaan/prospek dan tekan Enter...' :
                'Ketik tugas harian baru dan tekan Enter...'
              }
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-transparent outline-none text-slate-100 placeholder-slate-500"
            />
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex gap-3">
              <span>Tekan <kbd className="font-mono bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-[10px] text-slate-400">Enter</kbd> untuk simpan</span>
              <span>Tekan <kbd className="font-mono bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-[10px] text-slate-400">Esc</kbd> untuk tutup</span>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
