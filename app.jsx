/**
 * 周易AI占卜应用主入口
 */// 导入React和必要的组件
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { InputForm, ResultDisplay, Loading, ErrorMessage } from './components.jsx';
import { getDivination } from './divination.js';
import { getInterpretation } from './deepseek-api.js';

/**
 * 应用主组件
 */
function App() {
  const [divinationResult, setDivinationResult] = useState(null);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * 处理占卜请求
   * @param {number} num1 - 第一个三位数
   * @param {number} num2 - 第二个三位数
   * @param {number} num3 - 第三个三位数
   */
  const handleDivination = async (num1, num2, num3) => {
    try {
      setError('');
      
      // 获取基本占卜结果
      const result = getDivination(num1, num2, num3);
      setDivinationResult(result);
      
      // 获取AI解读 - 修复参数顺序和类型，确保divinationData是一个对象
      setIsLoading(true);
      const question = `请为我解读周易占卜结果：${result.guaName}，第${result.yaoIndex+1}爻`;
      const interpretation = await getInterpretation(question, result);
      setAiInterpretation(interpretation);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || '获取AI解读失败，请稍后重试。');
      console.error('Divination error:', err);
    }
  };

  /**
   * 重新开始占卜
   */
  const restartDivination = () => {
    setDivinationResult(null);
    setAiInterpretation('');
    setError('');
  };

  /**
   * 重试获取AI解读
   */
  const retryInterpretation = async () => {
    if (divinationResult) {
      try {
        setError('');
        setIsLoading(true);
        const question = `请为我解读周易占卜结果：${divinationResult.guaName}，第${divinationResult.yaoIndex+1}爻`;
        const interpretation = await getInterpretation(question, divinationResult);
        setAiInterpretation(interpretation);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err.message || '获取AI解读失败，请稍后重试。');
      }
    }
  };

  // 渲染应用UI
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">周易AI占卜</h1>
        <p className="app-subtitle">探索古老智慧与现代AI的完美结合</p>
      </header>
      
      <main className="app-main">
        {error ? (
          <ErrorMessage error={error} onRetry={retryInterpretation} />
        ) : isLoading ? (
          <Loading />
        ) : divinationResult ? (
          <ResultDisplay 
            divinationResult={divinationResult} 
            aiInterpretation={aiInterpretation} 
            onRestart={restartDivination}
          />
        ) : (
          <InputForm onSubmit={handleDivination} />
        )}
      </main>
      
      <footer className="app-footer">
        <p>© 2023 周易AI占卜 - 仅供娱乐和参考</p>
      </footer>
    </div>
  );
}

export default App;

// 渲染App组件到DOM
if (typeof window !== 'undefined') {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}