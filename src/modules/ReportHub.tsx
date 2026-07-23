import { useState } from 'react';
import { BarChart3, CheckCircle2, Star, TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { MiniBarChart } from '../components/MiniChart';
import { cn } from '../components/ConfirmModal';

export function ReportHub() {
  const { tasks, leads, routines, quotations } = useWorkspace();
  const { user } = useAuth();
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const today = new Date().toISOString().split('T')[0];

  // Daily statistics
  const todayRoutine = routines.find(r => r.date === today && (r.user_id === user?.id || (!r.user_id && user?.id === 'usr-ahnaf')));
  const todayParetoDone = todayRoutine?.morningTasks.filter(t => t.isPareto && t.completed).length || 0;
  const todayParetoTotal = todayRoutine?.morningTasks.filter(t => t.isPareto).length || 0;

  // Weekly statistics
  const totalTasksDone = tasks.filter(t => t.status === 'Done').length;
  const totalLeadsWon = leads.filter(l => l.status === 'Won').length;
  const totalPipelineValue = quotations
    .filter(q => q.status === 'Sent' || q.status === 'Accepted')
    .reduce((sum, q) => sum + q.estimated_value, 0);

  // Mock bar chart data for productivity trend
  const weeklyProductivityData = [
    { label: 'Sen', value: 4 },
    { label: 'Sel', value: 6 },
    { label: 'Rab', value: 5 },
    { label: 'Kam', value: 8 },
    { label: 'Jum', value: 7 },
    { label: 'Sab', value: 3 }
  ];

  return (
    <div className="flex flex-col h-full font-sans animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Reporting & Performance Hub
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
              Auto-Generated
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Laporan kinerja tim, statistik Pareto, dan analitik pipeline prospek AndisLab.</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 self-start md:self-auto">
          <button
            onClick={() => setReportPeriod('daily')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              reportPeriod === 'daily' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            📅 Laporan Harian
          </button>
          <button
            onClick={() => setReportPeriod('weekly')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              reportPeriod === 'weekly' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            📆 Laporan Mingguan
          </button>
          <button
            onClick={() => setReportPeriod('monthly')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              reportPeriod === 'monthly' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            📊 Laporan Bulanan
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4 bg-gradient-to-br from-indigo-600/15 to-blue-600/15">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Task Selesai</p>
            <p className="text-2xl font-extrabold text-slate-100">{totalTasksDone}</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4 bg-gradient-to-br from-amber-600/15 to-orange-600/15">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Pareto Completion</p>
            <p className="text-2xl font-extrabold text-amber-400">
              {todayParetoTotal > 0 ? `${Math.round((todayParetoDone / todayParetoTotal) * 100)}%` : '100%'}
            </p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4 bg-gradient-to-br from-emerald-600/15 to-teal-600/15">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Estimasi Quotation Sent</p>
            <p className="text-lg font-extrabold text-emerald-300">
              Rp {(totalPipelineValue / 1000000).toFixed(1)} Juta
            </p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-4 bg-gradient-to-br from-purple-600/15 to-pink-600/15">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase">Prospek Won</p>
            <p className="text-2xl font-extrabold text-purple-300">{totalLeadsWon}</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Report Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Bar Chart */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-2">
              <h3 className="font-bold text-xs text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Grafik Tren Produktivitas Tugas Tim ({reportPeriod === 'daily' ? 'Hari Ini' : reportPeriod === 'weekly' ? 'Minggu Ini' : 'Bulan Ini'})
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +15% dari periode lalu
              </span>
            </div>

            <MiniBarChart data={weeklyProductivityData} height={140} />
          </div>

          {/* Key Accomplishments */}
          <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-xs text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Pencapaian Utama Tim ({reportPeriod.toUpperCase()})
            </h3>

            <div className="space-y-2">
              <div className="glass-card p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Pengiriman Quotation PDAM Tirta Asasta (Rp 87.500.000)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Penawaran lemari asam custom & instalasi exhaust fan PVC telah dikirim oleh Ahnaf.</p>
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Survei Teknis Lab Kimia UI</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Mas Kukuh telah menyelesaikan peninjauan tata letak furniture & spesifikasi glassware.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Team Performance Overview */}
        <div className="lg:col-span-1 glass-panel border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-xs text-slate-100 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> Ringkasan Per Anggota Tim
          </h3>

          <div className="space-y-3">
            {/* Ahnaf */}
            <div className="glass-card p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Ahnaf (Sales & Marketing)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">Staff</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>Tasks Done: <strong className="text-slate-200">6</strong></div>
                <div>Quotations: <strong className="text-slate-200">2 Sent</strong></div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-400">
                <span>Rating Atasan: ★★★★☆ (4.5/5)</span>
              </div>
            </div>

            {/* Mas Kukuh */}
            <div className="glass-card p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Mas Kukuh (Manager Operasional)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">Admin</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>Tasks Reviewed: <strong className="text-slate-200">8</strong></div>
                <div>Supervised: <strong className="text-slate-200">100%</strong></div>
              </div>
            </div>

            {/* Pak Setiyo */}
            <div className="glass-card p-3 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Pak Setiyo (Director)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Director</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>Approval Status: <strong className="text-slate-200">All Clear</strong></div>
                <div>Target Month: <strong className="text-emerald-400">On Track</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
