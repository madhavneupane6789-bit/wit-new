import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Spinner } from '../components/UI/Spinner';
import { sendChatMessage, ChatMessage } from '../services/chatApi';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState<'gemini' | 'deepseek'>('gemini');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const nextHistory = [...messages, { role: 'user', content: text }];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const reply = await sendChatMessage(text, messages, model);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      setMessages((prev) => prev.slice(0, -1)); // remove optimistic user message
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Chat with AI">
      <div className="grid gap-4 lg:grid-cols-[3fr,1fr]">
        <Card className="min-h-[60vh]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">Conversation</p>
              <h3 className="text-xl font-semibold text-white">NEA Loksewa Coach</h3>
            </div>
            <div className="flex gap-2">
              <label className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${model === 'gemini' ? 'glass' : 'bg-black/30'}`}>
                <input type="radio" name="model" value="gemini" checked={model === 'gemini'} onChange={() => setModel('gemini')} />
                Gemini
              </label>
              <label className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${model === 'deepseek' ? 'glass' : 'bg-black/30'}`}>
                <input type="radio" name="model" value="deepseek" checked={model === 'deepseek'} onChange={() => setModel('deepseek')} />
                DeepSeek
              </label>
            </div>
          </div>
          <div className="mb-4 h-[50vh] overflow-auto rounded-xl bg-black/20 p-3 space-y-3">
            {messages.length === 0 && <p className="text-sm text-slate-400">Ask anything about NEA Loksewa prep or general topics.</p>}
            {messages.map((m, idx) => (
              <div key={idx} className={`rounded-xl p-3 ${m.role === 'user' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-slate-100'}`}>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{m.role === 'user' ? 'You' : 'AI'}</p>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Spinner /> Thinking...
              </div>
            )}
          </div>
          {error && <p className="text-sm text-rose-400 mb-2">{error}</p>}
          <form onSubmit={handleSend} className="flex flex-col gap-2 sm:flex-row">
            <input
              className="glass w-full rounded-xl border-transparent bg-black/30 px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" className="shrink-0" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Tips</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Ask for explanations of NEA syllabus topics or past Loksewa patterns.</li>
            <li>Leave topic blank in AI MCQ to get general NEA prep questions; use this chat for follow-up.</li>
            <li>Model selection uses your configured keys; Gemini recommended if DeepSeek lacks credits.</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
