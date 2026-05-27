import React from 'react';

const blankCase = { input: '', expectedOutput: '', explanation: '' };

const TestCaseEditor = ({ label, value = [], onChange }) => {
  const updateCase = (index, field, nextValue) => {
    const nextCases = value.map((testCase, caseIndex) =>
      caseIndex === index ? { ...testCase, [field]: nextValue } : testCase
    );
    onChange(nextCases);
  };

  const addCase = () => onChange([...(value || []), { ...blankCase }]);
  const removeCase = (index) => onChange(value.filter((_, caseIndex) => caseIndex !== index));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-black text-[#101828]">{label}</h4>
        <button type="button" onClick={addCase} className="btn-secondary">
          Add Test Case
        </button>
      </div>

      {(value || []).map((testCase, index) => (
        <div key={`${label}-${index + 1}`} className="rounded-2xl border border-[#e5e7eb] p-4 space-y-3 bg-[#f8fafc]">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-widest text-[#667085]">
              Case {index + 1}
            </div>
            <button
              type="button"
              onClick={() => removeCase(index)}
              className="text-xs font-black uppercase tracking-widest text-rose-600"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#98a2b3] mb-2">
              Input
            </label>
            <textarea
              value={testCase.input}
              onChange={(event) => updateCase(index, 'input', event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#98a2b3] mb-2">
              Expected Output
            </label>
            <textarea
              value={testCase.expectedOutput}
              onChange={(event) => updateCase(index, 'expectedOutput', event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#98a2b3] mb-2">
              Explanation
            </label>
            <textarea
              value={testCase.explanation || ''}
              onChange={(event) => updateCase(index, 'explanation', event.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestCaseEditor;
