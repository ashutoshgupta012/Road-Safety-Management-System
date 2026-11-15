import React, { useState } from 'react';
import { RotateCcw, BookOpen, HelpCircle } from 'lucide-react';

export default function TrafficRules({ rules = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [quizScore, setQuizScore] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);

  // Road signs visual icons generator
  const renderSignGraphic = (iconType, title) => {
    switch (iconType) {
      case 'stop':
        return (
          <div style={{ width: '56px', height: '56px', background: '#dc2626', clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '0.85rem' }}>
            STOP
          </div>
        );
      case 'yield':
        return (
          <div style={{ width: '56px', height: '56px', borderTop: '28px solid #dc2626', borderLeft: '28px solid transparent', borderRight: '28px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-24px', fontSize: '0.65rem', fontWeight: 900, color: '#fff' }}>YIELD</span>
          </div>
        );
      case 'speed-50':
        return (
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '6px solid #dc2626', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
            50
          </div>
        );
      case 'no-entry':
        return (
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '36px', height: '8px', background: '#fff', borderRadius: '2px' }}></div>
          </div>
        );
      case 'no-overtake':
        return (
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '6px solid #dc2626', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🚗🚫
          </div>
        );
      case 'pedestrian':
      case 'school':
      case 'slippery':
      case 'sharp-left':
      case 'narrow-bridge':
        return (
          <div style={{ width: '56px', height: '56px', background: '#f59e0b', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '16px' }}>
            <span style={{ fontSize: '1.1rem' }}>
              {iconType === 'pedestrian' ? '🚶' : iconType === 'school' ? '🚸' : iconType === 'slippery' ? '⚠️' : '⚡'}
            </span>
          </div>
        );
      case 'hospital':
      case 'first-aid':
      case 'sos-booth':
      case 'fuel':
        return (
          <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.3rem' }}>
            {iconType === 'hospital' ? '🏥' : iconType === 'first-aid' ? '➕' : iconType === 'fuel' ? '⛽' : '📞'}
          </div>
        );
      default:
        return (
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🛡️
          </div>
        );
    }
  };

  // Interactive 5-Question Quiz for Viva Awareness
  const quizQuestions = [
    {
      q: 'What is the mandatory protective gear for both the rider and pillion on a two-wheeler?',
      options: ['Sunglasses & jacket', 'ISI/BIS Certified Helmet with chin-strap', 'Reflective gloves', 'No specific gear is mandatory'],
      correct: 1,
      explanation: 'Under Section 129 of the Motor Vehicles Act, wearing an ISI certified helmet is mandatory for rider and pillion passenger.'
    },
    {
      q: 'Under the Indian Supreme Court "Good Samaritan" law, what is true regarding citizens who assist crash victims?',
      options: ['They are legally liable if victim suffers complications', 'They can be compelled to testify in court against their will', 'They are fully protected from civil/criminal liability and police harassment', 'They must pay the initial hospital admission deposit'],
      correct: 2,
      explanation: 'The Supreme Court and MoRTH protect Good Samaritans completely from legal liabilities, police detention, or mandatory testimonies.'
    },
    {
      q: 'What does an octagonal red traffic sign signify?',
      options: ['Give Way to pedestrians', 'Stop completely before stop line', 'Overtaking allowed', 'Narrow bridge ahead'],
      correct: 1,
      explanation: 'An octagonal red sign is universally recognized as the STOP sign, requiring a complete vehicle halt.'
    },
    {
      q: 'What is the "Golden Hour" in road emergency medical care?',
      options: ['The first 60 minutes after sunrise when traffic is smooth', 'The critical first 60 minutes after trauma where prompt medical care saves lives', 'The evening rush hour from 5 PM to 6 PM', 'The deadline for filing an online FIR'],
      correct: 1,
      explanation: 'The Golden Hour is the critical first hour following traumatic crash injuries; medical treatment during this window prevents death.'
    },
    {
      q: 'What is the nationwide unified 24x7 emergency helpline number across India?',
      options: ['100', '108', '112', '911'],
      correct: 2,
      explanation: '112 is the single pan-India Emergency Response Support System (ERSS) integrating Police, Fire, and Ambulance.'
    }
  ];

  const handleSelectQuiz = (qIndex, optIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
  };

  const handleCalculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) score++;
    });
    setQuizScore(score);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizScore(null);
  };

  // Filter rules
  const filteredRules = rules.filter((r) => {
    if (activeCategory === 'All') return true;
    return r.category === activeCategory;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 20px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            Traffic Rules & Road Signs
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Mandatory, cautionary, and informatory road signs with Motor Vehicles Act penalties.
          </p>
        </div>

        {/* Toggle Quiz Button */}
        <button
          onClick={() => setShowQuiz(!showQuiz)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            background: showQuiz ? '#0f172a' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.2)'
          }}
        >
          <HelpCircle size={16} /> {showQuiz ? 'Back to Signs & Rules Catalog' : 'Take Road Safety Awareness Quiz'}
        </button>
      </div>

      {/* Interactive Quiz Mode */}
      {showQuiz ? (
        <div className="glass-card animate-fade-in" style={{ padding: '28px', background: '#ffffff', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Road Safety Knowledge Evaluation
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Test your understanding of traffic regulations, penalties, and Good Samaritan legal guidelines.
              </p>
            </div>
            {quizScore !== null && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: quizScore >= 4 ? '#16a34a' : '#dc2626' }}>
                  Score: {quizScore} / {quizQuestions.length}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {quizScore >= 4 ? '🎉 Excellent Road Safety Awareness' : '⚠️ Review Safety Guidelines Below'}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            {quizQuestions.map((item, qIdx) => {
              const isAnswered = selectedAnswers[qIdx] !== undefined;
              const isCorrect = selectedAnswers[qIdx] === item.correct;

              return (
                <div 
                  key={qIdx} 
                  style={{ 
                    background: '#f8fafc', 
                    borderRadius: '12px', 
                    padding: '16px 20px',
                    border: quizScore !== null ? (isCorrect ? '1px solid #86efac' : '1px solid #fca5a5') : '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                    {qIdx + 1}. {item.q}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    {item.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[qIdx] === optIdx;
                      let optionBg = '#ffffff';
                      let optionBorder = '#cbd5e1';

                      if (quizScore !== null) {
                        if (optIdx === item.correct) {
                          optionBg = '#dcfce7';
                          optionBorder = '#16a34a';
                        } else if (isSelected) {
                          optionBg = '#fee2e2';
                          optionBorder = '#dc2626';
                        }
                      } else if (isSelected) {
                        optionBg = '#eff6ff';
                        optionBorder = '#2563eb';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectQuiz(qIdx, optIdx)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            background: optionBg,
                            border: `1px solid ${optionBorder}`,
                            cursor: 'pointer',
                            fontSize: '0.84rem',
                            color: '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <input
                            type="radio"
                            name={`quiz_${qIdx}`}
                            checked={isSelected}
                            onChange={() => handleSelectQuiz(qIdx, optIdx)}
                            style={{ accentColor: '#2563eb' }}
                          />
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation after submit */}
                  {quizScore !== null && (
                    <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#334155', background: '#ffffff', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <strong>Explanation:</strong> {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            {quizScore !== null ? (
              <button
                onClick={handleResetQuiz}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={15} /> Retake Quiz
              </button>
            ) : (
              <button
                onClick={handleCalculateScore}
                style={{
                  padding: '10px 24px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Submit Answers & View Score
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Regular Catalog Mode */
        <>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {[
              { id: 'All', label: 'All Knowledge Items' },
              { id: 'Mandatory Signs', label: '🛑 Mandatory Signs (Regulatory)' },
              { id: 'Cautionary Signs', label: '⚠️ Cautionary Signs (Warning)' },
              { id: 'Informatory Signs', label: 'ℹ️ Informatory Signs' },
              { id: 'Traffic Rules & Penalties', label: '⚖️ Rules & Penalties (MVA)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: activeCategory === cat.id ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: activeCategory === cat.id ? '#eff6ff' : '#ffffff',
                  color: activeCategory === cat.id ? '#1d4ed8' : '#64748b',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Rules Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredRules.map((rule) => (
              <div 
                key={rule.id} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  background: '#ffffff', 
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {renderSignGraphic(rule.icon_type, rule.title)}
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                          {rule.code || rule.category}
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                          {rule.title}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5', marginBottom: '14px' }}>
                    {rule.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>
                    {rule.fine_amount ? `Fine: ${rule.fine_amount}` : 'Mandatory Standard'}
                  </div>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    background: rule.importance === 'Critical' ? '#fee2e2' : '#f1f5f9',
                    color: rule.importance === 'Critical' ? '#dc2626' : '#475569'
                  }}>
                    {rule.importance} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Safe Driving Golden Principles Banner */}
      <div className="glass-card" style={{ marginTop: '30px', padding: '24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', marginBottom: '10px' }}>
          🛡️ Ministry of Road Transport & Highways (MoRTH) Golden Safety Tenets
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '14px', fontSize: '0.82rem', color: '#cbd5e1' }}>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>1. Speed Control</strong>
            Excess speed multiplies braking distance exponentially. Adhere strictly to posted limits in rain and fog.
          </div>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>2. Lane Discipline & Indicators</strong>
            Signal your intention at least 30 meters prior to maneuvering. Avoid abrupt lane changes on expressways.
          </div>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>3. The 3-Second Rule</strong>
            Maintain a minimum 3-second buffer distance behind lead vehicles to react safely to emergency stops.
          </div>
          <div>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>4. Zero Distraction</strong>
            Never talk or text while driving. Hands-free mobile phone calls still impair hazard reaction time by 40%.
          </div>
        </div>
      </div>
    </div>
  );
}
