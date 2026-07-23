import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, ArrowRight, Sparkles } from 'lucide-react';
import type { UserRole } from '../types';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('ahnaf@andislab.com');
  const [role, setRole] = useState<UserRole>('staff');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await login(email, role);
    setIsSubmitting(false);
  };

  const handleSelectQuickUser = (selectedEmail: string, selectedRole: UserRole) => {
    setEmail(selectedEmail);
    setRole(selectedRole);
    login(selectedEmail, selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative z-10 border border-slate-800 animate-scale-in">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-indigo-500/30">
            A
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AndisLab Workspace</h1>
          <p className="text-xs text-slate-400 mt-1.5">Universal Multi-User Enterprise System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Pengguna</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@andislab.com"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Peran Akses (Role)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  role === 'staff'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Karyawan (Staff)
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  role === 'admin'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Atasan (Admin)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            Masuk ke Workspace <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Akses Cepat Tim AndisLab
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleSelectQuickUser('ahnaf@andislab.com', 'superadmin')}
              className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 border border-amber-500/30 flex items-center justify-between text-xs transition-all shadow-md shadow-amber-500/10"
            >
              <div>
                <p className="font-bold text-amber-300 flex items-center gap-1">
                  ⚡ Ahnaf (Programmer & Super Admin)
                </p>
                <p className="text-[11px] text-slate-400">ahnaf@andislab.com</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/40">Super Admin</span>
            </button>

            <button
              onClick={() => handleSelectQuickUser('kukuh@andislab.com', 'admin')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <p className="font-semibold text-slate-200">Mas Kukuh (Manager Operasional)</p>
                <p className="text-[11px] text-slate-500">kukuh@andislab.com</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium text-[10px]">Admin</span>
            </button>

            <button
              onClick={() => handleSelectQuickUser('setiyo@andislab.com', 'admin')}
              className="w-full text-left p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900 border border-slate-800/60 flex items-center justify-between text-xs transition-colors"
            >
              <div>
                <p className="font-semibold text-slate-200">Pak Setiyo (Director)</p>
                <p className="text-[11px] text-slate-500">setiyo@andislab.com</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium text-[10px]">Director (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

