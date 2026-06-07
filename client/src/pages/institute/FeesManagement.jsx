import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiDollarSign, FiCalendar, FiPlus, FiX, FiCheckCircle, FiFileText } from 'react-icons/fi';

export default function FeesManagement() {
  const { user } = useAuth();
  const [feesList, setFeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await api.get('/institute/fees');
      setFeesList(res.data.data);
    } catch (err) {
      toast.error('Failed to load fees logs');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) {
      return toast.error('Please enter a valid amount');
    }
    setLoading(true);
    try {
      await api.put(`/institute/fees/${selectedFee._id}/pay`, { paidAmount: Number(payAmount) });
      toast.success('Payment recorded successfully!');
      setIsPayModalOpen(false);
      setPayAmount('');
      fetchFees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (fee) => {
    setSelectedFee(fee);
    setIsPayModalOpen(true);
  };

  const openReceiptModal = (fee) => {
    setSelectedFee(fee);
    setIsReceiptOpen(true);
  };

  // Math aggregates for Admin
  const totalExpected = feesList.reduce((acc, f) => acc + (f.totalFees || 0), 0);
  const totalCollected = feesList.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalDues = feesList.reduce((acc, f) => acc + (f.remainingAmount || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-main)]">Tuition & Invoicing</h1>
          <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Record payments, manage outstanding balances and download billing records</p>
        </div>
      </div>

      {/* Admin Financial Stats Card */}
      {user.role === 'admin' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-[var(--primary)] flex items-center justify-center text-xl rounded-xl">
              <FiDollarSign />
            </div>
            <div>
              <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Expected Collection</div>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">₹{totalExpected}</div>
            </div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 border border-green-100 text-[var(--primary)] flex items-center justify-center text-xl rounded-xl">
              <FiCheckCircle />
            </div>
            <div>
              <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Total Amount Paid</div>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">₹{totalCollected}</div>
            </div>
          </div>
          <div className="card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center text-xl rounded-xl">
              <FiX />
            </div>
            <div>
              <div className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Outstanding Dues</div>
              <div className="text-2xl font-black text-[var(--text-main)] mt-1">₹{totalDues}</div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Ledger */}
      <div className="card bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[var(--primary)] border-t-transparent"></div>
          </div>
        ) : feesList.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-muted)] font-bold">
            No invoicing details logged in.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-sub)]/55">
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Student Name</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Course (Fees)</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Paid Balance</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Remaining Dues</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)]">Status</th>
                  <th className="p-4 text-xs font-black uppercase tracking-wider text-[var(--text-light)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {feesList.map((fee) => (
                  <tr key={fee._id} className="hover:bg-[var(--bg-sub)]/25 transition-colors text-xs font-semibold">
                    <td className="p-4">
                      <div className="font-extrabold text-sm text-[var(--text-main)]">{fee.student?.fullName || 'N/A'}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{fee.student?.rollNumber || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[var(--text-main)]">{fee.course?.courseName || 'N/A'}</div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Total: ₹{fee.totalFees}</div>
                    </td>
                    <td className="p-4 text-[var(--primary)] font-extrabold">₹{fee.paidAmount || 0}</td>
                    <td className="p-4 text-rose-500 font-extrabold">₹{fee.remainingAmount}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        fee.status === 'Paid' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : fee.status === 'Partial' 
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.role === 'admin' && fee.status !== 'Paid' && (
                          <button 
                            onClick={() => openPaymentModal(fee)}
                            className="btn-primary py-2 px-3 text-[10px] uppercase font-black tracking-wider shadow-sm"
                          >
                            Pay
                          </button>
                        )}
                        <button 
                          onClick={() => openReceiptModal(fee)}
                          className="btn-secondary py-2 px-3.5 text-[10px] uppercase font-black tracking-wider flex items-center gap-1.5"
                        >
                          <FiFileText /> Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {isPayModalOpen && selectedFee && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-sm shadow-2xl p-6 relative">
            <button 
              onClick={() => setIsPayModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-light)] hover:text-[var(--text-main)] rounded-full hover:bg-[var(--bg-sub)]"
            >
              <FiX size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-main)] mb-6">Record Payment</h3>
            
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Student</span>
                <p className="text-sm font-extrabold text-[var(--text-main)] mt-0.5">{selectedFee.student?.fullName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Total Course Fee</span>
                  <p className="text-sm font-bold text-[var(--text-main)] mt-0.5">₹{selectedFee.totalFees}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-wider text-[var(--text-light)]">Remaining Dues</span>
                  <p className="text-sm font-extrabold text-rose-500 mt-0.5">₹{selectedFee.remainingAmount}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[var(--text-light)] mb-1">Payment Amount (INR)</label>
                <input 
                  type="number" 
                  required
                  value={payAmount}
                  max={selectedFee.remainingAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-[var(--bg-sub)] border border-[var(--border)] text-xs rounded-xl p-3 focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] font-semibold"
                  placeholder="e.g. 5000"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsPayModalOpen(false)}
                  className="btn-secondary py-3 px-5 text-xs font-black uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary py-3 px-6 text-xs font-black uppercase"
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vintage Receipt modal */}
      {isReceiptOpen && selectedFee && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border-2 border-[var(--primary)]/30 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative p-8 flex flex-col items-center gap-6">
            <div className="w-full flex justify-between items-center border-b border-[var(--border)] pb-4">
              <h3 className="text-sm font-black text-[var(--text-main)] flex items-center gap-2 uppercase tracking-wide">
                <FiFileText className="text-[var(--primary)]" /> Tuition Invoicing Receipt
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Print / Download Invoice
                </button>
                <button 
                  onClick={() => setIsReceiptOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--bg-sub)] hover:bg-[var(--border)] text-[var(--text-light)] hover:text-[var(--text-main)] flex items-center justify-center transition-all cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Receipt template printable section */}
            <div 
              id="printable-receipt"
              className="w-full bg-[#FCFBF7] border-[6px] border-double border-stone-400 p-8 flex flex-col justify-between text-stone-800 relative overflow-hidden select-text text-xs"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {/* Header */}
              <div className="text-center border-b border-stone-300 pb-4 mb-4">
                <h2 className="text-2xl font-bold tracking-wide text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>CodeWave Solution</h2>
                <p className="text-[10px] font-bold text-stone-500 tracking-wider mt-0.5 uppercase">Coaching & Placements Institute</p>
                <p className="text-[9px] text-stone-400 mt-1 italic">123 Code Street, Silicon Valley | billing@codewavesolution.com</p>
              </div>

              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-stone-700">
                <div className="space-y-1">
                  <div><span className="font-bold text-stone-900">Receipt For:</span> {selectedFee.student?.fullName}</div>
                  <div><span className="font-bold text-stone-900">Roll Number:</span> {selectedFee.student?.rollNumber}</div>
                  <div><span className="font-bold text-stone-900">Enrolled Batch:</span> {selectedFee.student?.batch?.batchName || 'N/A'}</div>
                </div>
                <div className="text-right space-y-1">
                  <div><span className="font-bold text-stone-900">Date:</span> {selectedFee.paymentDate ? new Date(selectedFee.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                  <div><span className="font-bold text-stone-900">Invoice Status:</span> <span className="font-bold uppercase tracking-wider text-[var(--primary)]">{selectedFee.status}</span></div>
                  <div><span className="font-bold text-stone-900">Billing Ref:</span> CW-INV-{selectedFee._id.substring(selectedFee._id.length - 6).toUpperCase()}</div>
                </div>
              </div>

              {/* Invoicing Table */}
              <div className="border border-stone-300 rounded overflow-hidden mb-6">
                <div className="grid grid-cols-3 bg-stone-100 font-bold border-b border-stone-300 p-2 text-stone-900">
                  <div>Description</div>
                  <div className="text-center">Rate</div>
                  <div className="text-right">Line Total</div>
                </div>
                <div className="grid grid-cols-3 p-2 border-b border-stone-200">
                  <div>{selectedFee.course?.courseName || 'Course Enrollment Fee'}</div>
                  <div className="text-center">₹{selectedFee.totalFees}</div>
                  <div className="text-right">₹{selectedFee.totalFees}</div>
                </div>
                
                <div className="grid grid-cols-3 p-2 bg-stone-50 text-stone-600">
                  <div className="col-span-2 text-right font-bold text-stone-900">Total Paid:</div>
                  <div className="text-right font-bold text-[var(--primary)]">₹{selectedFee.paidAmount}</div>
                </div>
                <div className="grid grid-cols-3 p-2 bg-stone-50 text-stone-600">
                  <div className="col-span-2 text-right font-bold text-stone-900">Balance Due:</div>
                  <div className="text-right font-bold text-rose-500">₹{selectedFee.remainingAmount}</div>
                </div>
              </div>

              {/* Footer Terms */}
              <div className="border-t border-stone-300 pt-4 text-center text-[9px] text-stone-400 italic">
                Thank you for your enrollment. This is a computer-generated billing receipt. No signature required.
              </div>
            </div>

            {/* Print Styles */}
            <style>{`
              @media print {
                body {
                  background: white !important;
                  color: black !important;
                }
                #root {
                  display: none !important;
                }
                body > * {
                  display: none !important;
                }
                #printable-receipt {
                  display: flex !important;
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100vw !important;
                  box-sizing: border-box !important;
                  margin: 0 !important;
                  padding: 40px !important;
                  border: 6px double #78716c !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
