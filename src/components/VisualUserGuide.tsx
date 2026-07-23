import { useState } from 'react';
import { Sparkles, CheckSquare, Kanban, Users, BarChart3, ChevronDown, ChevronUp, BookOpen, ShieldCheck } from 'lucide-react';
import { cn } from './ConfirmModal';

export function VisualUserGuide() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: '1. Brief Pagi (Daily Routine & Pareto 80/20)',
      icon: CheckSquare,
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      badge: 'Langkah Awal Setiap Hari',
      description: 'Ahnaf / Tim mengisikan rencana tugas harian di modul Daily Routine. Berikan bintang Pareto (⭐) pada 20% tugas yang berdampak paling tinggi (High Impact).'
    },
    {
      step: 2,
      title: '2. Kanban Task Board (Eksekusi Operasional)',
      icon: Kanban,
      color: 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30',
      badge: 'Alur Kerja Tim',
      description: 'Pindahkan tugas harian ke Kanban dengan 1 klik (Arrow Right). Lacak progres tugas dari Backlog ➔ In Progress ➔ Review ➔ Done.'
    },
    {
      step: 3,
      title: '3. CRM Leads & Quotation Tracker',
      icon: Users,
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
      badge: 'Penjualan & Klien',
      description: 'Catat calon klien alat lab baru. Klik "Detail & Quotation" pada baris lead untuk mencatat log kontak WhatsApp/Visit & membuat penawaran harga resmi (Quotation).'
    },
    {
      step: 4,
      title: '4. Review & Rating Atasan (Mas Kukuh / Pak Setiyo)',
      icon: ShieldCheck,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
      badge: 'Khusus Atasan / Admin',
      description: 'Atasan masuk ke modul Daily Routine ➔ Tab "Review Brief Tim" untuk memeriksa brief Ahnaf, memberikan rating bintang (1-5), dan catatan evaluasi harian.'
    },
    {
      step: 5,
      title: '5. Reporting Hub & Catatan Bersama (Wiki SOP)',
      icon: BarChart3,
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      badge: 'Analitik & Kolaborasi',
      description: 'Buka modul Reporting untuk melihat grafik produktivitas & estimasi quotation otomatis (Harian, Mingguan, Bulanan). Tulis SOP laboratorium di modul Catatan Bersama.'
    }
  ];

  return (
    <div className="glass-panel rounded-3xl border border-indigo-500/30 overflow-hidden shadow-xl bg-gradient-to-r from-slate-900/90 via-indigo-950/20 to-slate-900/90 font-sans">
      {/* Banner Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 px-6 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-inner">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Panduan Visual Cara Penggunaan Workspace
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Workspace Siang 100% Bersih (Clean Slate)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Petunjuk alur kerja interaktif untuk Ahnaf (Sales), Mas Kukuh (Manager), & Pak Setiyo (Director).</p>
          </div>
        </div>

        <button className="p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 pt-2 border-t border-slate-800/80 space-y-5 animate-fade-in">
          {/* Step Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = activeStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={cn(
                    "p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all group",
                    isActive
                      ? "bg-indigo-600/25 border-indigo-500 shadow-md shadow-indigo-600/20 text-indigo-200"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-[10px] font-extrabold px-1.5 py-0.5 rounded border", s.color)}>
                      Langkah {s.step}
                    </span>
                    <Icon className={cn("w-4 h-4", isActive ? "text-indigo-300" : "text-slate-500")} />
                  </div>
                  <p className="text-[11px] font-bold truncate leading-tight">{s.title.split('.')[1]}</p>
                </button>
              );
            })}
          </div>

          {/* Active Step Visual Box */}
          {(() => {
            const currentStepData = steps.find(s => s.step === activeStep)!;
            const Icon = currentStepData.icon;

            return (
              <div className="glass-card p-5 rounded-2xl border border-indigo-500/40 bg-slate-900/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-scale-in">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 mt-0.5", currentStepData.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-200">{currentStepData.title}</span>
                      <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                        {currentStepData.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {activeStep > 1 && (
                    <button
                      onClick={() => setActiveStep(activeStep - 1)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      ← Sebelumnya
                    </button>
                  )}
                  {activeStep < 5 ? (
                    <button
                      onClick={() => setActiveStep(activeStep + 1)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
                    >
                      Langkah Selanjutnya →
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20"
                    >
                      Siap Menggunakan! ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
