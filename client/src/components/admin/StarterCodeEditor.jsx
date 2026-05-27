import React, { useState } from 'react';

const languages = [
  { label: 'JavaScript', key: 'javascript' },
  { label: 'Python', key: 'python' },
  { label: 'Java', key: 'java' },
  { label: 'C++', key: 'cpp' }
];

const StarterCodeEditor = ({
  value = {},
  functionSignature = {},
  onChange,
  onFunctionSignatureChange
}) => {
  const [activeLanguage, setActiveLanguage] = useState('javascript');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <button
            key={language.key}
            type="button"
            onClick={() => setActiveLanguage(language.key)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
              activeLanguage === language.key
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#f8fafc] text-[#667085] border border-[#e2e8f0]'
            }`}
          >
            {language.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-[#98a2b3] mb-2">
          Function Signature
        </label>
        <input
          type="text"
          value={functionSignature[activeLanguage] || ''}
          onChange={(event) =>
            onFunctionSignatureChange({
              ...functionSignature,
              [activeLanguage]: event.target.value
            })
          }
          className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        />
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-[#98a2b3] mb-2">
          Starter Code
        </label>
        <textarea
          value={value[activeLanguage] || ''}
          onChange={(event) =>
            onChange({
              ...value,
              [activeLanguage]: event.target.value
            })
          }
          rows={18}
          className="w-full rounded-2xl border border-[#d0d5dd] bg-[#0f172a] px-4 py-3 font-mono text-sm text-slate-100 outline-none focus:border-[#2563eb]"
        />
      </div>
    </div>
  );
};

export default StarterCodeEditor;
