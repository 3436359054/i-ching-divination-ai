import React, { useMemo } from 'react';
import { DivinationResult } from '../types';

interface ResultDisplayProps {
  question: string;
  divinationResult: DivinationResult;
  interpretation: string;
  onReset: () => void;
}

interface InterpretationSection {
    title: string;
    content: string;
}

// This regex will capture the title (without brackets) and the content that follows.
const sectionRegex = /【(.*?)】\n([\s\S]*?)(?=\n【|$)/g;


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ question, divinationResult, interpretation, onReset }) => {
  const parsedInterpretation = useMemo((): InterpretationSection[] => {
    if (!interpretation) return [];
    
    const sections: InterpretationSection[] = [];
    let match;
    // Use the regex to find all sections
    while ((match = sectionRegex.exec(interpretation)) !== null) {
        sections.push({
            title: match[1].trim(),
            content: match[2].trim(),
        });
    }
    
    // If regex fails for any reason, fallback to showing the whole text to prevent data loss.
    if (sections.length === 0 && interpretation) {
        return [{ title: 'AI 智解', content: interpretation }];
    }

    return sections;
  }, [interpretation]);
  
  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h2 className="text-sm font-semibold text-cyan-600 tracking-widest uppercase">你的问题</h2>
        <p className="text-xl text-gray-800 mt-1">“{question}”</p>
      </div>
      
      <div className="border-t border-gray-200"></div>

      {/* Core Divination Result */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h2 className="text-sm font-semibold text-cyan-600 tracking-widest uppercase mb-4 text-center">卜得卦象</h2>
            <div className="text-center">
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">{divinationResult.hexagramName}</p>
                <p className="text-lg text-gray-600 mt-2">{divinationResult.lineText}</p>
            </div>
          </div>
      </div>

      {/* AI Interpretation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
           <h2 className="text-lg font-bold text-cyan-700 tracking-widest uppercase mb-4">AI 智慧解读</h2>
           
            {interpretation ? (
                <div className="space-y-6">
                    {parsedInterpretation.map((section, index) => (
                         <div 
                           key={index} 
                           className="p-4 bg-white/50 rounded-md border border-gray-200/80 transition-all duration-300 hover:border-cyan-400/80 hover:shadow-md transform hover:-translate-y-1 animate-fade-in-up"
                           style={{ animationDelay: `${300 + index * 100}ms` }}
                          >
                            <h3 className="font-semibold text-cyan-600 !mb-2">{section.title}</h3>
                            <div className="prose prose-invert-disabled max-w-none text-gray-700 whitespace-pre-wrap !mt-2">
                              {section.content}
                            </div>
                         </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-gray-100/50 rounded-md border border-dashed border-gray-300/80">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <p className="ml-3 mt-4 text-cyan-600">AI 正在深度解读，请稍候...</p>
                </div>
            )}
      </div>

      <div className="pt-6 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: `${400 + parsedInterpretation.length * 100}ms` }}>
        <button
          onClick={onReset}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-400"
        >
          再问一事
        </button>
      </div>
    </div>
  );
};