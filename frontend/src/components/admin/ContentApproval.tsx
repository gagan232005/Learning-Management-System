import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentApprovalItem, ApprovalStatus } from '../../types';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  MessageSquare,
  Clock,
  BookOpen,
  ShieldCheck,
  X
} from 'lucide-react';

export const ContentApproval: React.FC = () => {
  const {
    approvalQueue,
    approveContent,
    rejectContent,
    requestChangesContent,
    showToast
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Rejection modal state
  const [rejectModalItem, setRejectModalItem] = useState<ContentApprovalItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Please improve the explanation and add code examples before publishing.');

  // Request changes modal state
  const [changesModalItem, setChangesModalItem] = useState<ContentApprovalItem | null>(null);
  const [changesFeedback, setChangesFeedback] = useState<string>('');

  const filteredQueue = approvalQueue.filter(item => {
    if (selectedStatus === 'all') return true;
    return item.status === selectedStatus;
  });

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalItem || !rejectionReason.trim()) return;
    rejectContent(rejectModalItem.id, rejectionReason.trim());
    setRejectModalItem(null);
    showToast(`Content "${rejectModalItem.title}" rejected with feedback.`, 'info');
  };

  const handleConfirmChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!changesModalItem || !changesFeedback.trim()) return;
    requestChangesContent(changesModalItem.id, changesFeedback.trim());
    setChangesModalItem(null);
    showToast(`Changes requested for "${changesModalItem.title}".`, 'info');
  };

  const statusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'under_review':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'approved':
      case 'published':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'rejected':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <FileCheck2 size={13} /> Quality Assurance Pipeline
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">• Curriculum Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display mt-2">
            Content Approval & Quality Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Review and govern mentor course submissions before they are published to learners. Enforce high curriculum standards.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStatus === 'all' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All ({approvalQueue.length})
        </button>
        <button
          onClick={() => setSelectedStatus('submitted')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStatus === 'submitted' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Submitted ({approvalQueue.filter(i => i.status === 'submitted').length})
        </button>
        <button
          onClick={() => setSelectedStatus('approved')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            selectedStatus === 'approved' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Approved ({approvalQueue.filter(i => i.status === 'approved').length})
        </button>
      </div>

      {/* Approval List */}
      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
            No submissions match the selected filter.
          </div>
        ) : (
          filteredQueue.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${statusBadge(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{item.contentType}</span>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</strong>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Submitted by {item.creatorName} • {new Date(item.submissionDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    approveContent(item.id);
                    showToast(`Approved "${item.title}"!`, 'success');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 size={13} />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => {
                    setChangesModalItem(item);
                    setChangesFeedback('Please ensure all 5 reels have high definition audio and clear code.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 cursor-pointer"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => setRejectModalItem(item)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-800 cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Changes Modal */}
      {changesModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-900 dark:text-white">
            <h3 className="font-bold text-sm">Request Changes: {changesModalItem.title}</h3>
            <form onSubmit={handleConfirmChanges} className="space-y-3">
              <textarea
                rows={4}
                required
                value={changesFeedback}
                onChange={e => setChangesFeedback(e.target.value)}
                placeholder="Specify what needs revision..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setChangesModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Send Changes Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 text-slate-900 dark:text-white">
            <h3 className="font-bold text-sm">Reject Submission: {rejectModalItem.title}</h3>
            <form onSubmit={handleConfirmReject} className="space-y-3">
              <textarea
                rows={4}
                required
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
