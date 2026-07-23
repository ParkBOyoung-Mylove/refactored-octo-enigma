import { useState, useEffect, type ReactNode } from 'react';
import { Menu, X, Kanban, Users, Bot, CheckSquare, Search, Home, LogOut, ShieldCheck, User, FileText, BarChart3, Layers, BookOpen } from 'lucide-react';
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
  const { user, logout, login } = useAuth();
  
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
                  {user?.role === 'admin' ? (
                    <span className="text-purple-400 font-bold flex items-center gap-0.5"><ShieldCheck className="w-2.5 h-2.5" /> Atasan</span>
                  ) : (
                    <span className="text-indigo-400 font-bold flex items-center gap-0.5"><User className="w-2.5 h-2.5" /> Staff</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Keluar (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Switch User */}
          <div className="flex flex-col gap-1 px-1 text-[10px] text-slate-400">
            <span className="text-slate-500 font-semibold uppercase">Switch User Tim:</span>
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              <button
                onClick={() => login('ahnaf@andislab.com', 'staff')}
                className={cn("px-1.5 py-1 rounded text-center truncate font-medium", user?.email === 'ahnaf@andislab.com' ? "bg-indigo-600 text-white font-bold" : "bg-slate-900 text-slate-400 hover:text-slate-200")}
                title="Ahnaf (Sales)"
              >
                Ahnaf
              </button>
              <button
                onClick={() => login('kukuh@andislab.com', 'admin')}
                className={cn("px-1.5 py-1 rounded text-center truncate font-medium", user?.email === 'kukuh@andislab.com' ? "bg-purple-600 text-white font-bold" : "bg-slate-900 text-slate-400 hover:text-slate-200")}
                title="Mas Kukuh (Manager)"
              >
                M.Kukuh
              </button>
              <button
                onClick={() => login('setiyo@andislab.com', 'admin')}
                className={cn("px-1.5 py-1 rounded text-center truncate font-medium", user?.email === 'setiyo@andislab.com' ? "bg-emerald-600 text-white font-bold" : "bg-slate-900 text-slate-400 hover:text-slate-200")}
                title="Pak Setiyo (Director)"
              >
                P.Setiyo
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-950">
        <header className="h-16 border-b border-slate-800/80 flex items-center px-4 lg:px-8 justify-between shrink-0 bg-slate-950/60 backdrop-blur-md">
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
