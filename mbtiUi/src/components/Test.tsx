import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateMBTI } from '@/utils/mbti';
import { questionService } from '@/services/questionService';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import '@/components/Test.css';

const Test: React.FC = () => {
  const questions = questionService.getQuestions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [rawAnswers, setRawAnswers] = useState<{ questionId: number; value: number }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();
  const { user, addTestResult } = useAuth();

  const handleAnswer = (value: number, optIndex: number) => {
    if (transitioning) return;
    setSelectedIndex(optIndex);
    setTransitioning(true);

    setTimeout(() => {
      const question = questions[currentQuestion];
      const newAnswers = { ...answers };
      const score = value - 4;
      newAnswers[question.dimension] = (newAnswers[question.dimension] || 0) + score;
      setAnswers(newAnswers);

      const newRawAnswers = [...rawAnswers, { questionId: question.id, value }];
      setRawAnswers(newRawAnswers);

      setSelectedIndex(null);
      setTransitioning(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const stats = questionService.getStats();
        const result = calculateMBTI(newAnswers, stats.byDimension);
        if (user) {
          addTestResult(result);
          // 同步提交到后端
          api.post('/test/submit', { answers: newRawAnswers }).catch(() => {});
        }
        sessionStorage.setItem('lastTestResult', JSON.stringify(result));
        navigate('/result', { state: { result } });
      }
    }, 300);
  };

  const current = questions[currentQuestion];

  return (
    <div className="test-container page-transition">
      {!user && (
        <div className="test-login-hint">
          <span>💡 登录后测试结果将保存到你的账户</span>
        </div>
      )}
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

      <div className="question-card" key={currentQuestion}>
        <h2>{current.text}</h2>
        <div className="options-container">
          {current.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedIndex === index ? 'option-selected' : ''}`}
              onClick={() => handleAnswer(option.value, index)}
              disabled={transitioning}
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
            disabled={transitioning}
          >
            上一题
          </button>
        )}
        <span className="question-number">{currentQuestion + 1}/{questions.length}</span>
        {currentQuestion < questions.length - 1 && (
          <button
            className="nav-button"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={transitioning}
          >
            跳过
          </button>
        )}
      </div>
    </div>
  );
};

export default Test;
