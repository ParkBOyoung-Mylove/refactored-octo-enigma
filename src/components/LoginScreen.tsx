import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

export function LoginScreen() {
  const { verifyPinAndLogin } = useAuth();
  
  const [selectedEmail, setSelectedEmail] = useState('ahnaf@andislab.com');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const teamMembers = [
    {
      email: 'ahnaf@andislab.com',
      name: 'Ahnaf',
      roleTitle: 'Programmer & Super Admin',
      badge: 'Super Admin',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-extrabold',
      cardBorder: 'border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-indigo-500/10',
      iconColor: 'text-amber-400'
    },
    {
      email: 'kukuh@andislab.com',
      name: 'Mas Kukuh',
      roleTitle: 'Manager Operasional',
      badge: 'Admin',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold',
      cardBorder: 'border-purple-500/30 bg-slate-900/60',
      iconColor: 'text-purple-400'
    },
    {
      email: 'setiyo@andislab.com',
      name: 'Pak Setiyo',
      roleTitle: 'Director & Executive Admin',
      badge: 'Director (Admin)',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
      cardBorder: 'border-emerald-500/30 bg-slate-900/60',
      iconColor: 'text-emerald-400'
    }
  ];

  const handleOpenPinModal = (emailToLogin: string) => {
    setSelectedEmail(emailToLogin);
    setPin('');
    setErrorMessage('');
    setIsPinModalOpen(true);
  };

  const handleVerifyPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pin) {
      setErrorMessage('Masukkan PIN Keamanan akun.');
      return;
    }

    const result = verifyPinAndLogin(selectedEmail, pin);
    if (!result.success) {
      setErrorMessage(result.error || 'PIN Salah!');
    }
  };

  const activeUserObj = teamMembers.find(m => m.email === selectedEmail) || teamMembers[0];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden font-sans">
      {/* Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl relative z-10 border border-slate-800 animate-scale-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-amber-500 flex items-center justify-center text-white font-black text-2xl mb-3 shadow-lg shadow-indigo-500/30">
            A
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AndisLab Workspace</h1>
          <p className="text-xs text-slate-400 mt-1">Portal Autentikasi Tim Enterprise (Secure PIN Protected)</p>
        </div>

        {/* User Account Selection List */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" /> Pilih Akun Pengguna Tim:
          </p>

          {teamMembers.map((member) => (
            <button
              key={member.email}
              onClick={() => handleOpenPinModal(member.email)}
              className={`w-full text-left p-3.5 rounded-2xl border flex items-center justify-between transition-all hover:scale-[1.01] ${member.cardBorder}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-xs">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-100 flex items-center gap-1">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{member.roleTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${member.badgeClass}`}>
                  {member.badge}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Semua akun dilindungi PIN Keamanan 6-digit
          </p>
        </div>
      </div>

      {/* PIN Verification Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-indigo-500/40 bg-slate-900 shadow-2xl relative space-y-4 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Verifikasi PIN Keamanan</h3>
              <p className="text-xs text-slate-400">
                Masukkan PIN untuk akun <strong className="text-indigo-300">{activeUserObj.name}</strong>
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  PIN 6-Digit (Default: <code className="text-amber-400 font-mono">123456</code>)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="******"
                  autoFocus
                  className="w-full text-center tracking-[0.5em] text-lg font-mono py-2.5 bg-slate-950 border border-indigo-500/50 rounded-xl text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="w-1/2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Masuk Sekarang ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
