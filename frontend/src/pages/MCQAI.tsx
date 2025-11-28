import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateMcqQuestion } from '../services/mcqAiApi';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Spinner } from '../components/UI/Spinner';

interface McqQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export default function MCQAI() {
  const [topic, setTopic] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const { mutate, data: mcq, isLoading, isError, error, reset } = useMutation<
    McqQuestion,
    Error,
    string
  >(generateMcqQuestion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      reset(); // Reset previous state
      setSelectedOption(null);
      setShowAnswer(false);
      mutate(topic);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">MCQ with AI</h1>
      <Card className="mb-6 p-6 shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic (e.g., 'Nepalese History', 'Computer Science Basics')"
            className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200">
            {isLoading ? <Spinner /> : 'Generate MCQ'}
          </Button>
        </form>
        {isError && (
          <p className="text-red-600 mt-4">Error: {error?.message || 'Failed to generate MCQ.'}</p>
        )}
      </Card>

      {mcq && (
        <Card className="p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Question:</h2>
          <p className="text-xl mb-6 text-gray-900">{mcq.question}</p>

          <div className="space-y-3 mb-6">
            {Object.entries(mcq.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleOptionSelect(key)}
                className={`w-full text-left p-4 border rounded-md transition-colors duration-200
                  ${selectedOption === key ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50 border-gray-300'}
                  ${showAnswer && key === mcq.correctAnswer ? 'border-green-500 ring-2 ring-green-500' : ''}
                  ${showAnswer && selectedOption === key && selectedOption !== mcq.correctAnswer ? 'border-red-500 ring-2 ring-red-500' : ''}
                  `}
                disabled={showAnswer}
              >
                <span className="font-bold mr-2">{key}.</span> {value}
              </button>
            ))}
          </div>

          {showAnswer && (
            <div>
              <p className="text-lg font-bold mb-2">
                Your Answer: <span className={selectedOption === mcq.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                  {selectedOption === mcq.correctAnswer ? 'Correct!' : 'Incorrect.'}
                </span>
              </p>
              <p className="text-lg font-bold mb-2">Correct Answer: <span className="text-green-600">{mcq.correctAnswer}</span></p>
              <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">Explanation:</h3>
              <p className="text-base text-gray-800">{mcq.explanation}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}