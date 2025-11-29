import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import {
  MCQQuestion,
  adminCreateMcq,
  adminDeleteMcq,
  fetchMcqQuestions,
  adminListSuggestions,
  MCQSuggestion,
  adminApproveSuggestion,
  adminRejectSuggestion,
} from '../../services/mcqApi';

export const MCQManagement: React.FC = () => {
  const [mcqForm, setMcqForm] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
  });
  const [mcqList, setMcqList] = useState<MCQQuestion[]>([]);
  const [suggestions, setSuggestions] = useState<MCQSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadMcq = async () => {
    try {
      const [res, suggs] = await Promise.all([fetchMcqQuestions(), adminListSuggestions()]);
      setMcqList(res);
      setSuggestions(suggs);
    } catch (err: any) {
      setError(err.message || 'Failed to load MCQs');
    }
  };

  useEffect(() => {
    loadMcq();
  }, []);

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <Card>
        <p className="text-xs uppercase tracking-[0.22em] text-secondary">Add MCQ</p>
        <form
          className="mt-3 grid gap-3 md:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await adminCreateMcq(mcqForm);
              setMcqForm({ ...mcqForm, question: '', optionA: '', optionB: '', optionC: '', optionD: '', explanation: '' });
              await loadMcq();
              alert('Question added');
            } catch (err: any) {
              setError(err.message || 'Failed to add question');
            }
          }}
        >
          <textarea
            className="glass md:col-span-2 w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Question"
            value={mcqForm.question}
            onChange={(e) => setMcqForm((p) => ({ ...p, question: e.target.value }))}
            required
          />
          {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((field, idx) => (
            <input
              key={field}
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              value={mcqForm[field]}
              onChange={(e) => setMcqForm((p) => ({ ...p, [field]: e.target.value }))}
              required
            />
          ))}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-white">Correct</label>
            <select
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={mcqForm.correctOption}
              onChange={(e) => setMcqForm((p) => ({ ...p, correctOption: e.target.value as 'A' | 'B' | 'C' | 'D' }))}
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <textarea
            className="glass md:col-span-2 w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Explanation (optional)"
            value={mcqForm.explanation}
            onChange={(e) => setMcqForm((p) => ({ ...p, explanation: e.target.value }))}
          />
          <Button type="submit" className="md:col-span-2">
            Save question
          </Button>
        </form>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary">Question Bank</p>
            <h3 className="text-xl font-semibold text-white">Recent questions</h3>
          </div>
          <Button variant="ghost" onClick={loadMcq}>
            Refresh
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          {mcqList.length === 0 && <p className="text-sm text-slate-400">No questions yet.</p>}
          {mcqList.map((q) => (
            <div key={q.id} className="glass rounded-2xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">{q.question}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                    <li>A. {q.optionA}</li>
                    <li>B. {q.optionB}</li>
                    <li>C. {q.optionC}</li>
                    <li>D. {q.optionD}</li>
                  </ul>
                  <p className="mt-2 text-xs text-emerald-400">Correct: {q.correctOption}</p>
                  {q.explanation && <p className="text-xs text-slate-400">Explanation: {q.explanation}</p>}
                </div>
                <Button
                  variant="ghost"
                  onClick={async () => {
                    if (!confirm('Delete this question?')) return;
                    try {
                      await adminDeleteMcq(q.id);
                      await loadMcq();
                    } catch (err: any) {
                      setError(err.message || 'Delete failed');
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary">User suggestions</p>
            <h3 className="text-xl font-semibold text-white">Pending AI submissions</h3>
          </div>
          <Button variant="ghost" onClick={loadMcq}>
            Refresh
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          {suggestions.length === 0 && <p className="text-sm text-slate-400">No pending suggestions.</p>}
          {suggestions.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white">{s.question}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                    <li>A. {s.optionA}</li>
                    <li>B. {s.optionB}</li>
                    <li>C. {s.optionC}</li>
                    <li>D. {s.optionD}</li>
                  </ul>
                  <p className="mt-2 text-xs text-emerald-400">Correct: {s.correctOption}</p>
                  {s.explanation && <p className="text-xs text-slate-400">Explanation: {s.explanation}</p>}
                  {s.submittedBy && (
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted by {s.submittedBy.name || s.submittedBy.email}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={async () => {
                      try {
                        await adminApproveSuggestion(s.id);
                        await loadMcq();
                      } catch (err: any) {
                        setError(err.message || 'Approve failed');
                      }
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      try {
                        await adminRejectSuggestion(s.id);
                        await loadMcq();
                      } catch (err: any) {
                        setError(err.message || 'Reject failed');
                      }
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
