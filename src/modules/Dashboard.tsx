import { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { ActivityLog } from '../components/ActivityLog';
import { CheckCircle2, Circle, Star, Target, Users, Calendar, AlertCircle, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { cn } from '../components/ConfirmModal';

export function Dashboard() {
  const { tasks, leads, routines, saveRoutine, quotations } = useWorkspace();
  const { user } = useAuth();
  
  const today = new Date().toISOString().split('T')[0];
  const todayRoutine = routines.find(r => r.date === today && (r.user_id === user?.id || (!r.user_id && user?.id === 'usr-ahnaf')));
  
  const activeTasks = tasks.filter(t => t.status !== 'Done').length;
  const activeLeads = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length;
  
  const paretoTasks = todayRoutine?.morningTasks.filter(t => t.isPareto) || [];
  const completedPareto = paretoTasks.filter(t => t.completed).length;
  const paretoProgress = paretoTasks.length > 0 ? Math.round((completedPareto / paretoTasks.length) * 100) : 0;

  const totalQuotationVal = quotations
    .filter(q => q.status === 'Sent' || q.status === 'Accepted')
    .reduce((sum, q) => sum + q.estimated_value, 0);

  const formatQuotationValue = (val: number) => {
    if (!val || val === 0) return 'Rp 0';
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} Miliar`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Juta`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const isFollowUpDue = (dateStr: string) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return new Date(dateStr) <= d;
  };

  const dueLeads = leads.filter(l => (l.status !== 'Won' && l.status !== 'Lost') && isFollowUpDue(l.nextFollowUp));

  const toggleParetoTask = (taskId: string) => {
    if (!todayRoutine) return;
    const updatedTasks = todayRoutine.morningTasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveRoutine({ ...todayRoutine, morningTasks: updatedTasks });
  };

  // Live Clock state for banner
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fullDateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const liveTimeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="font-sans animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1">
              {user?.role === 'superadmin' ? (
                <span className="text-amber-400 font-extrabold flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> Akses Master: Lead Programmer & Super Admin ({user.full_name})
                </span>
              ) : user?.role === 'admin' ? (
                <span className="text-purple-300 font-semibold flex items-center gap-1 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                  <ShieldCheck className="w-3 h-3 text-purple-400" /> Akses Atasan ({user.full_name})
                </span>
              ) : (
                <span className="text-indigo-300 font-semibold flex items-center gap-1 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  <Users className="w-3 h-3 text-blue-400" /> Akses Karyawan ({user?.full_name})
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1 bg-slate-900/60 px-2.5 py-0.5 rounded-full border border-slate-800">
              <Calendar className="w-3 h-3 text-indigo-400" /> {fullDateString} • <span className="text-amber-300 font-bold">{liveTimeString} WIB</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            {getGreeting()}, {user?.full_name || 'Tim AndisLab'} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">Ringkasan performa tim, tugas Pareto, dan status penawaran CRM hari ini.</p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-semibold uppercase">Pencapaian Pareto</p>
            <p className="text-xl font-extrabold text-amber-400">{paretoProgress}%</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} title="Tugas Aktif" value={activeTasks} color="from-blue-600/20 to-indigo-600/20" borderColor="border-blue-500/30" textColor="text-blue-400" />
        <StatCard icon={Users} title="Pipeline Prospek" value={activeLeads} color="from-purple-600/20 to-pink-600/20" borderColor="border-purple-500/30" textColor="text-purple-400" />
        <StatCard icon={FileText} title="Nilai Quotation Active" value={formatQuotationValue(totalQuotationVal)} color="from-emerald-600/20 to-teal-600/20" borderColor="border-emerald-500/30" textColor="text-emerald-400" />
        <StatCard icon={AlertCircle} title="Follow-Up Jatuh Tempo" value={dueLeads.length} color={dueLeads.length > 0 ? "from-rose-600/20 to-red-600/20" : "from-slate-800 to-slate-900"} borderColor={dueLeads.length > 0 ? "border-rose-500/40" : "border-slate-800"} textColor={dueLeads.length > 0 ? "text-rose-400" : "text-slate-400"} />
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pareto Tasks & Due Followups */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pareto Tasks Card */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                Fokus Pareto Hari Ini (High Impact)
              </h2>
              <span className="text-xs text-slate-400 font-mono">{completedPareto}/{paretoTasks.length} Selesai</span>
            </div>

            {paretoTasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Belum ada tugas Pareto yang ditandai untuk hari ini di Daily Routine.</p>
            ) : (
              <div className="space-y-2">
                {paretoTasks.map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => toggleParetoTask(task.id)}
                    className="glass-card p-3 rounded-xl border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-indigo-500/40 transition-all"
                  >
                    <button className="text-slate-400 hover:text-indigo-400">
                      {task.completed ? <CheckCircle2 className="w-5 h-5 text-indigo-400" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={cn("text-xs font-medium flex-1", task.completed ? 'text-slate-500 line-through' : 'text-slate-200')}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-Up Due Card */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Prospek Perlu Follow-Up Segera
              </h2>
              <span className="text-xs text-rose-400 font-bold">{dueLeads.length} Prospek</span>
            </div>

            {dueLeads.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">Tidak ada prospek CRM yang jatuh tempo hari ini. Semua aman!</p>
            ) : (
              <div className="space-y-2">
                {dueLeads.map(lead => (
                  <div key={lead.id} className="glass-card p-3 rounded-xl border border-slate-800 flex items-center justify-between hover:border-rose-500/40 transition-all">
                    <div>
                      <h4 className="font-bold text-xs text-slate-100">{lead.companyName}</h4>
                      <p className="text-[11px] text-slate-400">{lead.contactName} • {lead.contactPhone} ({lead.segment})</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                      <Calendar className="w-3.5 h-3.5" />
                      {lead.nextFollowUp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Activity Log Timeline */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl border border-slate-800 p-5 h-full flex flex-col">
            <h2 className="font-bold text-sm text-slate-100 pb-3 border-b border-slate-800 mb-4">
              Aktivitas Terbaru Tim
            </h2>
            <div className="flex-1 overflow-y-auto">
              <ActivityLog />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color, borderColor, textColor }: any) {
  return (
    <div className={cn("glass-card p-4 rounded-2xl border flex items-center gap-4 bg-gradient-to-br transition-all", color, borderColor)}>
      <div className={cn("w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center", textColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-slate-100">{value}</p>
      </div>
    </div>
  );
}
