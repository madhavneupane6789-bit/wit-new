import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { generateAiMcq } from '../services/mcqAiApi';
import { McqQuestionResponse } from '../../backend/src/mcq-ai/mcq-ai.service'; // Adjust path

const MCQAI: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [mcq, setMcq] = useState<McqQuestionResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleGenerateMcq = async () => {
    setLoading(true);
    setError(null);
    setMcq(null);
    setSelectedOption(null);
    setFeedback(null);
    setShowExplanation(false);
    try {
      const generatedMcq = await generateAiMcq(topic);
      setMcq(generatedMcq);
    } catch (err: any) {
      setError(err.message || 'Failed to generate MCQ.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === mcq?.correctAnswer) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect.');
    }
    setShowExplanation(true);
  };

  const getOptionClass = (optionKey: string) => {
    if (!showExplanation) {
      return '';
    }
    if (optionKey === mcq?.correctAnswer) {
      return 'bg-green-600 text-white'; // Correct answer
    }
    if (optionKey === selectedOption && optionKey !== mcq?.correctAnswer) {
      return 'bg-red-600 text-white'; // Incorrectly selected
    }
    return '';
  };

  return (
    <DashboardLayout title="AI MCQ Generator">
      <div className="space-y-6">
        <Card>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Generate new MCQ</p>
          <div className="mt-3 flex gap-3">
            <input
              type="text"
              placeholder="Enter topic (e.g., 'Nepalese History', 'Science')"
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button onClick={handleGenerateMcq} disabled={loading || !topic}>
              {loading ? 'Generating...' : 'Generate MCQ'}
            </Button>
          </div>
          {error && <p className="text-sm text-rose-500 mt-2">{error}</p>}
        </Card>

        {mcq && (
          <Card>
            <p className="text-lg font-semibold text-white mb-4">{mcq.question}</p>
            <div className="space-y-2">
              {Object.entries(mcq.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedOption === key ? 'bg-primary-dark/50' : 'hover:bg-black/10'
                  } ${getOptionClass(key)}`}
                  onClick={() => !showExplanation && setSelectedOption(key)}
                >
                  <input
                    type="radio"
                    name="mcq-option"
                    value={key}
                    checked={selectedOption === key}
                    onChange={() => setSelectedOption(key)}
                    className="mr-3"
                    disabled={showExplanation}
                  />
                  <label className="text-white">
                    <strong>{key}.</strong> {value}
                  </label>
                </div>
              ))}
            </div>
            {!showExplanation && (
              <Button onClick={handleSubmitAnswer} disabled={!selectedOption} className="mt-4 w-full">
                Submit Answer
              </Button>
            )}
            {feedback && (
              <p className={`mt-4 text-center font-bold ${feedback === 'Correct!' ? 'text-green-500' : 'text-red-500'}`}>
                {feedback}
              </p>
            )}
            {showExplanation && mcq.explanation && (
              <div className="mt-4 p-4 bg-black/20 rounded-lg text-white">
                <h3 className="font-semibold text-md mb-2">Explanation:</h3>
                <p>{mcq.explanation}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MCQAI;
