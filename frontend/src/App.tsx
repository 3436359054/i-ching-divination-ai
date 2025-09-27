import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { calculateDivination } from './services/divinationService';
import { getInterpretation } from './services/deepseekService';
import { DivinationResult } from './types';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [numbers, setNumbers] = useState<[string, string, string]>(['', '', '']);
  const [divinationResult, setDivinationResult] = useState<DivinationResult | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (numbers.some(n => !/^\d{3}$/.test(n)) || !question.trim()) {
      setError('Please enter a question and three valid 3-digit numbers.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDivinationResult(null);
    setInterpretation('');

    try {
      const [num1, num2, num3] = numbers.map(Number);
      const result = calculateDivination(num1, num2, num3);
      setDivinationResult(result);

      const aiInterpretation = await getInterpretation(question, result.hexagramName, result.lineText);
      setInterpretation(aiInterpretation);

    } catch (e) {
      console.error(e);
      setError('An error occurred while consulting the oracle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [question, numbers]);
  
  const handleReset = () => {
    setQuestion('');
    setNumbers(['', '', '']);
    setDivinationResult(null);
    setInterpretation('');
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      <main className="w-full max-w-2xl mx-auto transition-all duration-500 animate-fade-in-up">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center gap-3">
            <SparklesIcon />
            AI 周易卜卦
          </h1>
          <p className="text-gray-500 mt-2">结合古老智慧与现代AI，为你解惑。</p>
        </header>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl shadow-cyan-500/10 p-6 md:p-8">
          {!divinationResult && !isLoading && (
            <InputForm
              question={question}
              setQuestion={setQuestion}
              numbers={numbers}
              setNumbers={setNumbers}
              onSubmit={handleSubmit}
            />
          )}

          {isLoading && (
             <div className="flex flex-col items-center justify-center space-y-4 h-64">
                <Loader />
                <p className="text-cyan-600 animate-pulse">正在为您解读卦象...</p>
            </div>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          {!isLoading && divinationResult && (
            <ResultDisplay
              question={question}
              divinationResult={divinationResult}
              interpretation={interpretation}
              onReset={handleReset}
            />
          )}
        </div>
        <footer className="text-center mt-8 text-gray-400 text-sm">
            <p>弘扬传统文化,预测仅供娱乐,不构成任何建议或承诺。</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
