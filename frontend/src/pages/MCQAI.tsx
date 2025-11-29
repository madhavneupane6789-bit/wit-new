import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateMcqQuestion, McqQuestionResponse } from '../services/mcqAiApi';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Spinner } from '../components/UI/Spinner';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { suggestMcq } from '../services/mcqApi';

export default function MCQAI() {
  const [topic, setTopic] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [model, setModel] = useState<'gemini' | 'deepseek'>('gemini');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [queue, setQueue] = useState<McqQuestionResponse[]>([]);
  const queueRef = useRef<McqQuestionResponse[]>([]);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoading = isPrefetching;

  const saveMutation = useMutation({
    mutationFn: suggestMcq,
    onSuccess: () => {
      setSaveMessage('Sent to question bank for admin approval.');
    },
    onError: (err: any) => {
      setSaveMessage(err.message || 'Failed to send suggestion.');
    },
  });

  const updateQueue = (updater: (prev: McqQuestionResponse[]) => McqQuestionResponse[]) => {
    setQueue((prev) => {
      const next = updater(prev);
      queueRef.current = next;
      return next;
    });
  };

  const fillQueue = async (resetQueue = false) => {
    if (resetQueue) {
      updateQueue(() => []);
    }
    setIsPrefetching(true);
    setError(null);
    try {
      while (queueRef.current.length < 3) {
        const mcq = await generateMcqQuestion({ topic: topic.trim(), model });
        updateQueue((prev) => [...prev, mcq]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate MCQ.');
    } finally {
      setIsPrefetching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    setSelectedOption(null);
    setShowAnswer(false);
    fillQueue(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const fetchNext = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setSaveMessage(null);
    updateQueue((prev) => prev.slice(1));
    // Top up in the background to keep 3 in the queue
    void fillQueue(false);
  };

  return (
    <DashboardLayout title="AI MCQ Generator">
      <div className="mb-6 flex items-center gap-2">
        <Link to="/dashboard">
          <Button variant="ghost">← Back</Button>
        </Link>
        <Link to="/mcq">
          <Button variant="ghost">MCQ Practice</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary">Prompt</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Generate an MCQ</h2>
            <p className="text-sm text-slate-300">
              Enter any topic and let AI craft a question with options and explanation.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Constitutional law, Organic chemistry, Basic algebra"
              className="glass w-full rounded-xl border-transparent bg-black/30 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${model === 'gemini' ? 'glass' : 'bg-black/20'}`}>
                <input
                  type="radio"
                  name="model"
                  value="gemini"
                  checked={model === 'gemini'}
                  onChange={() => setModel('gemini')}
                />
                Gemini (free)
              </label>
              <label className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${model === 'deepseek' ? 'glass' : 'bg-black/20'}`}>
                <input
                  type="radio"
                  name="model"
                  value="deepseek"
                  checked={model === 'deepseek'}
                  onChange={() => setModel('deepseek')}
                />
                DeepSeek
              </label>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Spinner /> : 'Generate MCQ'}
            </Button>
            {error && <p className="text-sm text-rose-400">{error}</p>}
          </form>
        </Card>

        <Card className="lg:col-span-2">
          {(!queue.length && isPrefetching) ? (
            <div className="flex h-full min-h-[260px] items-center justify-center text-slate-400 text-sm">
              <Spinner />
            </div>
          ) : !queue.length ? (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-slate-400 text-sm">
              {error ? <p className="text-rose-400">{error}</p> : 'Ask for a topic to see the generated question here.'}
            </div>
          ) : (
            <div className="space-y-5">
              {error && <p className="text-sm text-rose-400">{error}</p>}
              {isPrefetching && <p className="text-xs text-slate-400">Preloading next questions...</p>}
              {queue.length > 1 && <p className="text-xs text-slate-400">Up next: {queue.length - 1} question(s) ready.</p>}
              {queue[0] && (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">Question</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{queue[0].question}</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(queue[0].options).map(([key, value]) => {
                      const isSelected = selectedOption === key;
                      const isCorrect = queue[0].correctAnswer === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleOptionSelect(key)}
                          className={`glass flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                            isSelected
                              ? isCorrect
                                ? 'border-emerald-500/50 bg-emerald-500/20 text-white'
                                : 'border-rose-500/50 bg-rose-500/20 text-white'
                              : 'border-transparent hover:bg-white/10'
                          } ${isCorrect && showAnswer && !isSelected ? 'border-emerald-500/50 bg-emerald-500/20' : ''}`}
                          disabled={showAnswer}
                        >
                          <span className="font-semibold text-white">
                            {key}. {value}
                          </span>
                          {isSelected && <span className="text-xs">{isCorrect ? 'Correct' : 'Your choice'}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {showAnswer && (
                    <div className="rounded-xl bg-black/30 p-4 text-slate-100">
                      <p className="text-sm">
                        Your answer:{' '}
                        <span className={selectedOption === queue[0].correctAnswer ? 'text-emerald-400' : 'text-rose-400'}>
                          {selectedOption === queue[0].correctAnswer ? 'Correct' : 'Incorrect'}
                        </span>
                      </p>
                      <p className="text-sm">
                        Correct: <span className="text-emerald-400">{queue[0].correctAnswer}</span>
                      </p>
                      <p className="mt-3 text-sm text-slate-200">
                        {queue[0].explanation}
                      </p>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (!queue[0]) return;
                    setSaveMessage(null);
                    saveMutation.mutate({
                      question: queue[0].question,
                      optionA: queue[0].options.A,
                      optionB: queue[0].options.B,
                      optionC: queue[0].options.C,
                      optionD: queue[0].options.D,
                      correctOption: queue[0].correctAnswer,
                      explanation: queue[0].explanation,
                    });
                  }}
                  disabled={!queue[0] || saveMutation.isLoading}
                >
                  {saveMutation.isLoading ? 'Sending...' : 'Save to question bank'}
                </Button>
                <Button variant="ghost" onClick={() => { setSelectedOption(null); setShowAnswer(false); }}>
                  Reset choices
                </Button>
                <Button onClick={fetchNext} disabled={!topic}>
                  Next question
                </Button>
              </div>
              {saveMessage && <p className="text-sm text-slate-300">{saveMessage}</p>}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
