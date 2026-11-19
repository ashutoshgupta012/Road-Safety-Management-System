import React, { useState } from 'react';
import { X, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen = true, onClose, onAuthSuccess, onSuccess }) {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('citizen');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSuccess = (user) => {
    if (typeof onAuthSuccess === 'function') onAuthSuccess(user);
    if (typeof onSuccess === 'function') onSuccess(user);
  };

  if (isOpen === false) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const endpoint = isLoginTab ? '/api/auth/login' : '/api/auth/register';
    const payload = isLoginTab 
      ? { username, password }
      : { username, password, full_name: fullName, email, phone, role };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        if (isLoginTab) {
          handleSuccess(data.user);
          onClose();
        } else {
          setSuccessMessage('Registration successful! You can now log in.');
          setIsLoginTab(true);
        }
      } else {
        const errorText = data.errors ? data.errors.join(', ') : (data.message || 'Authentication failed');
        setErrorMessage(errorText);
      }
    } catch (err) {
      setErrorMessage('Network error communicating with Python backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole) => {
    setLoading(true);
    setErrorMessage('');
    const demoPayload = demoRole === 'admin' 
      ? { username: 'admin', password: 'admin123' }
      : { username: 'rahul_sharma', password: 'user123' };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoPayload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        handleSuccess(data.user);
        onClose();
      } else {
        setErrorMessage(data.errors ? data.errors[0] : 'Demo login failed.');
      }
    } catch (err) {
      setErrorMessage('Could not connect to backend server on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div 
        className="glass-card" 
        style={{ 
          maxWidth: '440px', 
          width: '100%', 
          padding: '24px', 
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {isLoginTab ? 'Sign In to Portal' : 'Create Citizen Account'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Step 1: User Registration & Access Control
            </p>
          </div>
          <button 
            onClick={onClose} 
            style={{ border: 'none', background: '#f1f5f9', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '6px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: isLoginTab ? '#ffffff' : 'transparent',
              color: isLoginTab ? '#0f172a' : '#64748b',
              boxShadow: isLoginTab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '6px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: !isLoginTab ? '#ffffff' : 'transparent',
              color: !isLoginTab ? '#0f172a' : '#64748b',
              boxShadow: !isLoginTab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {/* Quick Demo Login Bar (Guide Viva Booster) */}
        {isLoginTab && (
          <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              ⚡ 1-Click Presentation Demo Login
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: '#fef3c7',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <ShieldCheck size={14} /> As Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('citizen')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: '#e0f2fe',
                  border: '1px solid #bae6fd',
                  color: '#075985',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <User size={14} /> As Citizen
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '12px' }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{ background: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {!isLoginTab && (
            <>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amit Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="amit@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="citizen">Citizen Reporter</option>
                  <option value="admin">Traffic Safety Administrator</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Username or Email *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. rahul_sharma"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '10px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(37,99,235,0.2)'
            }}
          >
            {loading ? 'Processing...' : (isLoginTab ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
