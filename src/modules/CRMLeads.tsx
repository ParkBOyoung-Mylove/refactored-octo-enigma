import { useState } from 'react';
import { Plus, Trash2, Phone, Calendar, Search, Filter, Edit, LayoutGrid, Table as TableIcon, FileText, ChevronRight } from 'lucide-react';
import type { Lead, StatusCRM } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { ConfirmModal, cn } from '../components/ConfirmModal';
import { CRMAddModal } from '../components/CRMAddModal';
import { LeadDetailPanel } from '../components/LeadDetailPanel';

const STATUS_OPTIONS: StatusCRM[] = ['New', 'Contacted', 'Proposal/RFQ', 'Tender/e-Katalog', 'Won', 'Lost'];

export function CRMLeads() {
  const { leads, updateLeadStatus, deleteLead, addTask } = useWorkspace();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'pipeline'>('table');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [leadToPromote, setLeadToPromote] = useState<Lead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const handleUpdateStatus = (id: string, status: StatusCRM) => {
    updateLeadStatus(id, status);
    
    if (status === 'Won') {
      const wonLead = leads.find(l => l.id === id);
      if (wonLead) {
        setLeadToPromote(wonLead);
      }
    }
  };

  const handleDelete = () => {
    if (leadToDelete) {
      deleteLead(leadToDelete);
      setLeadToDelete(null);
    }
  };

  const handlePromoteLead = () => {
    if (leadToPromote) {
      addTask({
        id: `t-crm-${Date.now()}`,
        title: `Instalasi/Pengiriman: ${leadToPromote.companyName}`,
        assignee: 'Tim Teknisi',
        deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        priority: 'Tinggi',
        status: 'Backlog',
        source: 'dari CRM Won'
      });
      setLeadToPromote(null);
    }
  };

  const isFollowUpDue = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) <= today;
  };

  const statusColors: Record<StatusCRM, string> = {
    'New': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    'Contacted': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    'Proposal/RFQ': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'Tender/e-Katalog': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    'Won': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'Lost': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.contactPhone.includes(searchQuery);
    
    const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
    const matchesSegment = selectedSegment === 'ALL' || l.segment === selectedSegment;

    return matchesSearch && matchesStatus && matchesSegment;
  });

  return (
    <div className="flex flex-col h-full font-sans animate-fade-in">
      {/* Header & Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            CRM Leads & Pipeline
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
              {filteredLeads.length} Lead
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kelola prospek bisnis dan jalur penjualan e-Katalog laboratorium.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors",
                viewMode === 'table' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <TableIcon className="w-3.5 h-3.5" /> Tabel
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={cn(
                "p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors",
                viewMode === 'pipeline' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Pipeline
            </button>
          </div>

          <button
            onClick={() => { setLeadToEdit(null); setIsAddModalOpen(true); }}
            className="py-2 px-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Lead Baru
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-4 glass-card p-3 rounded-2xl border border-slate-800/80 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama perusahaan, kontak, telepon..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Semua Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Semua Segmen</option>
            <option value="Industri/Manufaktur">Industri/Manufaktur</option>
            <option value="Pendidikan/Universitas">Pendidikan/Universitas</option>
            <option value="Riset/LPKL">Riset/LPKL</option>
            <option value="Pemerintah/PDAM">Pemerintah/PDAM</option>
            <option value="Rumah Sakit/Klinik">Rumah Sakit/Klinik</option>
          </select>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'table' ? (
        <div className="flex-1 overflow-auto glass-panel border border-slate-800 rounded-2xl">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-900/90 text-slate-400 sticky top-0 z-20 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Perusahaan</th>
                <th className="px-4 py-3 font-semibold">Kontak PIC</th>
                <th className="px-4 py-3 font-semibold">Segmen</th>
                <th className="px-4 py-3 font-semibold">Tipe Pesanan</th>
                <th className="px-4 py-3 font-semibold">Status CRM</th>
                <th className="px-4 py-3 font-semibold">Follow Up</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500 italic">
                    Belum ada data prospek yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const due = isFollowUpDue(lead.nextFollowUp);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="px-4 py-3 font-semibold text-slate-100">
                        {lead.companyName}
                        {lead.notes && <p className="text-[11px] text-slate-500 font-normal truncate max-w-[200px]">{lead.notes}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-slate-200 font-medium">{lead.contactName}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" /> {lead.contactPhone}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{lead.segment}</td>
                      <td className="px-4 py-3 text-slate-300">{lead.orderType}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as StatusCRM)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none",
                            statusColors[lead.status]
                          )}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status} className="bg-slate-900 text-slate-200">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className={cn(
                          "flex items-center gap-1.5 font-medium",
                          due ? "text-rose-400 font-bold animate-pulse" : "text-slate-300"
                        )}>
                          <Calendar className="w-3.5 h-3.5" />
                          {lead.nextFollowUp}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedLeadForDetail(lead)}
                            className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all"
                            title="Buka Riwayat Kontak & Quotation"
                          >
                            <FileText className="w-3 h-3" /> Detail & Quotation <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => { setLeadToEdit(lead); setIsAddModalOpen(true); }}
                            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit Lead"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin ? (
                            <button
                              onClick={() => setLeadToDelete(lead.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                              title="Hapus Lead (Admin Only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-600 px-1" title="Hanya Admin yang bisa menghapus">🔒</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Pipeline Kanban View */
        <div className="flex-1 overflow-x-auto flex gap-4 pb-4">
          {STATUS_OPTIONS.map(status => {
            const statusLeads = filteredLeads.filter(l => l.status === status);
            return (
              <div key={status} className="w-64 flex-shrink-0 flex flex-col glass-panel rounded-2xl border border-slate-800 p-3">
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-lg border", statusColors[status])}>
                    {status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{statusLeads.length}</span>
                </div>

                <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                  {statusLeads.map(lead => (
                    <div key={lead.id} className="glass-card p-3 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all">
                      <h4 className="font-bold text-xs text-slate-100 mb-1">{lead.companyName}</h4>
                      <p className="text-[11px] text-slate-400 mb-2">{lead.contactName} • {lead.contactPhone}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                        <span>{lead.segment}</span>
                        <span className={isFollowUpDue(lead.nextFollowUp) ? "text-rose-400 font-bold" : ""}>
                          {lead.nextFollowUp}
                        </span>
                      </div>
                    </div>
                  ))}
                  {statusLeads.length === 0 && (
                    <div className="h-16 flex items-center justify-center text-xs text-slate-600 italic border border-dashed border-slate-800 rounded-xl">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Detail Slide-in Panel */}
      <LeadDetailPanel
        lead={selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
      />

      {/* Add / Edit Modal */}
      <CRMAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        leadToEdit={leadToEdit}
      />

      {/* Confirm Delete */}
      <ConfirmModal 
        isOpen={!!leadToDelete}
        title="Hapus Prospek CRM"
        message="Data prospek CRM ini akan dihapus secara permanen dari server. Apakah Anda yakin?"
        onConfirm={handleDelete}
        onCancel={() => setLeadToDelete(null)}
      />

      {/* Won Promoted to Task */}
      <ConfirmModal 
        isOpen={!!leadToPromote}
        title="Prospek Berhasil Won! 🎉"
        message={`Selamat! Apakah Anda ingin membuat tugas pengiriman/instalasi baru di Kanban untuk ${leadToPromote?.companyName}?`}
        onConfirm={handlePromoteLead}
        onCancel={() => setLeadToPromote(null)}
        confirmText="Ya, Buat Tugas Kanban"
        cancelText="Tidak, Terima Kasih"
        isSuccess={true}
      />
    </div>
  );
}
