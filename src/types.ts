export type Priority = 'Rendah' | 'Sedang' | 'Tinggi' | 'Urgent';
export type KategoriKlien = 'Industri/Manufaktur' | 'Pendidikan/Universitas' | 'Riset/LPKL' | 'Pemerintah/PDAM' | 'Rumah Sakit/Klinik';
export type StatusCRM = 'New' | 'Contacted' | 'Proposal/RFQ' | 'Tender/e-Katalog' | 'Won' | 'Lost';
export type TipePesanan = 'Ready Stock' | 'Pre-Order' | 'Custom Furniture';
export type StatusTask = 'Backlog' | 'In Progress' | 'Review' | 'Done';
export type UserRole = 'superadmin' | 'admin' | 'staff';

export type ContactMethod = 'WhatsApp' | 'Telepon' | 'Email' | 'Visit' | 'Meeting';
export type QuotationStatus = 'Draft' | 'Sent' | 'Revised' | 'Accepted' | 'Rejected' | 'Expired';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  position?: string;
  avatar_url?: string;
  pin?: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  assignee_id?: string;
  assignee_name?: string;
  deadline: string; // Format: YYYY-MM-DD
  priority: Priority;
  status: StatusTask;
  source?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  segment: KategoriKlien;
  status: StatusCRM;
  orderType: TipePesanan;
  nextFollowUp: string; // Format: YYYY-MM-DD
  notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContactLog {
  id: string;
  lead_id: string;
  contacted_by: string;
  contacted_by_id: string;
  contacted_at: string;
  method: ContactMethod;
  summary: string;
  next_action?: string;
}

export interface Quotation {
  id: string;
  lead_id: string;
  quote_number: string;
  items_description: string;
  estimated_value: number;
  valid_until: string;
  status: QuotationStatus;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface Comment {
  id: string;
  entity_type: 'task' | 'lead' | 'report' | 'note';
  entity_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface SharedNote {
  id: string;
  title: string;
  content: string;
  created_by: string;
  created_by_name: string;
  last_edited_by?: string;
  last_edited_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'comment' | 'review' | 'task_assigned' | 'lead_update' | 'alert';
  title: string;
  detail: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface DailyRoutineTask {
  id: string;
  routine_id?: string;
  title: string;
  isPareto: boolean;
  completed: boolean;
  sort_order?: number;
}

export interface DailyRoutine {
  id?: string;
  user_id?: string;
  user_name?: string;
  date: string; // YYYY-MM-DD
  morningTasks: DailyRoutineTask[];
  noonBlockers: string;
  eveningEvaluation: string;
  supervisor_feedback?: string;
  supervisor_rating?: number; // 1 - 5
  reviewed_by?: string;
  reviewed_by_name?: string;
  review_status?: 'pending' | 'reviewed' | 'needs_improvement';
  created_at?: string;
  updated_at?: string;
}

export type ActivityAction = 
  | 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' 
  | 'CREATE_LEAD' | 'UPDATE_LEAD' | 'DELETE_LEAD' 
  | 'DAILY_ROUTINE' | 'AI_COPILOT' | 'USER_LOGIN'
  | 'CREATE_QUOTATION' | 'UPDATE_QUOTATION'
  | 'ADD_CONTACT_LOG' | 'ADD_COMMENT' | 'SAVE_NOTE';

export interface ActivityEntry {
  id: string;
  timestamp: string; // ISO string
  action: ActivityAction;
  detail: string;
  user_id?: string;
  user_name?: string;
}

