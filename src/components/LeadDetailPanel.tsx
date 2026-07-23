import { useState } from 'react';
import { X, Phone, MessageSquare, FileText, Plus, User } from 'lucide-react';
import type { Lead, ContactLog, Quotation, ContactMethod, QuotationStatus } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { CommentsThread } from './CommentsThread';
import { cn } from './ConfirmModal';

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  const { contactLogs, quotations, addContactLog, addQuotation, updateQuotationStatus } = useWorkspace();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'kontak' | 'quotation' | 'notes'>('kontak');

  // Contact Log Form State
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactMethod, setContactMethod] = useState<ContactMethod>('WhatsApp');
  const [contactSummary, setContactSummary] = useState('');
  const [contactNextAction, setContactNextAction] = useState('');

  // Quotation Form State
  const [isAddingQuotation, setIsAddingQuotation] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState(`QUO/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`);
  const [quoteDesc, setQuoteDesc] = useState('');
  const [quoteValue, setQuoteValue] = useState<number>(0);
  const [quoteValidUntil, setQuoteValidUntil] = useState(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);

  if (!lead) return null;

  const leadContacts = contactLogs.filter(c => c.lead_id === lead.id);
  const leadQuotations = quotations.filter(q => q.lead_id === lead.id);

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactSummary.trim()) return;

    const newLog: ContactLog = {
      id: `cl-${Date.now()}`,
      lead_id: lead.id,
      contacted_by: user?.full_name || 'User',
      contacted_by_id: user?.id || 'usr-anon',
      contacted_at: new Date().toISOString(),
      method: contactMethod,
      summary: contactSummary.trim(),
      next_action: contactNextAction.trim() || undefined
    };

    addContactLog(newLog);
    setContactSummary('');
    setContactNextAction('');
    setIsAddingContact(false);
  };

  const handleAddQuotationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteDesc.trim() || quoteValue <= 0) return;

    const newQuote: Quotation = {
      id: `quo-${Date.now()}`,
      lead_id: lead.id,
      quote_number: quoteNumber,
      items_description: quoteDesc.trim(),
      estimated_value: quoteValue,
      valid_until: quoteValidUntil,
      status: 'Sent',
      created_by: user?.full_name || 'User',
      created_at: new Date().toISOString()
    };

    addQuotation(newQuote);
    setQuoteDesc('');
    setQuoteValue(0);
    setIsAddingQuotation(false);
  };

  const methodBadges: Record<ContactMethod, string> = {
    'WhatsApp': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Telepon': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Email': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Visit': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Meeting': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  };

  const quoteStatusColors: Record<QuotationStatus, string> = {
    'Draft': 'bg-slate-800 text-slate-400 border-slate-700',
    'Sent': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Revised': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Accepted': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Rejected': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'Expired': 'bg-slate-700 text-slate-400 border-slate-600'
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg glass-panel border-l border-slate-800 shadow-2xl flex flex-col animate-scale-in font-sans">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-start justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {lead.segment}
          </span>
          <h2 className="text-lg font-bold text-slate-100 mt-1">{lead.companyName}</h2>
          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>PIC: {lead.contactName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-indigo-400 font-mono"><Phone className="w-3 h-3" /> {lead.contactPhone}</span>
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/40">
        <button
          onClick={() => setActiveTab('kontak')}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-all",
            activeTab === 'kontak' ? "border-indigo-500 text-indigo-300 bg-slate-900/40" : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <Phone className="w-3.5 h-3.5" /> Riwayat Kontak ({leadContacts.length})
        </button>
        <button
          onClick={() => setActiveTab('quotation')}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-all",
            activeTab === 'quotation' ? "border-indigo-500 text-indigo-300 bg-slate-900/40" : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <FileText className="w-3.5 h-3.5" /> Quotation ({leadQuotations.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={cn(
            "flex-1 py-2.5 text-xs font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-all",
            activeTab === 'notes' ? "border-indigo-500 text-indigo-300 bg-slate-900/40" : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Catatan Tim
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* === TAB 1: RIWAYAT KONTAK === */}
        {activeTab === 'kontak' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200">Log Komunikasi Klien</h4>
              <button
                onClick={() => setIsAddingContact(!isAddingContact)}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3 h-3" /> Catat Kontak Baru
              </button>
            </div>

            {/* Inline Add Contact Form */}
            {isAddingContact && (
              <form onSubmit={handleAddContactSubmit} className="glass-card p-3 rounded-xl border border-indigo-500/40 space-y-2 animate-scale-in">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-indigo-300">Form Catatan Kontak Baru</label>
                  <button type="button" onClick={() => setIsAddingContact(false)} className="text-slate-500 hover:text-slate-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Metode Kontak</label>
                    <select
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Telepon">Telepon</option>
                      <option value="Email">Email</option>
                      <option value="Visit">Visit / Kunjungan</option>
                      <option value="Meeting">Meeting Zoom / Offsite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Ringkasan Pembicaraan *</label>
                  <textarea
                    value={contactSummary}
                    onChange={(e) => setContactSummary(e.target.value)}
                    placeholder="Contoh: Menanyakan harga 2 set lemari asam custom dan garansi..."
                    rows={2}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Langkah Selanjutnya (Next Action)</label>
                  <input
                    type="text"
                    value={contactNextAction}
                    onChange={(e) => setContactNextAction(e.target.value)}
                    placeholder="Contoh: Kirim penawaran resmi besok pagi..."
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                  >
                    Simpan Log Kontak
                  </button>
                </div>
              </form>
            )}

            {/* List of contact logs */}
            <div className="space-y-3">
              {leadContacts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                  Belum ada log komunikasi dengan {lead.companyName}. Tambahkan catatan kontak pertama Anda!
                </div>
              ) : (
                leadContacts.map((log) => {
                  const dateStr = new Date(log.contacted_at).toLocaleString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  });

                  return (
                    <div key={log.id} className="glass-card p-3 rounded-xl border border-slate-800 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded font-semibold border", methodBadges[log.method])}>
                          {log.method}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{dateStr}</span>
                      </div>

                      <p className="text-xs text-slate-200 leading-snug">{log.summary}</p>

                      {log.next_action && (
                        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 font-medium flex items-start gap-1.5">
                          <span className="font-bold">Next:</span> {log.next_action}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-end gap-1">
                        <User className="w-3 h-3 text-slate-400" /> {log.contacted_by}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* === TAB 2: QUOTATION === */}
        {activeTab === 'quotation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200">Daftar Penawaran Harga (Quotation)</h4>
              <button
                onClick={() => setIsAddingQuotation(!isAddingQuotation)}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3 h-3" /> Buat Quotation
              </button>
            </div>

            {/* Inline Add Quotation Form */}
            {isAddingQuotation && (
              <form onSubmit={handleAddQuotationSubmit} className="glass-card p-3 rounded-xl border border-indigo-500/40 space-y-2 animate-scale-in">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-indigo-300">Form Draft Quotation</label>
                  <button type="button" onClick={() => setIsAddingQuotation(false)} className="text-slate-500 hover:text-slate-300">
                    <X className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Nomor Penawaran</label>
                    <input
                      type="text"
                      value={quoteNumber}
                      onChange={(e) => setQuoteNumber(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Estimasi Nilai (Rp)</label>
                    <input
                      type="number"
                      value={quoteValue || ''}
                      onChange={(e) => setQuoteValue(Number(e.target.value))}
                      placeholder="85000000"
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Deskripsi Item / Spesifikasi *</label>
                  <textarea
                    value={quoteDesc}
                    onChange={(e) => setQuoteDesc(e.target.value)}
                    placeholder="Contoh: 2x Lemari Asam FH-1500 Custom, 1x Blower PVC 1.5 HP..."
                    rows={2}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Berlaku Sampai Tanggal</label>
                  <input
                    type="date"
                    value={quoteValidUntil}
                    onChange={(e) => setQuoteValidUntil(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                  >
                    Simpan Quotation
                  </button>
                </div>
              </form>
            )}

            {/* List of Quotations */}
            <div className="space-y-3">
              {leadQuotations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 italic border border-dashed border-slate-800 rounded-xl">
                  Belum ada penawaran harga yang dibuat untuk lead ini.
                </div>
              ) : (
                leadQuotations.map((quote) => (
                  <div key={quote.id} className="glass-card p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-100">{quote.quote_number}</span>
                      <select
                        value={quote.status}
                        onChange={(e) => updateQuotationStatus(quote.id, e.target.value as QuotationStatus)}
                        className={cn("px-2 py-0.5 rounded text-[10px] font-semibold border cursor-pointer", quoteStatusColors[quote.status])}
                      >
                        <option value="Draft" className="bg-slate-900 text-slate-200">Draft</option>
                        <option value="Sent" className="bg-slate-900 text-slate-200">Sent</option>
                        <option value="Revised" className="bg-slate-900 text-slate-200">Revised</option>
                        <option value="Accepted" className="bg-slate-900 text-slate-200">Accepted</option>
                        <option value="Rejected" className="bg-slate-900 text-slate-200">Rejected</option>
                        <option value="Expired" className="bg-slate-900 text-slate-200">Expired</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-300 leading-snug">{quote.items_description}</p>

                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px]">
                      <div className="text-emerald-400 font-extrabold font-mono">
                        Rp {quote.estimated_value.toLocaleString('id-ID')}
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        s/d {quote.valid_until}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* === TAB 3: CATATAN TIM === */}
        {activeTab === 'notes' && (
          <CommentsThread entityType="lead" entityId={lead.id} title="Komentar & Catatan Tim per Lead" />
        )}
      </div>
    </div>
  );
}
