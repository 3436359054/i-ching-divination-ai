import React from 'react';

interface InputFormProps {
  question: string;
  setQuestion: (question: string) => void;
  numbers: [string, string, string];
  setNumbers: (numbers: [string, string, string]) => void;
  onSubmit: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ question, setQuestion, numbers, setNumbers, onSubmit }) => {
  
  const handleNumberChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 3) {
      const newNumbers = [...numbers] as [string, string, string];
      newNumbers[index] = value;
      setNumbers(newNumbers);
    }
  };
  
  const isFormValid = question.trim().length > 0 && numbers.every(n => /^\d{3}$/.test(n));

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-lg font-semibold text-cyan-700 mb-2">
          心中默念你的问题，然后写下来：
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例如：我今年的事业运如何？"
          className="w-full h-24 p-3 bg-gray-100/50 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300 resize-none"
        />
      </div>
      <div>
        <p className="block text-lg font-semibold text-cyan-700 mb-2">
          凭直觉输入三个三位数：
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              value={numbers[index]}
              onChange={(e) => handleNumberChange(index, e.target.value)}
              placeholder="100-999"
              className="w-full p-3 text-center bg-gray-100/50 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-300"
            />
          ))}
        </div>
      </div>
      <div className="pt-4">
        <button
          onClick={onSubmit}
          disabled={!isFormValid}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-500"
        >
          确定
        </button>
      </div>
    </div>
  );
};
