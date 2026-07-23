import { createContext, useContext, type ReactNode, useState, useEffect, useCallback } from 'react';
import type {
  Task, Lead, DailyRoutine, ActivityEntry, ActivityAction, StatusTask, StatusCRM, DailyRoutineTask,
  ContactLog, Quotation, QuotationStatus, Comment, SharedNote, Notification
} from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

const INITIAL_TASKS: Task[] = [];
const INITIAL_LEADS: Lead[] = [];
const INITIAL_CONTACT_LOGS: ContactLog[] = [];
const INITIAL_QUOTATIONS: Quotation[] = [];
const INITIAL_NOTES: SharedNote[] = [];
const INITIAL_NOTIFICATIONS: Notification[] = [];

interface WorkspaceContextType {
  tasks: Task[];
  leads: Lead[];
  routines: DailyRoutine[];
  activityLog: ActivityEntry[];
  contactLogs: ContactLog[];
  quotations: Quotation[];
  comments: Comment[];
  sharedNotes: SharedNote[];
  notifications: Notification[];
  
  // Task Actions
  addTask: (task: Task) => Promise<void>;
  updateTaskStatus: (id: string, status: StatusTask) => Promise<void>;
  updateTask: (updatedTask: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Lead Actions
  addLead: (lead: Lead) => Promise<void>;
  updateLeadStatus: (id: string, status: StatusCRM) => Promise<void>;
  updateLead: (updatedLead: Lead) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  // Contact & Quotation Actions
  addContactLog: (log: ContactLog) => void;
  addQuotation: (quotation: Quotation) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
  
  // Comments & Shared Notes
  addComment: (comment: Comment) => void;
  addSharedNote: (note: SharedNote) => void;
  updateSharedNote: (note: SharedNote) => void;
  deleteSharedNote: (id: string) => void;
  
  // Routine Actions
  saveRoutine: (routine: DailyRoutine) => Promise<void>;
  deleteDailyTask: (taskId: string) => Promise<void>;
  clearDailyRoutine: (date: string) => Promise<void>;
  reviewDailyRoutine: (routineId: string, feedback: string, rating: number) => Promise<void>;
  promoteDailyToKanban: (dailyTask: DailyRoutineTask) => Promise<void>;
  
  // Notification Actions
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Notification) => void;
  
  // Activity Action
  logActivity: (action: ActivityAction, detail: string) => void;

  // Total Reset Action
  resetTotalWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Dummy Data Patterns to Purge Completely
const DUMMY_PATTERNS = [
  'quo-1', 't-1', 't-2', 't-3', 'l-1', 'l-2', 'cl-1', 'sn-1', 'notif-1',
  'Andis', 'Universitas Indonesia', 'PDAM', 'Pyrex', 'Kimia Farma',
  'Fume Hood', 'Lemari Asam', 'Standard Operating Procedure', 'SOP'
];

const isDummyDataStr = (str: string | null) => {
  if (!str) return false;
  return DUMMY_PATTERNS.some(pat => str.toLowerCase().includes(pat.toLowerCase()));
};

// Forcefully clear all legacy dummy keys from localStorage
if (typeof window !== 'undefined') {
  [
    'andislab_quotations', 'andislab_tasks', 'andislab_leads',
    'andislab_activities', 'andislab_contact_logs', 'andislab_daily',
    'andislab_comments', 'andislab_shared_notes', 'andislab_notifications'
  ].forEach(key => {
    const dataStr = localStorage.getItem(key);
    if (isDummyDataStr(dataStr)) {
      localStorage.removeItem(key);
    }
  });
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('andislab_tasks');
    if (!saved || isDummyDataStr(saved)) return INITIAL_TASKS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(t => !isDummyDataStr(JSON.stringify(t))) : INITIAL_TASKS;
    } catch { return INITIAL_TASKS; }
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('andislab_leads');
    if (!saved || isDummyDataStr(saved)) return INITIAL_LEADS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(l => !isDummyDataStr(JSON.stringify(l))) : INITIAL_LEADS;
    } catch { return INITIAL_LEADS; }
  });

  const [routines, setRoutines] = useState<DailyRoutine[]>(() => {
    const saved = localStorage.getItem('andislab_daily');
    if (!saved || isDummyDataStr(saved)) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(r => !isDummyDataStr(JSON.stringify(r))) : [];
    } catch { return []; }
  });

  const [activityLog, setActivityLog] = useState<ActivityEntry[]>(() => {
    const saved = localStorage.getItem('andislab_activities');
    if (!saved || isDummyDataStr(saved)) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(a => !isDummyDataStr(JSON.stringify(a))) : [];
    } catch { return []; }
  });

  const [contactLogs, setContactLogs] = useState<ContactLog[]>(() => {
    const saved = localStorage.getItem('andislab_contact_logs');
    if (!saved || isDummyDataStr(saved)) return INITIAL_CONTACT_LOGS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(c => !isDummyDataStr(JSON.stringify(c))) : INITIAL_CONTACT_LOGS;
    } catch { return INITIAL_CONTACT_LOGS; }
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('andislab_quotations');
    if (!saved || isDummyDataStr(saved)) return INITIAL_QUOTATIONS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(q => !isDummyDataStr(JSON.stringify(q))) : INITIAL_QUOTATIONS;
    } catch { return INITIAL_QUOTATIONS; }
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('andislab_comments');
    if (!saved || isDummyDataStr(saved)) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(c => !isDummyDataStr(JSON.stringify(c))) : [];
    } catch { return []; }
  });

  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>(() => {
    const saved = localStorage.getItem('andislab_shared_notes');
    if (!saved || isDummyDataStr(saved)) return INITIAL_NOTES;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(n => !isDummyDataStr(JSON.stringify(n))) : INITIAL_NOTES;
    } catch { return INITIAL_NOTES; }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('andislab_notifications');
    if (!saved || isDummyDataStr(saved)) return INITIAL_NOTIFICATIONS;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter(n => !isDummyDataStr(JSON.stringify(n))) : INITIAL_NOTIFICATIONS;
    } catch { return INITIAL_NOTIFICATIONS; }
  });

  // Offline Cache Sync
  useEffect(() => { localStorage.setItem('andislab_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('andislab_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('andislab_daily', JSON.stringify(routines)); }, [routines]);
  useEffect(() => { localStorage.setItem('andislab_activities', JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { localStorage.setItem('andislab_contact_logs', JSON.stringify(contactLogs)); }, [contactLogs]);
  useEffect(() => { localStorage.setItem('andislab_quotations', JSON.stringify(quotations)); }, [quotations]);
  useEffect(() => { localStorage.setItem('andislab_comments', JSON.stringify(comments)); }, [comments]);
  useEffect(() => { localStorage.setItem('andislab_shared_notes', JSON.stringify(sharedNotes)); }, [sharedNotes]);
  useEffect(() => { localStorage.setItem('andislab_notifications', JSON.stringify(notifications)); }, [notifications]);

  // Realtime Supabase fetch if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchAllData = async () => {
      const { data: dbTasks } = await supabase.from('tasks').select('*');
      if (dbTasks && dbTasks.length > 0) setTasks(dbTasks);

      const { data: dbLeads } = await supabase.from('leads').select('*');
      if (dbLeads && dbLeads.length > 0) setLeads(dbLeads);

      const { data: dbActivities } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(50);
      if (dbActivities && dbActivities.length > 0) {
        setActivityLog(dbActivities.map(a => ({
          id: a.id,
          timestamp: a.created_at,
          action: a.action as ActivityAction,
          detail: a.detail,
          user_id: a.user_id,
          user_name: a.user_name
        })));
      }
    };

    fetchAllData();

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => fetchAllData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_log' }, () => fetchAllData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const logActivity = useCallback((action: ActivityAction, detail: string) => {
    const newEntry: ActivityEntry = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      detail,
      user_id: user?.id,
      user_name: user?.full_name || 'System'
    };

    setActivityLog(prev => [newEntry, ...prev].slice(0, 50));

    if (isSupabaseConfigured) {
      supabase.from('activity_log').insert({
        user_id: user?.id,
        user_name: user?.full_name || 'System',
        action,
        detail
      }).then();
    }
  }, [user]);

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  // --- Task Actions ---
  const addTask = async (task: Task) => {
    const taskWithMeta: Task = {
      ...task,
      created_by: user?.id,
      assignee_name: task.assignee
    };

    setTasks(prev => [...prev, taskWithMeta]);
    logActivity('CREATE_TASK', `Tugas ditambahkan oleh ${user?.full_name || 'Pengguna'}: ${task.title}`);

    if (isSupabaseConfigured) {
      await supabase.from('tasks').insert({
        title: task.title,
        assignee_name: task.assignee,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        source: task.source,
        created_by: user?.id
      });
    }
  };

  const updateTaskStatus = async (id: string, status: StatusTask) => {
    const targetTask = tasks.find(t => t.id === id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));

    if (targetTask && targetTask.status !== status) {
      logActivity('UPDATE_TASK', `Tugas "${targetTask.title}" dipindah ke status ${status}`);
    }

    if (isSupabaseConfigured) {
      await supabase.from('tasks').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    logActivity('UPDATE_TASK', `Tugas "${updatedTask.title}" diperbarui`);

    if (isSupabaseConfigured) {
      await supabase.from('tasks').update({
        title: updatedTask.title,
        assignee_name: updatedTask.assignee,
        deadline: updatedTask.deadline,
        priority: updatedTask.priority,
        status: updatedTask.status,
        updated_at: new Date().toISOString()
      }).eq('id', updatedTask.id);
    }
  };

  const deleteTask = async (id: string) => {
    const targetTask = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));

    if (targetTask) {
      logActivity('DELETE_TASK', `Tugas dihapus oleh ${user?.full_name}: ${targetTask.title}`);
    }

    if (isSupabaseConfigured) {
      await supabase.from('tasks').delete().eq('id', id);
    }
  };

  // --- Lead Actions ---
  const addLead = async (lead: Lead) => {
    const leadWithMeta: Lead = {
      ...lead,
      created_by: user?.id
    };

    setLeads(prev => [...prev, leadWithMeta]);
    logActivity('CREATE_LEAD', `Prospek CRM baru ditambahkan: ${lead.companyName}`);

    if (isSupabaseConfigured) {
      await supabase.from('leads').insert({
        company_name: lead.companyName,
        contact_name: lead.contactName,
        contact_phone: lead.contactPhone,
        segment: lead.segment,
        status: lead.status,
        order_type: lead.orderType,
        next_follow_up: lead.nextFollowUp,
        notes: lead.notes,
        created_by: user?.id
      });
    }
  };

  const updateLeadStatus = async (id: string, status: StatusCRM) => {
    const targetLead = leads.find(l => l.id === id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));

    if (targetLead && targetLead.status !== status) {
      logActivity('UPDATE_LEAD', `Status prospek "${targetLead.companyName}" diubah ke ${status}`);
    }

    if (isSupabaseConfigured) {
      await supabase.from('leads').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    }
  };

  const updateLead = async (updatedLead: Lead) => {
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    logActivity('UPDATE_LEAD', `Data prospek "${updatedLead.companyName}" diperbarui`);

    if (isSupabaseConfigured) {
      await supabase.from('leads').update({
        company_name: updatedLead.companyName,
        contact_name: updatedLead.contactName,
        contact_phone: updatedLead.contactPhone,
        segment: updatedLead.segment,
        status: updatedLead.status,
        order_type: updatedLead.orderType,
        next_follow_up: updatedLead.nextFollowUp,
        notes: updatedLead.notes,
        updated_at: new Date().toISOString()
      }).eq('id', updatedLead.id);
    }
  };

  const deleteLead = async (id: string) => {
    const targetLead = leads.find(l => l.id === id);
    setLeads(prev => prev.filter(l => l.id !== id));

    if (targetLead) {
      logActivity('DELETE_LEAD', `Prospek dihapus: ${targetLead.companyName}`);
    }

    if (isSupabaseConfigured) {
      await supabase.from('leads').delete().eq('id', id);
    }
  };

  // --- Contact Logs & Quotation Actions ---
  const addContactLog = (log: ContactLog) => {
    setContactLogs(prev => [log, ...prev]);
    logActivity('ADD_CONTACT_LOG', `Log kontak ${log.method} ditambahkan untuk lead`);
  };

  const addQuotation = (quotation: Quotation) => {
    setQuotations(prev => [quotation, ...prev]);
    logActivity('CREATE_QUOTATION', `Quotation baru ${quotation.quote_number} dibuat (Rp ${quotation.estimated_value.toLocaleString('id-ID')})`);
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status, updated_at: new Date().toISOString() } : q));
    logActivity('UPDATE_QUOTATION', `Status quotation diubah menjadi ${status}`);
  };

  // --- Comments & Shared Notes ---
  const addComment = (comment: Comment) => {
    setComments(prev => [...prev, comment]);
    logActivity('ADD_COMMENT', `Komentar baru oleh ${comment.user_name}`);
  };

  const addSharedNote = (note: SharedNote) => {
    setSharedNotes(prev => [note, ...prev]);
    logActivity('SAVE_NOTE', `Catatan bersama baru dibuat: ${note.title}`);
  };

  const updateSharedNote = (note: SharedNote) => {
    setSharedNotes(prev => prev.map(n => n.id === note.id ? note : n));
    logActivity('SAVE_NOTE', `Catatan bersama diperbarui: ${note.title}`);
  };

  const deleteSharedNote = (id: string) => {
    setSharedNotes(prev => prev.filter(n => n.id !== id));
  };

  // --- Routine Actions ---
  const saveRoutine = async (routine: DailyRoutine) => {
    setRoutines(prev => {
      const idx = prev.findIndex(r => r.date === routine.date && (r.user_id === user?.id || (!r.user_id && user?.id === 'usr-ahnaf')));
      if (idx >= 0) {
        const newArr = [...prev];
        newArr[idx] = { ...routine, user_id: user?.id, user_name: user?.full_name };
        return newArr;
      }
      return [...prev, { ...routine, user_id: user?.id, user_name: user?.full_name }];
    });
  };

  const deleteDailyTask = async (taskId: string) => {
    setRoutines(prev => prev.map(r => ({
      ...r,
      morningTasks: r.morningTasks.filter(t => t.id !== taskId)
    })));
    logActivity('DAILY_ROUTINE', 'Tugas rutin harian dihapus');
  };

  const clearDailyRoutine = async (date: string) => {
    setRoutines(prev => prev.filter(r => !(r.date === date && (r.user_id === user?.id || (!r.user_id && user?.id === 'usr-ahnaf')))));
    logActivity('DAILY_ROUTINE', `Brief harian tanggal ${date} dibersihkan`);
  };

  const reviewDailyRoutine = async (routineId: string, feedback: string, rating: number) => {
    setRoutines(prev => prev.map(r => {
      if (r.id === routineId || (r.date === new Date().toISOString().split('T')[0] && r.user_id === routineId)) {
        return {
          ...r,
          supervisor_feedback: feedback,
          supervisor_rating: rating,
          reviewed_by: user?.id,
          reviewed_by_name: user?.full_name,
          review_status: 'reviewed'
        };
      }
      return r;
    }));

    logActivity('DAILY_ROUTINE', `Atasan (${user?.full_name}) memberikan review & rating ★${rating} untuk daily routine`);

    addNotification({
      id: `notif-rev-${Date.now()}`,
      user_id: routineId,
      type: 'review',
      title: `Review Routine dari ${user?.full_name}`,
      detail: `Catatan: "${feedback}". Rating: ★${rating}`,
      is_read: false,
      created_at: new Date().toISOString()
    });
  };

  const promoteDailyToKanban = async (dailyTask: DailyRoutineTask) => {
    const newTask: Task = {
      id: `t-daily-${Date.now()}`,
      title: dailyTask.title,
      assignee: user?.full_name || 'Saya',
      deadline: new Date().toISOString().split('T')[0],
      priority: dailyTask.isPareto ? 'Tinggi' : 'Sedang',
      status: 'Backlog',
      source: 'dari Daily'
    };
    await addTask(newTask);
    logActivity('DAILY_ROUTINE', `Tugas rutin dikirim ke Kanban: ${dailyTask.title}`);
  };

  const resetTotalWorkspace = () => {
    setTasks([]);
    setLeads([]);
    setRoutines([]);
    setActivityLog([]);
    setContactLogs([]);
    setQuotations([]);
    setComments([]);
    setSharedNotes([]);
    setNotifications([]);

    if (typeof window !== 'undefined') {
      [
        'andislab_quotations', 'andislab_tasks', 'andislab_leads',
        'andislab_activities', 'andislab_contact_logs', 'andislab_daily',
        'andislab_comments', 'andislab_shared_notes', 'andislab_notifications'
      ].forEach(key => localStorage.removeItem(key));
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      tasks, leads, routines, activityLog, contactLogs, quotations, comments, sharedNotes, notifications,
      addTask, updateTaskStatus, updateTask, deleteTask,
      addLead, updateLeadStatus, updateLead, deleteLead,
      addContactLog, addQuotation, updateQuotationStatus,
      addComment, addSharedNote, updateSharedNote, deleteSharedNote,
      saveRoutine, deleteDailyTask, clearDailyRoutine, reviewDailyRoutine, promoteDailyToKanban,
      markNotificationRead, addNotification,
      logActivity, resetTotalWorkspace
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
