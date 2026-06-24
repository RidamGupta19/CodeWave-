import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FiBookOpen, FiDollarSign, FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function StudentCourses() {
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoursesAndFees();
  }, []);

  const fetchCoursesAndFees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/institute/fees');
      setFeesData(res.data.data);
    } catch (err) {
      console.error('Error fetching courses/fees:', err);
      toast.error('Failed to load courses and fees data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--border)] rounded-lg mb-6" />
        <div className="h-64 bg-[var(--bg-sub)]/30 rounded-2xl" />
        <div className="h-48 bg-[var(--bg-sub)]/30 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-main)]">My Courses & Ledger</h1>
        <p className="text-xs text-[var(--text-muted)] font-extrabold uppercase tracking-widest mt-1">Review active enrolments, schedules, syllabus outline and financial ledger records</p>
      </div>

      {feesData.length === 0 ? (
        <div className="card p-12 text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-lg font-black text-[var(--text-main)] mb-1">No Active Course Enrolment</h3>
          <p className="text-xs text-[var(--text-muted)] font-bold">Please get in touch with the management administration to link courses to your profile.</p>
        </div>
      ) : (
        feesData.map(ledger => {
          const course = ledger.course || {};
          const isPaid = ledger.remainingAmount === 0;

          return (
            <div key={ledger._id} className="space-y-8">
              
              {/* Course Detail Section */}
              <div className="card p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[var(--border-light)]">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xl shrink-0 border border-[var(--border)]">
                      <FiBookOpen />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[var(--text-main)]">{course.courseName || 'Linked Course'}</h2>
                      <p className="text-xs text-[var(--text-muted)] font-bold">Duration: {course.duration || 'N/A'}</p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1 bg-emerald-50 text-[var(--success)] border border-emerald-100 text-xs font-black uppercase rounded-full tracking-wide">
                    Active Enrolment
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest">Course Syllabus & Description</h3>
                  <p className="text-xs text-[var(--text-muted)] font-semibold leading-relaxed max-w-4xl">
                    {course.description || 'Syllabus guidelines and descriptions will be shared by the classroom teacher. Make sure you complete your homework assignments and weekly tests to stay on path.'}
                  </p>
                </div>
              </div>

              {/* Financial Ledger Section */}
              <div className="card p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-light)]">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[var(--secondary)] flex items-center justify-center text-lg shrink-0 border border-orange-100">
                    <FiDollarSign />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase text-[var(--text-main)] tracking-wider">Fee Ledger Records</h3>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold">Monitor collection balance, paid history, and invoice status</p>
                  </div>
                </div>

                {/* Ledger summary blocks */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[var(--bg-sub)]/30 border border-[var(--border-light)] p-4 rounded-xl">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Total Course Fee</span>
                    <div className="text-xl font-black text-[var(--text-main)] mt-1">₹{ledger.totalFees}</div>
                  </div>
                  <div className="bg-[var(--bg-sub)]/30 border border-[var(--border-light)] p-4 rounded-xl">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Paid Amount</span>
                    <div className="text-xl font-black text-[var(--success)] mt-1">₹{ledger.paidAmount || 0}</div>
                  </div>
                  <div className="bg-[var(--bg-sub)]/30 border border-[var(--border-light)] p-4 rounded-xl">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Remaining Dues</span>
                    <div className={`text-xl font-black mt-1 ${isPaid ? 'text-[var(--success)]' : 'text-rose-500'}`}>
                      ₹{ledger.remainingAmount}
                    </div>
                  </div>
                  <div className="bg-[var(--bg-sub)]/30 border border-[var(--border-light)] p-4 rounded-xl">
                    <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-light)]">Billing Status</span>
                    <div className="mt-1">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[var(--success)]">
                          <FiCheckCircle /> Fully Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[var(--secondary)] animate-pulse">
                          <FiClock /> Dues Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment History Log */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-black uppercase text-[var(--text-light)] tracking-widest flex items-center gap-2">
                    <FiFileText /> Payment History logs
                  </h4>
                  {ledger.paymentDate ? (
                    <div className="border border-[var(--border)] rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[var(--bg-sub)]/50 font-black text-[var(--text-muted)] border-b border-[var(--border-light)] uppercase tracking-wider">
                            <th className="p-3">Reference invoice date</th>
                            <th className="p-3">Method / Description</th>
                            <th className="p-3">Receipt status</th>
                            <th className="p-3 text-right">Amount log</th>
                          </tr>
                        </thead>
                        <tbody className="font-semibold text-[var(--text-main)]">
                          <tr className="border-b border-[var(--border-light)] last:border-b-0 hover:bg-[var(--bg-sub)]/10">
                            <td className="p-3">{new Date(ledger.paymentDate).toLocaleDateString()}</td>
                            <td className="p-3">Direct Bank Transfer / Cash Ledger Sync</td>
                            <td className="p-3 text-[var(--success)]">Processed & Verified</td>
                            <td className="p-3 text-right text-[var(--success)] font-black">₹{ledger.paidAmount || 0}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-[var(--bg-sub)]/20 border border-[var(--border-light)] p-5 text-center rounded-xl text-xs font-semibold text-[var(--text-muted)]">
                      No payment receipts or transaction history synced yet.
                    </div>
                  )}
                </div>

              </div>

            </div>
          );
        })
      )}

    </div>
  );
}
