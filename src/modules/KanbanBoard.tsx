import { useState } from 'react';
import { MoreVertical, User, Plus } from 'lucide-react';
import type { Task, StatusTask, Priority } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { ConfirmModal, cn } from '../components/ConfirmModal';

const COLUMNS: StatusTask[] = ['Backlog', 'In Progress', 'Review', 'Done'];

export function KanbanBoard() {
  const { tasks, updateTaskStatus, deleteTask, addTask } = useWorkspace();
  const { user } = useAuth();

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<StatusTask | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Sedang');

  const moveTask = (taskId: string, newStatus: StatusTask) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleQuickAdd = (status: StatusTask) => {
    if (newTaskTitle.trim()) {
      addTask({
        id: `t-kb-${Date.now()}`,
        title: newTaskTitle.trim(),
        assignee: user?.full_name || 'Saya',
        deadline: new Date().toISOString().split('T')[0],
        priority: newTaskPriority,
        status: status
      });
      setNewTaskTitle('');
      setAddingToColumn(null);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col font-sans animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Kanban Task Board
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
              {tasks.length} Total Task
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Lacak dan koordinasikan alur kerja produksi, pengadaan, dan instalasi tim.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto flex gap-4 pb-4">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column);
          
          return (
            <div 
              key={column} 
              className="w-72 flex-shrink-0 flex flex-col glass-panel p-3 rounded-2xl border border-slate-800"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {column}
                  </span>
                  <span className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {columnTasks.length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {columnTasks.map(task => (
                  <TaskCard 
                    key={task.id}
                    task={task}
                    onMove={(status) => moveTask(task.id, status)}
                    onDelete={() => setTaskToDelete(task.id)}
                  />
                ))}

                {columnTasks.length === 0 && addingToColumn !== column && (
                  <div className="h-20 flex items-center justify-center text-xs text-slate-600 italic border border-dashed border-slate-800 rounded-xl">
                    Kosong
                  </div>
                )}
                
                {addingToColumn === column ? (
                  <div className="glass-card p-3 rounded-xl border border-indigo-500/50 space-y-2 animate-scale-in">
                    <input
                      autoFocus
                      type="text"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleQuickAdd(column);
                        if (e.key === 'Escape') setAddingToColumn(null);
                      }}
                      placeholder="Judul tugas baru..."
                      className="w-full text-xs outline-none bg-transparent text-slate-100 placeholder-slate-500"
                    />
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                        className="bg-slate-900 text-[11px] text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 outline-none"
                      >
                        <option value="Rendah">Rendah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Tinggi">Tinggi</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                      <button
                        onClick={() => handleQuickAdd(column)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setAddingToColumn(column)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 rounded-xl border border-dashed border-slate-800/80 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal 
        isOpen={!!taskToDelete}
        title="Hapus Tugas Kanban"
        message="Apakah Anda yakin ingin menghapus tugas ini? Aksi ini tidak dapat dibatalkan."
        onConfirm={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}

function TaskCard({ task, onMove, onDelete }: { task: Task; onMove: (s: StatusTask) => void; onDelete: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  const priorityBorders: Record<Priority, string> = {
    'Rendah': 'border-l-slate-500',
    'Sedang': 'border-l-blue-500',
    'Tinggi': 'border-l-amber-500',
    'Urgent': 'border-l-rose-500 shadow-rose-900/20'
  };

  const priorityBadges: Record<Priority, string> = {
    'Rendah': 'bg-slate-800 text-slate-400',
    'Sedang': 'bg-blue-500/15 text-blue-300',
    'Tinggi': 'bg-amber-500/15 text-amber-300',
    'Urgent': 'bg-rose-500/15 text-rose-300 font-bold'
  };

  return (
    <div className={cn(
      "glass-card p-3 rounded-xl border border-slate-800 border-l-4 transition-all relative group cursor-pointer hover:border-slate-700",
      priorityBorders[task.priority]
    )}>
      <div className="flex justify-between items-start gap-2 mb-2">
        <h4 className="font-semibold text-xs text-slate-100 leading-snug">{task.title}</h4>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            onBlur={() => setTimeout(() => setShowMenu(false), 200)}
            className="p-1 -mr-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-40 glass-panel rounded-xl shadow-2xl border border-slate-800 py-1 z-30 animate-scale-in">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Pindah ke...
              </div>
              {COLUMNS.filter(c => c !== task.status).map(c => (
                <button
                  key={c}
                  onClick={() => onMove(c)}
                  className="w-full text-left px-3 py-1 text-xs text-slate-200 hover:bg-slate-800 hover:text-indigo-300 transition-colors"
                >
                  {c}
                </button>
              ))}
              <div className="border-t border-slate-800 my-1"></div>
              <button
                onClick={onDelete}
                className="w-full text-left px-3 py-1 text-xs text-rose-400 hover:bg-slate-800 transition-colors"
              >
                Hapus Task
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-3 flex-wrap">
        {task.source && (
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px]">
            {task.source}
          </span>
        )}
        <span className={cn("px-1.5 py-0.5 rounded font-medium text-[10px]", priorityBadges[task.priority])}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1 ml-auto text-slate-400">
          <User className="w-3 h-3 text-slate-500" />
          <span className="truncate max-w-[80px] font-medium">{task.assignee}</span>
        </div>
      </div>
    </div>
  );
}
