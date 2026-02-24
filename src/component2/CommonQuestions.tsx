// components/CommonQuestions.tsx
import React, { useState, useEffect } from 'react';
import '../style2/CommonQuestions.css';

interface Question {
  id: number;
  question: string;
  answer: string;
}

const CommonQuestions: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(0);
  const [questions, setQuestions] = useState<Question[]>([]);


  useEffect(() => {
    fetch("/api/common_questions")
      .then(r => r.json())
      .then(setQuestions)
      .catch(console.error);
  }, []);

  const toggleQuestion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="common-questions">
      <h2 className="section-title">سوالات متداول</h2>
      <div className="questions-container">
        {questions.map((q) => (
          <div key={q.id} className={`question-item ${openId === q.id ? 'active' : ''}`}>
            <div className="question-header" onClick={() => toggleQuestion(q.id)}>
              <h3>{q.question}</h3>
              <span className="toggle-icon">{openId === q.id ? '−' : '+'}</span>
            </div>
            {openId === q.id && (
              <div className="answer">
                <p>{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommonQuestions;