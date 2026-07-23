import { useState } from 'react';
import { BookOpen, Sparkles, CheckSquare, Kanban, Users, BarChart3, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../components/ConfirmModal';

export function GuideModule() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: '1. Brief Pagi (Daily Routine & Pareto 80/20)',
      icon: CheckSquare,
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
      badge: 'Langkah Awal Setiap Hari',
      description: 'Ahnaf / Tim mengisikan rencana tugas harian di modul Daily Routine. Berikan bintang Pareto (⭐) pada 20% tugas yang memiliki dampak paling besar (High Impact).'
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
    <div className="flex flex-col h-full font-sans animate-fade-in space-y-6">
      {/* Module Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/30">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-indigo-400" /> Pusat Panduan & SOP
            </span>
            <span className="text-xs text-slate-400 font-mono">Modul Khusus Tutorial</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            Panduan Visual Cara Penggunaan Workspace 📚
          </h1>
          <p className="text-xs text-slate-400 mt-1">Petunjuk lengkap alur kerja, panduan peran pengguna, dan petunjuk penggunaan fitur AndisLab Workspace.</p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
      </div>

      {/* 5-Step Visual Interactive Guide */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 space-y-5 bg-slate-900/60">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Alur Kerja 5 Langkah Utama (Interactive Step-by-Step)
          </h3>
          <span className="text-xs text-slate-400">Pilih langkah di bawah untuk mempelajari</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={cn(
                  "p-3 rounded-xl border text-left flex flex-col justify-between transition-all group",
                  isActive
                    ? "bg-indigo-600/30 border-indigo-500 shadow-lg shadow-indigo-600/20 text-indigo-200 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
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

        {/* Active Step Showcase */}
        {(() => {
          const currentStepData = steps.find(s => s.step === activeStep)!;
          const Icon = currentStepData.icon;

          return (
            <div className="glass-card p-6 rounded-2xl border border-indigo-500/40 bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-scale-in">
              <div className="flex items-start gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 mt-0.5", currentStepData.color)}>
                  <Icon className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-slate-100">{currentStepData.title}</span>
                    <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      {currentStepData.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {activeStep > 1 && (
                  <button
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    ← Langkah Sebelumnya
                  </button>
                )}
                {activeStep < 5 && (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
                  >
                    Langkah Selanjutnya →
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Role-by-Role Guide Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ahnaf Card */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 bg-gradient-to-b from-indigo-950/20 to-slate-900/60">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
                A
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-100">Ahnaf</h4>
                <p className="text-[10px] text-indigo-300 font-medium">Sales & Marketing (Staff)</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">Staff</span>
          </div>

          <p className="text-xs text-slate-400 leading-snug">Panduan tugas harian Ahnaf:</p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Mengisi tugas brief pagi di <strong>Daily Routine</strong> & tandai ⭐ pada tugas Pareto.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Memasukkan prospek calon klien baru di modul <strong>CRM Leads</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Mencatat log kontak WA/Visit & membuat penawaran harga resmi (<strong>Quotation</strong>).</span>
            </li>
          </ul>
        </div>

        {/* Mas Kukuh Card */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 bg-gradient-to-b from-purple-950/20 to-slate-900/60">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-xs">
                K
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-100">Mas Kukuh</h4>
                <p className="text-[10px] text-purple-300 font-medium">Manager Operasional (Admin)</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">Admin</span>
          </div>

          <p className="text-xs text-slate-400 leading-snug">Panduan tanggung jawab Mas Kukuh:</p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Meninjau brief Ahnaf di Daily Routine ➔ Tab <strong>Review Brief Tim</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Memberikan <strong>Rating Bintang (1–5)</strong> & arahan evaluasi harian.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>Mengawasi kelancaran status Kanban produksi & instalasi alat laboratorium.</span>
            </li>
          </ul>
        </div>

        {/* Pak Setiyo Card */}
        <div className="glass-panel border border-slate-800 rounded-2xl p-5 space-y-3 bg-gradient-to-b from-emerald-950/20 to-slate-900/60">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                S
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-100">Pak Setiyo</h4>
                <p className="text-[10px] text-emerald-300 font-medium">Director (Executive Admin)</p>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">Director</span>
          </div>

          <p className="text-xs text-slate-400 leading-snug">Panduan pengawasan Pak Setiyo:</p>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Memantau total estimasi nilai Quotation aktif di Dashboard Overview.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Melihat analitik grafik produktivitas di modul <strong>Reporting Hub</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Meninjau SOP & dokumen strategi di modul <strong>Catatan Bersama</strong>.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
