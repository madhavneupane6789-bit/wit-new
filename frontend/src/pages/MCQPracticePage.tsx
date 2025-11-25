import React, { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Spinner } from '../components/UI/Spinner';
import { MCQQuestion, fetchMcqQuestions, submitMcqAnswer } from '../services/mcqApi';
import { useNavigate } from 'react-router-dom';

const MCQPracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<{ choice: string; correct: boolean; correctOption: string; explanation?: string } | null>(
    null,
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = await fetchMcqQuestions();
        setQuestions(q);
        setIndex(0);
        setAnswerState(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const current = useMemo(() => questions[index], [questions, index]);

  const handleAnswer = async (choice: 'A' | 'B' | 'C' | 'D') => {
    if (!current) return;
    try {
      const res = await submitMcqAnswer(current.id, choice);
      setAnswerState({ choice, correct: res.correct, correctOption: res.correctOption, explanation: res.explanation });
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    }
  };

  const next = () => {
    setAnswerState(null);
    setIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const prev = () => {
    setAnswerState(null);
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <DashboardLayout title="MCQ Practice">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
        {questions.length > 0 && (
          <span className="text-sm text-slate-600">
            Question {index + 1} of {questions.length}
          </span>
        )}
      </div>
      {loading ? (
        <Card className="bg-white/80">
          <Spinner />
        </Card>
      ) : error ? (
        <Card className="bg-white/80">
          <p className="text-sm text-rose-500">{error}</p>
        </Card>
      ) : !current ? (
        <Card className="bg-white/80">
          <p className="text-sm text-slate-500">No questions yet.</p>
        </Card>
      ) : (
        <Card className="bg-white/90">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Practice</p>
          <h3 className="mt-2 text-2xl font-semibold text-midnight">{current.question}</h3>
          <div className="mt-4 grid gap-3">
            {(['A', 'B', 'C', 'D'] as const).map((opt) => {
              const label =
                opt === 'A'
                  ? current.optionA
                  : opt === 'B'
                  ? current.optionB
                  : opt === 'C'
                  ? current.optionC
                  : current.optionD;
              const isChosen = answerState?.choice === opt;
              const isCorrectOpt = answerState?.correctOption === opt;
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    isChosen
                      ? answerState?.correct
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                        : 'border-rose-400 bg-rose-50 text-rose-900'
                      : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-sm'
                  } ${isCorrectOpt && !answerState?.correct ? 'border-emerald-300 bg-emerald-50' : ''}`}
                  disabled={!!answerState}
                >
                  <span className="font-semibold text-midnight">{opt}. {label}</span>
                  {isChosen && <span className="text-xs">{answerState?.correct ? 'Correct' : 'Your choice'}</span>}
                </button>
              );
            })}
          </div>
          {answerState && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-midnight">
              <p className="font-semibold">{answerState.correct ? 'Well done!' : 'Not quite.'}</p>
              <p className="mt-1">Correct answer: {answerState.correctOption}</p>
              {answerState.explanation && <p className="mt-2 text-slate-600">{answerState.explanation}</p>}
            </div>
          )}
          <div className="mt-4 flex items-center gap-2">
            <Button variant="ghost" onClick={prev} disabled={index === 0}>
              Previous
            </Button>
            <Button onClick={next} disabled={index >= questions.length - 1}>
              Next
            </Button>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default MCQPracticePage;
