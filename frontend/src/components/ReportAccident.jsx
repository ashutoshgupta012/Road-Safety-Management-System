import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Car, 
  CloudSun, 
  ShieldCheck, 
  Send,
  Sparkles,
  Navigation
} from 'lucide-react';

export default function ReportAccident({ 
  currentUser, 
  initialCoords, 
  onReportSubmitted, 
  onSwitchToMap 
}) {
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [latitude, setLatitude] = useState(initialCoords?.lat || '22.7533');
  const [longitude, setLongitude] = useState(initialCoords?.lng || '75.8937');
  const [accidentDate, setAccidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [accidentTime, setAccidentTime] = useState(new Date().toTimeString().slice(0, 5));
  const [severity, setSeverity] = useState('Major');
  const [vehicleType, setVehicleType] = useState('Two-Wheeler');
  const [roadCondition, setRoadCondition] = useState('Dry & Normal');
  const [weatherCondition, setWeatherCondition] = useState('Clear / Sunny');
  const [casualtiesCount, setCasualtiesCount] = useState(0);
  const [injuriesCount, setInjuriesCount] = useState(1);
  const [possibleCause, setPossibleCause] = useState('Over-speeding');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState(currentUser?.full_name || 'Citizen User');
  const [reporterContact, setReporterContact] = useState(currentUser?.phone || '+91 98000 00000');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successData, setSuccessData] = useState(null);

  // Update coords if passed from Map
  useEffect(() => {
    if (initialCoords?.lat && initialCoords?.lng) {
      setLatitude(initialCoords.lat);
      setLongitude(initialCoords.lng);
    }
  }, [initialCoords]);

  // Update reporter info if user logs in
  useEffect(() => {
    if (currentUser) {
      setReporterName(currentUser.full_name);
      if (currentUser.phone) setReporterContact(currentUser.phone);
    }
  }, [currentUser]);

  // Geolocation trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(5));
        setLongitude(pos.coords.longitude.toFixed(5));
        if (!locationName) setLocationName('Current GPS Location Area');
      },
      (err) => {
        alert('Could not retrieve GPS position. Default coordinates will be kept.');
      }
    );
  };

  // Demo auto-filler for presentation demo
  const handleAutoFillDemo = () => {
    setTitle('Collision between auto-rickshaw and bike at BRTS cut');
    setLocationName('Vijay Nagar Square - AB Road, Indore');
    setLandmark('Opposite C21 Mall & Metro Pillar 114');
    setLatitude('22.7533');
    setLongitude('75.8937');
    setSeverity('Major');
    setVehicleType('Auto-Rickshaw');
    setRoadCondition('Dry & Normal');
    setWeatherCondition('Clear / Sunny');
    setCasualtiesCount(0);
    setInjuriesCount(2);
    setPossibleCause('Signal Jump');
    setDescription('Auto-rickshaw made an abrupt turn across the dedicated BRTS lane at Vijay Nagar Square without indicator, colliding with an oncoming motorcycle. Both passengers suffered minor fractures.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccessData(null);
    setLoading(true);

    const payload = {
      title,
      location_name: locationName,
      landmark,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accident_date: accidentDate,
      accident_time: accidentTime,
      severity,
      vehicle_type: vehicleType,
      road_condition: roadCondition,
      weather_condition: weatherCondition,
      casualties_count: parseInt(casualtiesCount) || 0,
      injuries_count: parseInt(injuriesCount) || 0,
      possible_cause: possibleCause,
      description,
      reported_by_id: currentUser?.id || null,
      reporter_name: reporterName,
      reporter_contact: reporterContact,
    };

    try {
      const res = await fetch('/api/accidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessData(data.data);
        if (onReportSubmitted) onReportSubmitted(data.data);
      } else {
        setErrors(data.errors || [data.message || 'Failed to submit report.']);
      }
    } catch (err) {
      setErrors(['Network error connecting to Flask backend server.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '30px 20px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            Report Road Accident
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Fill in the accident details below to store the record in the database.
          </p>
        </div>

        {/* Fill Sample Data Button */}
        <button
          type="button"
          onClick={handleAutoFillDemo}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Sparkles size={15} /> ⚡ Fill Sample Data
        </button>
      </div>

      {/* Success Confirmation Card */}
      {successData && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', background: '#ecfdf5', border: '1px solid #6ee7b7', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <CheckCircle size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#065f46' }}>
                Accident Report Successfully Logged!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#047857', marginTop: '4px' }}>
                Assigned Database Tracking ID: <strong>#{successData.id}</strong>. The incident is now stored in the SQL database and mapped in the GIS Hotspot identification engine.
              </p>
              
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={onSwitchToMap}
                  style={{
                    padding: '8px 16px',
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View on Hotspot Map
                </button>
                <button
                  onClick={() => { setSuccessData(null); setTitle(''); setDescription(''); }}
                  style={{
                    padding: '8px 16px',
                    background: '#ffffff',
                    color: '#065f46',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Errors Notification */}
      {errors.length > 0 && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '14px 18px', borderRadius: '10px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#991b1b', fontSize: '0.85rem' }}>
            <AlertTriangle size={18} /> Step 3 Validation Errors:
          </div>
          <ul style={{ margin: '8px 0 0 20px', fontSize: '0.82rem', color: '#b91c1c' }}>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Reporting Form */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '28px', background: '#ffffff' }}>
        
        {/* Section 1: Incident Identification */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
            1. Incident Overview
          </h3>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Incident Title / Short Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Over-speeding car hit median divider at intersection"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
            />
          </div>

          {/* Severity Radio Cards */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
              Incident Severity Level *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {[
                { level: 'Minor', color: '#0284c7', bg: '#e0f2fe', desc: 'Property damage or minor scrapes' },
                { level: 'Major', color: '#ea580c', bg: '#ffedd5', desc: 'Severe vehicle damage & hospitalization' },
                { level: 'Fatal', color: '#dc2626', bg: '#fee2e2', desc: 'Critical loss of human life / fatal casualty' },
              ].map((s) => (
                <div
                  key={s.level}
                  onClick={() => setSeverity(s.level)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: severity === s.level ? `2px solid ${s.color}` : '1px solid #cbd5e1',
                    background: severity === s.level ? s.bg : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, color: s.color, fontSize: '0.9rem' }}>
                      {s.level}
                    </span>
                    <input
                      type="radio"
                      name="severity"
                      checked={severity === s.level}
                      onChange={() => setSeverity(s.level)}
                      style={{ accentColor: s.color }}
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '4px' }}>
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Location & GIS Mapping */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
            2. Location & Geographic Coordinates
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Location / Road Corridor *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ring Road AIIMS Flyover"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Nearest Landmark / Pillar No.
              </label>
              <input
                type="text"
                placeholder="e.g. Opposite Metro Pillar 42"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Coordinate Inputs with GPS Helper */}
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                GPS Pinpoint (Decimal Degrees)
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#2563eb'
                  }}
                >
                  <Navigation size={13} /> Use Device GPS
                </button>
                <button
                  type="button"
                  onClick={onSwitchToMap}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#0f172a'
                  }}
                >
                  <MapPin size={13} /> Click on Map
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Time, Road & Weather Factors */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '16px' }}>
            3. Environmental & Incident Parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Accident Date *
              </label>
              <input
                type="date"
                required
                value={accidentDate}
                onChange={(e) => setAccidentDate(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Accident Time *
              </label>
              <input
                type="time"
                required
                value={accidentTime}
                onChange={(e) => setAccidentTime(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Vehicle Type Involved *
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="Two-Wheeler">Two-Wheeler (Motorcycle / Scooter)</option>
                <option value="Four-Wheeler / Car">Four-Wheeler / Private Car</option>
                <option value="Commercial Bus">Commercial Bus / Public Transit</option>
                <option value="Heavy Truck">Heavy Truck / Trailer</option>
                <option value="Auto-Rickshaw">Auto-Rickshaw / Three-Wheeler</option>
                <option value="Pedestrian">Pedestrian</option>
                <option value="Multiple Vehicles">Multiple Vehicles / Pileup</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Road Surface Condition *
              </label>
              <select
                value={roadCondition}
                onChange={(e) => setRoadCondition(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="Dry & Normal">Dry & Normal</option>
                <option value="Wet / Waterlogged">Wet / Waterlogged</option>
                <option value="Potholed & Damaged">Potholed & Damaged</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Slippery / Oil Spill">Slippery / Oil Spill</option>
                <option value="Poor Street Lighting">Poor Street Lighting</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Weather Condition *
              </label>
              <select
                value={weatherCondition}
                onChange={(e) => setWeatherCondition(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="Clear / Sunny">Clear / Sunny</option>
                <option value="Rainy / Monsoon">Rainy / Monsoon</option>
                <option value="Heavy Fog / Mist">Heavy Fog / Mist</option>
                <option value="Night / Dark">Night / Dark</option>
                <option value="Stormy / Wind">Stormy / High Wind</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Suspected Primary Cause *
              </label>
              <select
                value={possibleCause}
                onChange={(e) => setPossibleCause(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="Over-speeding">Over-speeding</option>
                <option value="Drunk Driving">Drunk Driving</option>
                <option value="Signal Jump">Signal Jump</option>
                <option value="Pothole / Road Defect">Pothole / Road Defect</option>
                <option value="Brake Failure">Brake Failure / Mechanical</option>
                <option value="Weather / Low Visibility">Weather / Low Visibility</option>
                <option value="Distracted Driving">Distracted Driving / Mobile Usage</option>
              </select>
            </div>
          </div>

          {/* Casualties and Injuries */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', display: 'block', marginBottom: '4px' }}>
                Fatal Casualties Count
              </label>
              <input
                type="number"
                min="0"
                value={casualtiesCount}
                onChange={(e) => setCasualtiesCount(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #fca5a5', background: '#fff5f5', fontSize: '0.88rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ea580c', display: 'block', marginBottom: '4px' }}>
                Injuries Count
              </label>
              <input
                type="number"
                min="0"
                value={injuriesCount}
                onChange={(e) => setInjuriesCount(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #fdba74', background: '#fffaf5', fontSize: '0.88rem' }}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Description Narrative */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            Detailed Narrative / Crash Observations
          </label>
          <textarea
            rows="3"
            placeholder="Describe what occurred, impact points, emergency vehicle arrival, or safety hazards..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
          />
        </div>

        {/* Section 5: Reporter Contact (Auto-populated) */}
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
            Reporter Information (Stored for Verification)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b' }}>Reporter Name</label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b' }}>Contact Phone</label>
              <input
                type="tel"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 20px',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
            transition: 'background 0.2s ease'
          }}
        >
          <Send size={18} />
          {loading ? 'Validating & Storing in SQL Database...' : 'Submit Incident to Road Safety System'}
        </button>
      </form>
    </div>
  );
}
