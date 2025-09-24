/**
 * React 组件模块
 * 包含应用的主要UI组件
 */

import React, { useState } from 'react';
import { getDivination } from './divination.js';

/**
 * 输入表单组件
 * 用于用户输入三个三位数进行占卜
 * @param {Object} props - 组件属性
 * @param {Function} props.onSubmit - 表单提交处理函数
 */
export function InputForm({ onSubmit }) {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证输入
    if (!num1 || !num2 || !num3) {
      setError('请输入三个三位数');
      return;
    }

    const n1 = parseInt(num1);
    const n2 = parseInt(num2);
    const n3 = parseInt(num3);

    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
      setError('请输入有效的数字');
      return;
    }

    if (n1 < 100 || n1 > 999 || n2 < 100 || n2 > 999 || n3 < 100 || n3 > 999) {
      setError('请输入三个三位数');
      return;
    }

    setError('');
    onSubmit(n1, n2, n3);
  };

  return (
    <div className="input-section">
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label>第一个三位数</label>
          <input
            type="number"
            placeholder="100-999"
            min="100"
            max="999"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>第二个三位数</label>
          <input
            type="number"
            placeholder="100-999"
            min="100"
            max="999"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>第三个三位数</label>
          <input
            type="number"
            placeholder="100-999"
            min="100"
            max="999"
            value={num3}
            onChange={(e) => setNum3(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button 
          type="submit" 
          className="submit-button"
          disabled={!num1 || !num2 || !num3}
        >
          <span className="button-text">开始占卜</span>
          <span className="button-gradient"></span>
        </button>
      </form>
    </div>
  );
}

/**
   * 结果展示组件
   * 用于显示占卜结果
   * @param {Object} props - 组件属性
   * @param {Object} props.divinationResult - 占卜结果对象
   * @param {Object} props.aiInterpretation - AI解释对象
   * @param {Function} props.onRestart - 重新开始函数
   */
export function ResultDisplay({ divinationResult, aiInterpretation, onRestart }) {
  if (!divinationResult) return null;

  // 颜色映射
  const goodLuckColorMap = {
    "吉": "#4CAF50",
    "凶": "#F44336",
    "无咎": "#2196F3",
    "贞吉": "#8BC34A",
    "悔亡": "#FFC107",
    "厉": "#FF9800",
    "吝": "#9E9E9E"
  };

  const getLuckColor = (text) => {
    for (const [key, color] of Object.entries(goodLuckColorMap)) {
      if (text.includes(key)) {
        return color;
      }
    }
    return "#757575";
  };

  // 检查aiInterpretation是否为对象并包含必要的属性
  const isCompleteInterpretation = aiInterpretation && 
    typeof aiInterpretation === 'object' &&
    aiInterpretation.hexagramOverview &&
    aiInterpretation.hexagramAnalysis &&
    aiInterpretation.problemAnalysis;

  return (
    <div className="result-display">
      
      <div className="section">
        <h3 className="section-title">卦名</h3>
        <div className={`gua-name ${divinationResult.guaName.includes('吉') ? 'lucky' : divinationResult.guaName.includes('凶') ? 'unlucky' : 'neutral'}`}>
          {divinationResult.guaName}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">爻辞</h3>
        <div className="yao-info">
          <div className="yao-ci">{divinationResult.yaoCi}</div>
          <div className="yao-index">第{divinationResult.yaoIndex}爻</div>
        </div>
      </div>

      {aiInterpretation && (
        <div className="section">
          <h3 className="section-title">AI解读</h3>
          {isCompleteInterpretation ? (
            <div className="interpretation-content">
              <div className="interpretation-part">
                <h4>卦象概览</h4>
                <p><strong>卦名：</strong>{aiInterpretation.hexagramOverview.hexagram}</p>
                <p><strong>象辞：</strong>{aiInterpretation.hexagramOverview.xiangCi}</p>
                <p><strong>卦辞：</strong>{aiInterpretation.hexagramOverview.guaCi}</p>
                <p><strong>爻辞：</strong>{aiInterpretation.hexagramOverview.yaoCi}</p>
                <p><strong>吉凶：</strong><span style={{color: getLuckColor(aiInterpretation.hexagramOverview.fortune)}}>
                  {aiInterpretation.hexagramOverview.fortune}
                </span></p>
                <p><strong>关键提示：</strong>{aiInterpretation.hexagramOverview.keyHint}</p>
              </div>
              
              <div className="interpretation-part">
                <h4>卦象分析</h4>
                <p><strong>象辞解读：</strong>{aiInterpretation.hexagramAnalysis.xiangCiInterpretation}</p>
                <p><strong>卦辞精要：</strong>{aiInterpretation.hexagramAnalysis.guaCiEssence}</p>
                <p><strong>爻辞分析：</strong>{aiInterpretation.hexagramAnalysis.yaoCiAnalysis}</p>
                <p><strong>变卦分析：</strong>{aiInterpretation.hexagramAnalysis.changedHexagramAnalysis}</p>
              </div>
              
              <div className="interpretation-part">
                <h4>问题分析与建议</h4>
                <p><strong>分析：</strong>{aiInterpretation.problemAnalysis.analysis}</p>
                <div>
                  <strong>建议：</strong>
                  <ul>
                    {aiInterpretation.problemAnalysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {aiInterpretation.reminder && (
                <div className="interpretation-part reminder">
                  <strong>温馨提醒：</strong>{aiInterpretation.reminder}
                </div>
              )}
            </div>
          ) : (
            // 如果不是预期的对象格式，尝试显示原始内容
            <div className="interpretation-content simple">
              {typeof aiInterpretation === 'string' ? aiInterpretation : JSON.stringify(aiInterpretation)}
            </div>
          )}
        </div>
      )}

      <button className="reset-button" onClick={onRestart}>
        重新占卜
      </button>
    </div>
  );
}

/**
 * 加载状态组件
 * 显示加载动画
 */
export function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">正在获取AI解读...</p>
    </div>
  );
}

/**
 * 错误信息组件
 * 显示错误信息和重试按钮
 * @param {Object} props - 组件属性
 * @param {string} props.error - 错误信息
 * @param {Function} props.onRetry - 重试函数
 */
export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{error}</p>
      <button className="reset-button" onClick={onRetry}>
        重试
      </button>
    </div>
  );
}