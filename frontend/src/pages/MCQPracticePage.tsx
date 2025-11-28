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
      </div>
      {loading ? (
        <Card>
          <Spinner />
        </Card>
      ) : error ? (
        <Card>
          <p className="text-sm text-rose-400">{error}</p>
        </Card>
      ) : !current ? (
        <Card>
          <p className="text-sm text-slate-400">No questions yet.</p>
        </Card>
      ) : (
        <Card>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Practice</p>
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Question {index + 1} of {questions.length}
            </p>
          </div>
          <h3 className="mt-2 text-2xl font-semibold text-white">{current.question}</h3>
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
                  className={`glass flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                    isChosen
                      ? answerState?.correct
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-white'
                        : 'border-rose-500/50 bg-rose-500/20 text-white'
                      : 'border-transparent hover:bg-white/10'
                  } ${isCorrectOpt && !answerState?.correct ? 'border-emerald-500/50 bg-emerald-500/20' : ''}`}
                  disabled={!!answerState}
                >
                  <span className="font-semibold text-white">{opt}. {label}</span>
                  {isChosen && <span className="text-xs">{answerState?.correct ? 'Correct' : 'Your choice'}</span>}
                </button>
              );
            })}
          </div>
          {answerState && (
            <div className="mt-4 rounded-xl bg-opacity-50 p-4" style={{ backgroundColor: answerState.correct ? 'rgba(45, 212, 191, 0.1)' : 'rgba(244, 63, 94, 0.1)' }}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {answerState.correct ? (
                    <svg className="h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-rose-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium" style={{ color: answerState.correct ? '#34D399' : '#F87171' }}>
                    {answerState.correct ? 'Well done!' : 'Not quite.'}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-sm text-white">
                <p>Correct answer: {answerState.correctOption}</p>
                {answerState.explanation && <p className="mt-2 text-slate-300">{answerState.explanation}</p>}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="ghost" onClick={prev} disabled={index === 0}>
                    Previous
                </Button>
                <Button onClick={next} disabled={index >= questions.length - 1}>
                  Next Question
                </Button>
              </div>
            </div>
          )}
          {!answerState && <div className="mt-4 flex items-center gap-2">
            <Button variant="ghost" onClick={prev} disabled={index === 0}>
              Previous
            </Button>
            <Button onClick={next} disabled={index >= questions.length - 1}>
              Next
            </Button>
          </div>}
        </Card>
      )}
    </DashboardLayout>
  );
};

export default MCQPracticePage;
