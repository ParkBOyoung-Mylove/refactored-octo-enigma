import { useState } from 'react';
import { Filter, CheckCircle2, Clock, Calendar, Kanban } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { cn } from '../components/ConfirmModal';

export function TeamTasksModule() {
  const { tasks } = useWorkspace();
  const [selectedUser, setSelectedUser] = useState<string>('ALL');

  const teamMembers = [
    { name: 'Ahnaf', role: 'Staff (Sales & Marketing)' },
    { name: 'Mas Kukuh', role: 'Manager Operasional' },
    { name: 'Pak Setiyo', role: 'Director' }
  ];

  const filteredTasks = tasks.filter(t => selectedUser === 'ALL' || t.assignee.toLowerCase().includes(selectedUser.toLowerCase()));

  return (
    <div className="flex flex-col h-full font-sans animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Kumpulan Tugas per Anggota Tim
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
              Aggregated View
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Pantau seluruh beban kerja, tugas harian, dan tanggung jawab masing-masing anggota tim.</p>
        </div>

        {/* User Filter Dropdown */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 px-3">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Filter Anggota:</span>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold rounded-lg px-2.5 py-1 outline-none"
          >
            <option value="ALL">Semua Anggota Tim</option>
            <option value="Ahnaf">Ahnaf (Sales & Marketing)</option>
            <option value="Mas Kukuh">Mas Kukuh (Manager)</option>
            <option value="Pak Setiyo">Pak Setiyo (Director)</option>
          </select>
        </div>
      </div>

      {/* Overview Cards by User */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teamMembers.map(member => {
          const memberTasks = tasks.filter(t => t.assignee.toLowerCase().includes(member.name.toLowerCase()));
          const doneCount = memberTasks.filter(t => t.status === 'Done').length;
          const inProgressCount = memberTasks.filter(t => t.status === 'In Progress').length;

          return (
            <div
              key={member.name}
              onClick={() => setSelectedUser(member.name)}
              className={cn(
                "glass-card p-4 rounded-2xl border cursor-pointer transition-all",
                selectedUser === member.name ? "border-indigo-500 shadow-lg shadow-indigo-600/15 bg-indigo-600/10" : "border-slate-800 hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-200 font-bold text-sm">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-100">{member.name}</h4>
                  <p className="text-[10px] text-slate-400">{member.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Selesai: <strong className="text-emerald-400">{doneCount}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>In Progress: <strong className="text-indigo-300">{inProgressCount}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aggregated Tasks Table / List */}
      <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-xs text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Kanban className="w-4 h-4 text-indigo-400" /> Daftar Tugas Kanban yang Di-assign ({filteredTasks.length})
        </h3>

        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">Tidak ada tugas yang sesuai filter anggota tim.</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded border",
                    task.status === 'Done' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    task.status === 'In Progress' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-700'
                  )}>
                    {task.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{task.title}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {task.deadline}
                  </span>
                  <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                    {task.assignee}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
