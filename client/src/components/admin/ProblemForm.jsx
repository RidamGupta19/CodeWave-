import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import TestCaseEditor from './TestCaseEditor';
import StarterCodeEditor from './StarterCodeEditor';

const defaultProblem = {
  title: '',
  slug: '',
  domain: '',
  phase: '',
  topic: '',
  difficulty: 'Easy',
  problemType: 'Coding',
  description: '',
  inputFormat: '',
  outputFormat: '',
  constraints: '',
  examples: [{ input: '', output: '', explanation: '' }],
  visibleTestCases: [{ input: '', expectedOutput: '', explanation: '' }],
  hiddenTestCases: [{ input: '', expectedOutput: '', explanation: '' }],
  starterCode: { java: '', python: '', cpp: '', javascript: '' },
  functionSignature: { java: '', python: '', cpp: '', javascript: '' },
  expectedComplexity: '',
  hints: [''],
  editorial: '',
  tags: [],
  relatedResources: [{ title: '', url: '', type: 'article' }],
  isPublished: false
};

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const tabs = ['basic', 'statement', 'test-cases', 'starter-code', 'resources'];

const normalizeProblem = (problem = {}) => ({
  ...defaultProblem,
  ...problem,
  domain: problem.domain?._id || problem.domain || '',
  phase: problem.phase?._id || problem.phase || '',
  tags: Array.isArray(problem.tags) ? problem.tags : defaultProblem.tags,
  examples: problem.examples?.length ? problem.examples : defaultProblem.examples,
  visibleTestCases: problem.visibleTestCases?.length
    ? problem.visibleTestCases
    : defaultProblem.visibleTestCases,
  hiddenTestCases: problem.hiddenTestCases?.length
    ? problem.hiddenTestCases
    : defaultProblem.hiddenTestCases,
  hints: problem.hints?.length ? problem.hints : defaultProblem.hints,
  relatedResources: problem.relatedResources?.length
    ? problem.relatedResources
    : defaultProblem.relatedResources,
  starterCode: { ...defaultProblem.starterCode, ...(problem.starterCode || {}) },
  functionSignature: {
    ...defaultProblem.functionSignature,
    ...(problem.functionSignature || {})
  }
});

const ProblemForm = ({
  initialValues = defaultProblem,
  onSubmit,
  submitLabel = 'Save Problem',
  loading = false,
  initialTab = 'basic'
}) => {
  const [formData, setFormData] = useState(normalizeProblem(initialValues));
  const [activeTab, setActiveTab] = useState(initialTab);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [domains, setDomains] = useState([]);
  const [phases, setPhases] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setFormData(normalizeProblem(initialValues));
    setActiveTab(initialTab);
    setSlugTouched(Boolean(initialValues?.slug));
  }, [initialValues, initialTab]);

  useEffect(() => {
    api.get('/domains').then((response) => setDomains(response.data.data || []));
  }, []);

  useEffect(() => {
    if (!formData.domain) {
      setPhases([]);
      setTopics([]);
      return;
    }

    api.get(`/phases/domain/${formData.domain}`).then((response) => {
      setPhases(response.data.data || []);
    });
  }, [formData.domain]);

  useEffect(() => {
    if (!formData.phase) {
      setTopics([]);
      return;
    }

    api.get(`/topics/phase/${formData.phase}`).then((response) => {
      setTopics(response.data.data || []);
    });
  }, [formData.phase]);

  useEffect(() => {
    if (!slugTouched) {
      setFormData((current) => ({ ...current, slug: makeSlug(current.title || '') }));
    }
  }, [formData.title, slugTouched]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateExample = (index, field, value) => {
    updateField(
      'examples',
      formData.examples.map((example, exampleIndex) =>
        exampleIndex === index ? { ...example, [field]: value } : example
      )
    );
  };

  const addExample = () =>
    updateField('examples', [...formData.examples, { input: '', output: '', explanation: '' }]);

  const removeExample = (index) =>
    updateField(
      'examples',
      formData.examples.filter((_, exampleIndex) => exampleIndex !== index)
    );

  const updateHint = (index, value) =>
    updateField(
      'hints',
      formData.hints.map((hint, hintIndex) => (hintIndex === index ? value : hint))
    );

  const addHint = () => updateField('hints', [...formData.hints, '']);
  const removeHint = (index) =>
    updateField('hints', formData.hints.filter((_, hintIndex) => hintIndex !== index));

  const updateResource = (index, field, value) =>
    updateField(
      'relatedResources',
      formData.relatedResources.map((resource, resourceIndex) =>
        resourceIndex === index ? { ...resource, [field]: value } : resource
      )
    );

  const addResource = () =>
    updateField('relatedResources', [
      ...formData.relatedResources,
      { title: '', url: '', type: 'article' }
    ]);

  const removeResource = (index) =>
    updateField(
      'relatedResources',
      formData.relatedResources.filter((_, resourceIndex) => resourceIndex !== index)
    );

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      hints: formData.hints.filter(Boolean),
      tags: typeof formData.tags === 'string'
        ? formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
        : formData.tags,
      phase: formData.phase || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-3 flex flex-wrap gap-2 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
              activeTab === tab
                ? 'bg-[#2563eb] text-white'
                : 'bg-[#f8fafc] text-[#667085] border border-[#e2e8f0]'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <div className="card p-6 bg-white grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(event) => {
                setSlugTouched(true);
                updateField('slug', event.target.value);
              }}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Domain
            </label>
            <select
              value={formData.domain}
              onChange={(event) => updateField('domain', event.target.value)}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            >
              <option value="">Select domain</option>
              {domains.map((domain) => (
                <option key={domain._id} value={domain._id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Phase
            </label>
            <select
              value={formData.phase}
              onChange={(event) => updateField('phase', event.target.value)}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            >
              <option value="">No specific phase</option>
              {phases.map((phase) => (
                <option key={phase._id} value={phase._id}>
                  Phase {phase.phaseNumber}: {phase.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Topic
            </label>
            <input
              list="topic-options"
              value={formData.topic}
              onChange={(event) => updateField('topic', event.target.value)}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            />
            <datalist id="topic-options">
              {topics.map((topic) => (
                <option key={topic._id} value={topic.title} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(event) => updateField('difficulty', event.target.value)}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Problem Type
            </label>
            <select
              value={formData.problemType}
              onChange={(event) => updateField('problemType', event.target.value)}
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            >
              <option value="Coding">Coding</option>
              <option value="MCQ">MCQ</option>
              <option value="Theory">Theory</option>
              <option value="Debugging">Debugging</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Expected Complexity
            </label>
            <input
              type="text"
              value={formData.expectedComplexity}
              onChange={(event) => updateField('expectedComplexity', event.target.value)}
              placeholder="O(n) time, O(1) space"
              className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-[#e5e7eb] px-4 py-3">
            <div>
              <div className="text-sm font-black text-[#101828]">Published</div>
              <div className="text-xs font-medium text-[#667085]">
                Students can only see published problems.
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(event) => updateField('isPublished', event.target.checked)}
              className="h-5 w-5 accent-[#2563eb]"
            />
          </div>
        </div>
      )}

      {activeTab === 'statement' && (
        <div className="space-y-6">
          <div className="card p-6 bg-white space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                rows={8}
                className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Input Format
                </label>
                <textarea
                  value={formData.inputFormat}
                  onChange={(event) => updateField('inputFormat', event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Output Format
                </label>
                <textarea
                  value={formData.outputFormat}
                  onChange={(event) => updateField('outputFormat', event.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Constraints
              </label>
              <textarea
                value={formData.constraints}
                onChange={(event) => updateField('constraints', event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          <div className="card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#101828]">Examples</h4>
              <button type="button" onClick={addExample} className="btn-secondary">
                Add Example
              </button>
            </div>

            {formData.examples.map((example, index) => (
              <div key={`example-${index + 1}`} className="rounded-2xl border border-[#e5e7eb] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#667085]">
                    Example {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="text-xs font-black uppercase tracking-widest text-rose-600"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={example.input}
                  onChange={(event) => updateExample(index, 'input', event.target.value)}
                  rows={3}
                  placeholder="Input"
                  className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                />
                <textarea
                  value={example.output}
                  onChange={(event) => updateExample(index, 'output', event.target.value)}
                  rows={3}
                  placeholder="Output"
                  className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                />
                <textarea
                  value={example.explanation}
                  onChange={(event) => updateExample(index, 'explanation', event.target.value)}
                  rows={3}
                  placeholder="Explanation"
                  className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'test-cases' && (
        <div className="grid gap-6">
          <div className="card p-6 bg-white">
            <TestCaseEditor
              label="Visible Test Cases"
              value={formData.visibleTestCases}
              onChange={(nextCases) => updateField('visibleTestCases', nextCases)}
            />
          </div>
          <div className="card p-6 bg-white">
            <TestCaseEditor
              label="Hidden Test Cases"
              value={formData.hiddenTestCases}
              onChange={(nextCases) => updateField('hiddenTestCases', nextCases)}
            />
          </div>
        </div>
      )}

      {activeTab === 'starter-code' && (
        <div className="card p-6 bg-white">
          <StarterCodeEditor
            value={formData.starterCode}
            functionSignature={formData.functionSignature}
            onChange={(nextStarterCode) => updateField('starterCode', nextStarterCode)}
            onFunctionSignatureChange={(nextSignature) =>
              updateField('functionSignature', nextSignature)
            }
          />
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="card p-6 bg-white space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Editorial
              </label>
              <textarea
                value={formData.editorial}
                onChange={(event) => updateField('editorial', event.target.value)}
                rows={8}
                className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Tags
              </label>
              <input
                type="text"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                onChange={(event) => updateField('tags', event.target.value)}
                placeholder="array, binary-search, greedy"
                className="w-full rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-[#101828]">Hints</h4>
                <button type="button" onClick={addHint} className="btn-secondary">
                  Add Hint
                </button>
              </div>

              {formData.hints.map((hint, index) => (
                <div key={`hint-${index + 1}`} className="flex gap-3">
                  <input
                    type="text"
                    value={hint}
                    onChange={(event) => updateHint(index, event.target.value)}
                    className="flex-1 rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                  />
                  <button
                    type="button"
                    onClick={() => removeHint(index)}
                    className="text-xs font-black uppercase tracking-widest text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 bg-white space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#101828]">Related Resources</h4>
              <button type="button" onClick={addResource} className="btn-secondary">
                Add Resource
              </button>
            </div>

            {formData.relatedResources.map((resource, index) => (
              <div key={`resource-${index + 1}`} className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={resource.title}
                  onChange={(event) => updateResource(index, 'title', event.target.value)}
                  placeholder="Resource title"
                  className="rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                />
                <input
                  type="url"
                  value={resource.url}
                  onChange={(event) => updateResource(index, 'url', event.target.value)}
                  placeholder="https://..."
                  className="rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={resource.type}
                    onChange={(event) => updateResource(index, 'type', event.target.value)}
                    placeholder="article"
                    className="flex-1 rounded-2xl border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] outline-none focus:border-[#2563eb]"
                  />
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-xs font-black uppercase tracking-widest text-rose-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProblemForm;
