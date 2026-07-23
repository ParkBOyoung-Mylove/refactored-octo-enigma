import { useState, useEffect, type ReactNode } from 'react';
import { Menu, X, Kanban, Users, Bot, CheckSquare, Search, Home, LogOut, ShieldCheck, User, FileText, BarChart3, Layers, BookOpen, KeyRound, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from './ConfirmModal';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { QuickAdd } from './QuickAdd';
import { NotificationCenter } from './NotificationCenter';

export type ModuleType = 'dashboard' | 'daily' | 'kanban' | 'crm' | 'team' | 'notes' | 'report' | 'copilot' | 'guide';

interface LayoutProps {
  children: ReactNode;
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

export function Layout({ children, activeModule, setActiveModule }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  const { tasks, leads, routines, sharedNotes } = useWorkspace();
  const { user, logout, verifyPinAndLogin, getUserPin, updateUserPin } = useAuth();

  const [switchTargetEmail, setSwitchTargetEmail] = useState<string | null>(null);
  const [switchPinInput, setSwitchPinInput] = useState('');
  const [switchError, setSwitchError] = useState('');

  // Change PIN states
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changePinError, setChangePinError] = useState('');
  const [changePinSuccess, setChangePinSuccess] = useState('');

  const handleRequestSwitch = (targetEmail: string) => {
    if (user?.email === targetEmail) return;
    setSwitchTargetEmail(targetEmail);
    setSwitchPinInput('');
    setSwitchError('');
  };

  const handleConfirmSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!switchTargetEmail) return;
    const res = verifyPinAndLogin(switchTargetEmail, switchPinInput);
    if (res.success) {
      setSwitchTargetEmail(null);
    } else {
      setSwitchError(res.error || 'PIN Salah!');
    }
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError('');
    setChangePinSuccess('');

    if (!user) return;

    const currentPin = getUserPin(user.email);
    if (oldPin !== currentPin) {
      setChangePinError('⛔ PIN Lama yang Anda masukkan salah!');
      return;
    }

    if (!newPin || newPin.length < 4) {
      setChangePinError('PIN Baru minimal 4 - 6 digit angka.');
      return;
    }

    if (newPin !== confirmPin) {
      setChangePinError('Konfirmasi PIN Baru tidak cocok.');
      return;
    }

    updateUserPin(user.email, newPin);
    setChangePinSuccess('✓ PIN Keamanan Anda berhasil diperbarui!');
    setTimeout(() => {
      setIsChangePinOpen(false);
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setChangePinSuccess('');
    }, 1500);
  };
  
  const today = new Date().toISOString().split('T')[0];
  const todayRoutine = routines.find(r => r.date === today && (r.user_id === user?.id || (!r.user_id && user?.id === 'usr-ahnaf')));
  const paretoRemaining = todayRoutine?.morningTasks.filter(t => t.isPareto && !t.completed).length || 0;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  
  const isFollowUpDue = (dateStr: string) => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    return new Date(dateStr) <= d;
  };
  const dueLeads = leads.filter(l => (l.status !== 'Won' && l.status !== 'Lost') && isFollowUpDue(l.nextFollowUp)).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickAddOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Home, badge: 0 },
    { id: 'daily', label: 'Daily Routine (PDCA)', icon: CheckSquare, badge: paretoRemaining },
    { id: 'kanban', label: 'Kanban Tasks', icon: Kanban, badge: inProgressTasks },
    { id: 'crm', label: 'CRM Leads & Quotation', icon: Users, badge: dueLeads },
    { id: 'team', label: 'Kumpulan Tugas Tim', icon: Layers, badge: 0 },
    { id: 'notes', label: 'Catatan Bersama (Wiki)', icon: FileText, badge: sharedNotes.length },
    { id: 'report', label: 'Reporting & Analytics', icon: BarChart3, badge: 0 },
    { id: 'copilot', label: 'AI Copilot Meeting', icon: Bot, badge: 0 },
    { id: 'guide', label: 'Panduan Visual User', icon: BookOpen, badge: 0 },
  ] as const;

  // Live clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = currentTime.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Workspace Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
              A
            </div>
            <div>
              <p className="font-bold text-sm text-slate-100 leading-tight">AndisLab Workspace</p>
              <p className="text-[10px] text-slate-400 font-mono">Enterprise Multi-User V3</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Button */}
        <div className="p-3">
          <button 
            onClick={() => setIsQuickAddOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:text-slate-200 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
              <span>Cari / Quick Add</span>
            </div>
            <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-700">Ctrl+K</kbd>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Modul Utama Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id as ModuleType);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-600/20 to-blue-600/20 border border-indigo-500/40 text-indigo-300 shadow-sm" 
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-extrabold border shrink-0",
                    isActive 
                      ? "bg-indigo-500/30 text-indigo-200 border-indigo-500/40" 
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* User Profile & Team Switcher */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs text-indigo-300 font-bold">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.full_name || 'User'}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  {user?.role === 'superadmin' ? (
                    <span className="text-amber-400 font-extrabold flex items-center gap-0.5"><ShieldCheck className="w-2.5 h-2.5" /> Super Admin (Dev)</span>
                  ) : user?.role === 'admin' ? (
                    <span className="text-purple-400 font-bold flex items-center gap-0.5"><ShieldCheck className="w-2.5 h-2.5" /> Atasan (Admin)</span>
                  ) : (
                    <span className="text-indigo-400 font-bold flex items-center gap-0.5"><User className="w-2.5 h-2.5" /> Staff</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setIsChangePinOpen(true);
                  setOldPin(''); setNewPin(''); setConfirmPin('');
                  setChangePinError(''); setChangePinSuccess('');
                }}
                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Ganti PIN Keamanan Akun"
              >
                <KeyRound className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Keluar (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Switch User */}
          <div className="flex flex-col gap-1 px-1 text-[10px] text-slate-400">
            <span className="text-slate-500 font-semibold uppercase">Switch User Tim:</span>
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              <button
                onClick={() => handleRequestSwitch('ahnaf@andislab.com')}
                className={cn("px-1.5 py-1 rounded text-center truncate font-medium transition-all", user?.email === 'ahnaf@andislab.com' ? "bg-amber-500 text-slate-950 font-extrabold" : "bg-slate-900 text-slate-400 hover:text-slate-200")}
                title="Ahnaf (Programmer & Super Admin)"
              >
                ⚡ Ahnaf
              </button>
              <button
                onClick={() => handleRequestSwitch('kukuh@andislab.com')}
                className={cn("px-1.5 py-1 rounded text-center truncate font-medium transition-all", user?.email === 'kukuh@andislab.com' ? "bg-purple-600 text-white font-bold" : "bg-slate-900 text-slate-400 hover:text-slate-200")}
                title="Mas Kukuh (Manager)"
              >
                M.Kukuh
              </button>
              <button
                onClick={() => handleRequestSwitch('setiyo@andislab.com')}
                className={cn("px-1.5 py-1 rounded text-center truncate font-medium transition-all", user?.email === 'setiyo@andislab.com' ? "bg-emerald-600 text-white font-bold" : "bg-slate-900 text-slate-400 hover:text-slate-200")}
                title="Pak Setiyo (Director)"
              >
                P.Setiyo
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Switch Account PIN Verification Modal */}
      {switchTargetEmail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-indigo-500/40 bg-slate-900 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Beralih Akun Tim</h3>
              <p className="text-xs text-slate-400">
                Masukkan PIN Keamanan untuk beralih ke akun <strong className="text-indigo-300">{switchTargetEmail.split('@')[0].toUpperCase()}</strong>
              </p>
            </div>

            {switchError && (
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
                {switchError}
              </div>
            )}

            <form onSubmit={handleConfirmSwitch} className="space-y-3">
              <input
                type="password"
                maxLength={6}
                value={switchPinInput}
                onChange={(e) => setSwitchPinInput(e.target.value)}
                placeholder="PIN 6-digit"
                autoFocus
                className="w-full text-center tracking-[0.5em] text-lg font-mono py-2 bg-slate-950 border border-indigo-500/50 rounded-xl text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSwitchTargetEmail(null)}
                  className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30"
                >
                  Konfirmasi PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-amber-500/40 bg-slate-900 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex flex-col items-center text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-100">Ganti PIN Keamanan Akun</h3>
              <p className="text-xs text-slate-400">
                Perbarui PIN 6-digit untuk akun <strong className="text-amber-300">{user?.full_name}</strong>
              </p>
            </div>

            {changePinError && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{changePinError}</span>
              </div>
            )}

            {changePinSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-scale-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{changePinSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveNewPin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">PIN Saat Ini (Lama)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  placeholder="******"
                  required
                  className="w-full text-center tracking-[0.5em] text-sm font-mono py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">PIN Baru (4-6 Digit)</label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="******"
                  required
                  className="w-full text-center tracking-[0.5em] text-sm font-mono py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Konfirmasi PIN Baru</label>
                <input
                  type="password"
                  maxLength={6}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="******"
                  required
                  className="w-full text-center tracking-[0.5em] text-sm font-mono py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsChangePinOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-md shadow-amber-500/20"
                >
                  Simpan PIN Baru ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-950">
        <header className="h-16 border-b border-slate-800/80 flex items-center px-4 lg:px-8 justify-between shrink-0 bg-slate-950/90 backdrop-blur-md relative z-40">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 font-medium">
              <span className="text-slate-300">AndisLab</span>
              <span className="text-slate-700">/</span>
              <span className="text-indigo-400 font-bold">
                {navItems.find(item => item.id === activeModule)?.label}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Live Digital Clock Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs shadow-inner">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-slate-400 font-mono hidden md:inline">{dateString} •</span>
              <span className="font-mono font-bold text-amber-300 tracking-wider">{timeString} WIB</span>
            </div>

            <NotificationCenter />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </div>
      </main>

      <QuickAdd isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </div>
  );
}
