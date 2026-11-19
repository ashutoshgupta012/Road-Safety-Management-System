import React from 'react';
import { X, PhoneCall, AlertCircle, Shield, Copy, Check } from 'lucide-react';

export default function SOSModal({ isOpen = true, onClose, contacts = [] }) {
  const [copiedNumber, setCopiedNumber] = React.useState(null);

  if (isOpen === false) return null;

  const helplines = [
    { number: '112', name: 'National Unified Emergency', desc: 'Police, Fire & Ambulance (Pan-India)', urgent: true },
    { number: '108', name: 'Emergency Medical Ambulance', desc: 'Direct ambulance dispatch with EMT support', urgent: true },
    { number: '0731-4771111', name: 'Bombay Hospital Trauma Center', desc: 'Super-specialty emergency ICU (Vijay Nagar)', urgent: true },
    { number: '0731-2550100', name: 'Vijay Nagar Police Station', desc: 'Local jurisdiction police station (Scheme 54)', urgent: false },
    { number: '1033', name: 'National Highway Helpline (NHAI)', desc: 'Highway accidents, breakdown & towing', urgent: false },
    { number: '7049122222', name: 'Indore Traffic Police Helpline', desc: 'Accident recovery & crane towing support', urgent: false },
  ];

  const handleCopy = (num) => {
    navigator.clipboard?.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="glass-card" 
        style={{ 
          maxWidth: '560px', 
          width: '100%', 
          padding: '24px', 
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <PhoneCall size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b' }}>Emergency SOS Helplines</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Toll-free 24x7 emergency response services</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ border: 'none', background: '#f1f5f9', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.82rem', color: '#991b1b', lineHeight: '1.4' }}>
            <strong>Golden Hour Protocol:</strong> The first 60 minutes after a road crash are critical. If someone is severely injured, call <strong>112</strong> or <strong>108</strong> immediately without delay.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {helplines.map((item, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                background: item.urgent ? '#fff7ed' : '#f8fafc',
                border: item.urgent ? '1px solid #fdba74' : '1px solid #e2e8f0'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: item.urgent ? '#ea580c' : '#0f172a' }}>
                    {item.number}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                    {item.name}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  {item.desc}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleCopy(item.number)}
                  title="Copy Number"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#334155'
                  }}
                >
                  {copiedNumber === item.number ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  {copiedNumber === item.number ? 'Copied' : 'Copy'}
                </button>
                <a
                  href={`tel:${item.number}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 14px',
                    background: item.urgent ? '#dc2626' : '#2563eb',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <PhoneCall size={14} /> Call
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem' }}>
          <Shield size={16} color="#16a34a" />
          <span>Under the <strong>Good Samaritan Law</strong>, citizens helping crash victims cannot be harassed or held liable.</span>
        </div>
      </div>
    </div>
  );
}
