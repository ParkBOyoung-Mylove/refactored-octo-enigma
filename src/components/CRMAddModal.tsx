import { useState, useEffect } from 'react';
import { X, Building, Phone, User, Calendar, Layers, ShoppingBag, FileText } from 'lucide-react';
import type { Lead, KategoriKlien, StatusCRM, TipePesanan } from '../types';
import { useWorkspace } from '../context/WorkspaceContext';

interface CRMAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
}

const SEGMENT_OPTIONS: KategoriKlien[] = [
  'Industri/Manufaktur',
  'Pendidikan/Universitas',
  'Riset/LPKL',
  'Pemerintah/PDAM',
  'Rumah Sakit/Klinik'
];

const STATUS_OPTIONS: StatusCRM[] = ['New', 'Contacted', 'Proposal/RFQ', 'Tender/e-Katalog', 'Won', 'Lost'];
const ORDER_TYPE_OPTIONS: TipePesanan[] = ['Ready Stock', 'Pre-Order', 'Custom Furniture'];

export function CRMAddModal({ isOpen, onClose, leadToEdit }: CRMAddModalProps) {
  const { addLead, updateLead } = useWorkspace();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [segment, setSegment] = useState<KategoriKlien>('Industri/Manufaktur');
  const [status, setStatus] = useState<StatusCRM>('New');
  const [orderType, setOrderType] = useState<TipePesanan>('Ready Stock');
  const [nextFollowUp, setNextFollowUp] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (leadToEdit) {
      setCompanyName(leadToEdit.companyName);
      setContactName(leadToEdit.contactName);
      setContactPhone(leadToEdit.contactPhone);
      setSegment(leadToEdit.segment);
      setStatus(leadToEdit.status);
      setOrderType(leadToEdit.orderType);
      setNextFollowUp(leadToEdit.nextFollowUp);
      setNotes(leadToEdit.notes || '');
    } else {
      setCompanyName('');
      setContactName('');
      setContactPhone('');
      setSegment('Industri/Manufaktur');
      setStatus('New');
      setOrderType('Ready Stock');
      setNextFollowUp(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [leadToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    if (leadToEdit) {
      updateLead({
        ...leadToEdit,
        companyName,
        contactName,
        contactPhone,
        segment,
        status,
        orderType,
        nextFollowUp,
        notes
      });
    } else {
      addLead({
        id: `l-c-${Date.now()}`,
        companyName,
        contactName: contactName || 'N/A',
        contactPhone: contactPhone || '-',
        segment,
        status,
        orderType,
        nextFollowUp,
        notes
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md font-sans">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            {leadToEdit ? 'Edit Prospek CRM' : 'Tambah Prospek Baru'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Perusahaan / Klien *</label>
            <div className="relative">
              <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Contoh: PT Sucofindo Indonesia"
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Person In Charge (PIC)</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Pak Budi / Ibu Rina"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Telepon / WA</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Segmen Pasar</label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <select
                  value={segment}
                  onChange={(e) => setSegment(e.target.value as KategoriKlien)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {SEGMENT_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="bg-slate-900 text-slate-200">{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Pesanan</label>
              <div className="relative">
                <ShoppingBag className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as TipePesanan)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {ORDER_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="bg-slate-900 text-slate-200">{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status CRM</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusCRM)}
                className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt} className="bg-slate-900 text-slate-200">{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal Follow Up</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={nextFollowUp}
                  onChange={(e) => setNextFollowUp(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Catatan Tambahan</label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Rincian kebutuhan, estimasi anggaran, dll..."
                rows={2}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 bg-slate-800/60 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-500 hover:to-blue-500 transition-colors shadow-md shadow-indigo-600/20"
            >
              {leadToEdit ? 'Simpan Perubahan' : 'Tambah Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
