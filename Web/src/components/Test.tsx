import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import { calculateMBTI } from '../utils/mbti';
import { useAuth } from '../contexts/AuthContext';
import './Test.css';

const Test: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { user, addTestResult } = useAuth();

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion];
    const newAnswers = { ...answers };
    
    // 计算得分：1-7分，转换为-3到3的范围
    const score = value - 4;
    newAnswers[question.dimension] = (newAnswers[question.dimension] || 0) + score;
    
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 测试完成，计算结果
      const result = calculateMBTI(newAnswers);
      // 保存测试结果到用户历史
      if (user) {
        addTestResult(result);
      }
      navigate('/result', { state: { result } });
    }
  };

  const current = questions[currentQuestion];

  return (
    <div className="test-container page-transition">
      <div className="test-header">
        <h1>MBTI性格测试</h1>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="progress-text">
          问题 {currentQuestion + 1}/{questions.length}
        </p>
      </div>
      
      <div className="question-card">
        <h2>{current.text}</h2>
        <div className="options-container">
          {current.options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleAnswer(option.value)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
      
      <div className="test-navigation">
        {currentQuestion > 0 && (
          <button 
            className="nav-button"
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            上一题
          </button>
        )}
        <span className="question-number">{currentQuestion + 1}/{questions.length}</span>
        {currentQuestion < questions.length - 1 && (
          <button 
            className="nav-button"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
          >
            跳过
          </button>
        )}
      </div>
    </div>
  );
};

export default Test;