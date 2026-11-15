import React, { useState } from 'react';
import { 
  PhoneCall, 
  HeartPulse, 
  Clock, 
  Copy, 
  Check 
} from 'lucide-react';

export default function EmergencyHub({ contacts = [] }) {
  const [copiedId, setCopiedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCopy = (id, num) => {
    navigator.clipboard?.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredContacts = contacts.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category === selectedCategory;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 20px' }}>
      
      {/* Title Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
          Emergency Helplines & SOS Response (Indore)
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          Direct contact numbers for Ambulance, Vijay Nagar Police Station, and Bombay Hospital Trauma Center.
        </p>
      </div>

      {/* Golden Hour Critical Alert Banner */}
      <div className="glass-card" style={{ padding: '20px 24px', background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '16px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', flexShrink: 0 }}>
          <HeartPulse size={26} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#9a3412' }}>
            The Emergency "Golden Hour" Protocol
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#7c2d12', marginTop: '4px', lineHeight: '1.5' }}>
            The first 60 minutes following severe vehicular trauma represent the "Golden Hour". Rapid medical resuscitation during this window dramatically decreases mortality. Call <strong>112</strong> or <strong>108</strong> without hesitation.
          </p>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['All', 'National Helpline', 'Ambulance & Medical', 'Police & Patrol', 'Highway Helpline'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid #2563eb' : '1px solid #cbd5e1',
              background: selectedCategory === cat ? '#eff6ff' : '#ffffff',
              color: selectedCategory === cat ? '#1d4ed8' : '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contacts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        {filteredContacts.map((c) => (
          <div 
            key={c.id} 
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', background: '#eff6ff', padding: '3px 8px', borderRadius: '4px' }}>
                  {c.category}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {c.available_hours}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                {c.service_name}
              </h4>

              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#dc2626', margin: '8px 0', letterSpacing: '0.02em' }}>
                {c.contact_number}
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4', marginBottom: '14px' }}>
                {c.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                📍 {c.region}
              </span>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleCopy(c.id, c.contact_number)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#334155'
                  }}
                >
                  {copiedId === c.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  {copiedId === c.id ? 'Copied' : 'Copy'}
                </button>

                <a
                  href={`tel:${c.contact_number}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 14px',
                    background: '#2563eb',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <PhoneCall size={13} /> Call
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Crash Site First-Aid Checklist */}
      <div className="glass-card" style={{ padding: '24px', background: '#ffffff', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
          🚨 Immediate First Responder Checklist at a Crash Scene
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {[
            { step: '1. Secure the Area', desc: 'Turn on hazard flashers, place warning triangle 50m behind incident to prevent secondary pileups.' },
            { step: '2. Call Emergency 112', desc: 'State exact location, landmark, number of injured victims, and vehicle types immediately.' },
            { step: '3. Do Not Move Spine', desc: 'Unless there is immediate fire risk, never pull or twist an unconscious victim to avoid spinal injury.' },
            { step: '4. Stem Bleeding', desc: 'Apply direct firm pressure with clean cloth over actively bleeding wounds to prevent shock.' },
          ].map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '0.88rem', marginBottom: '4px' }}>
                {item.step}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
