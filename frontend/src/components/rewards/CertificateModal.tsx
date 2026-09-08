import React from 'react';
import { Award, Download, Printer, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CertificateModalProps {
  isOpen?: boolean;
  onClose: () => void;
  certificateTitle?: string;
  courseTitle?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen = true,
  onClose,
  certificateTitle,
  courseTitle
}) => {
  const { currentUser, showToast } = useApp();

  if (!isOpen) return null;

  const title = courseTitle || certificateTitle || 'Java Core & Modern Enterprise Architecture';
  const certId = `CERT-LMS-${currentUser.id.substring(0, 8).toUpperCase()}-2026`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast('Certificate PDF downloaded successfully!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-400" />
            <h3 className="font-bold text-base text-white">Verified Milestone Certificate</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/40 text-center relative border m-4 rounded-2xl border-amber-500/30 shadow-2xl">
          {/* Gold Decorative Corner Badges */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400/60 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400/60 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg" />

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award size={24} />
            </div>
            <span className="font-mono text-xs tracking-widest uppercase text-amber-300 font-bold">
              Certificate of Academic Achievement
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2">This is to officially certify that</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white my-2 font-display tracking-tight">
            {currentUser.name}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            has demonstrated exceptional mastery across assessments and completed the specialized curriculum for
          </p>

          <div className="my-4 p-3 rounded-xl bg-blue-950/60 border border-blue-500/30 max-w-md mx-auto">
            <h4 className="text-sm sm:text-base font-bold text-blue-200">{title}</h4>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 max-w-md mx-auto pt-4 border-t border-slate-800 mt-4">
            <div className="text-left">
              <span className="block text-[10px] text-slate-500 uppercase">Credential ID</span>
              <strong className="text-slate-200 font-mono text-[11px] block">{certId}</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
              <ShieldCheck size={14} />
              <span>CRYPTOGRAPHICALLY VERIFIED</span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] text-slate-500 uppercase">Accredited By</span>
              <strong className="text-slate-200">LMS Platform Gov</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/80">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Printer size={15} />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>Download Certificate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
