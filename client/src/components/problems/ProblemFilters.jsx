import React from 'react';

const ProblemFilters = ({ filters, domains, onChange, onReset, adminMode = false }) => (
  <div className="card p-5 bg-white space-y-4">
    <div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
        Search
      </label>
      <input
        type="text"
        value={filters.search}
        onChange={(event) => onChange('search', event.target.value)}
        placeholder="Search title, topic, or tag"
        className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
      />
    </div>

    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Domain
        </label>
        <select
          value={filters.domainId}
          onChange={(event) => onChange('domainId', event.target.value)}
          className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        >
          <option value="">All domains</option>
          {domains.map((domain) => (
            <option key={domain._id} value={domain._id}>
              {domain.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Difficulty
        </label>
        <select
          value={filters.difficulty}
          onChange={(event) => onChange('difficulty', event.target.value)}
          className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        >
          <option value="">All difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Type
        </label>
        <select
          value={filters.problemType}
          onChange={(event) => onChange('problemType', event.target.value)}
          className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        >
          <option value="">All problem types</option>
          <option value="Coding">Coding</option>
          <option value="MCQ">MCQ</option>
          <option value="Theory">Theory</option>
          <option value="Debugging">Debugging</option>
        </select>
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Topic
        </label>
        <input
          type="text"
          value={filters.topic}
          onChange={(event) => onChange('topic', event.target.value)}
          placeholder="Arrays, Trees, React..."
          className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        />
      </div>

      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          Tags
        </label>
        <input
          type="text"
          value={filters.tags}
          onChange={(event) => onChange('tags', event.target.value)}
          placeholder="array, dp, hash-map"
          className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
        />
      </div>

      {!adminMode && (
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(event) => onChange('status', event.target.value)}
            className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
          >
            <option value="">All statuses</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>
      )}

      {adminMode && (
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
            Publish State
          </label>
          <select
            value={filters.isPublished}
            onChange={(event) => onChange('isPublished', event.target.value)}
            className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
          >
            <option value="">All</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      )}
    </div>

    <div className="flex justify-end">
      <button type="button" onClick={onReset} className="btn-secondary">
        Reset Filters
      </button>
    </div>
  </div>
);

export default ProblemFilters;
