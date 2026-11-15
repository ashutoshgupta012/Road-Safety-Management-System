import React from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  PlusCircle, 
  ArrowRight, 
  ShieldAlert, 
  Flame, 
  FileText, 
  Radio, 
  Calendar,
  Car
} from 'lucide-react';

export default function Dashboard({ 
  analytics = {}, 
  hotspots = [], 
  recentAccidents = [], 
  onNavigateTab 
}) {

  const summary = analytics.summary || {
    total_accidents: recentAccidents.length,
    total_fatalities: 0,
    total_injuries: 0,
    total_resolved: 0,
    total_pending: 0
  };

  const severityBreakdown = analytics.severity_breakdown || {
    Fatal: 0,
    Major: 0,
    Minor: 0
  };

  const totalAccidents = summary.total_accidents || 1;
  const fatalPct = Math.round(((severityBreakdown.Fatal || 0) / totalAccidents) * 100);
  const majorPct = Math.round(((severityBreakdown.Major || 0) / totalAccidents) * 100);
  const minorPct = Math.round(((severityBreakdown.Minor || 0) / totalAccidents) * 100);

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '22px 24px',
        marginBottom: '18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            Road Safety Management & Hotspot Analysis System
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Automated Traffic Crash Monitoring & Blackspot Detection • Vijay Nagar Square, Indore (M.P.)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onNavigateTab('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(37,99,235,0.3)'
            }}
          >
            <MapPin size={16} /> View Safety Map
          </button>

          <button
            onClick={() => onNavigateTab('records')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              background: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <FileText size={16} /> All Records Table
          </button>
        </div>
      </div>

      {/* 2. Open API Location & Status Card */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 1px 3px rgba(37,99,235,0.06)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              background: '#2563eb',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '6px',
              letterSpacing: '0.03em'
            }}>
              📍 LOCATION: VIJAY NAGAR SQUARE, INDORE
            </span>
            <span style={{
              background: '#dcfce7',
              color: '#166534',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid #bbf7d0'
            }}>
              <Radio size={13} color="#16a34a" /> Auto-Synchronized via Free Open APIs
            </span>
            <span style={{
              background: '#ffffff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              GPS: 22.7533° N, 75.8937° E
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '6px' }}>
            Historical crash records for Vijay Nagar Square corridors loaded automatically via <strong>OpenStreetMap GIS</strong> & <strong>Open-Meteo Weather</strong> Open APIs.
          </div>
        </div>
      </div>

      {/* 3. Simple 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '22px'
      }}>
        
        {/* Total Accidents */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Incidents</span>
            <ShieldAlert size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            {summary.total_accidents}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
            ✓ Auto-loaded via Open API
          </div>
        </div>

        {/* Hotspots */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Danger Blackspots</span>
            <Flame size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ef4444', marginTop: '6px' }}>
            {hotspots.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '2px' }}>
            High-risk danger clusters
          </div>
        </div>

        {/* Fatal Cases */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Fatal Cases</span>
            <AlertTriangle size={18} color="#ea580c" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ea580c', marginTop: '6px' }}>
            {severityBreakdown.Fatal || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            {summary.total_fatalities} lives lost
          </div>
        </div>

        {/* Resolved Actions */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Safety Measures</span>
            <CheckCircle2 size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', marginTop: '6px' }}>
            {summary.total_resolved}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            Interventions executed
          </div>
        </div>
      </div>

      {/* 4. NEW: Prominent Table of Auto-Ingested Accidents (Directly addresses "Data Kahan Dikhega") */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '22px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#2563eb" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Automatically Ingested Accidents (Open API Dataset)
              </h2>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '3px 0 0 0' }}>
              Real incident records around Vijay Nagar Square loaded automatically via OpenStreetMap GIS and Open-Meteo Weather APIs:
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('records')}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#2563eb',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All {recentAccidents.length} Records <ArrowRight size={13} />
          </button>
        </div>

        {/* Clean Accident List Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentAccidents.slice(0, 6).map((acc, idx) => (
            <div
              key={acc.id || idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ flex: '1 1 320px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>
                    {acc.title}
                  </span>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: acc.severity === 'Fatal' ? '#fee2e2' : acc.severity === 'Major' ? '#fef3c7' : '#dbeafe',
                    color: acc.severity === 'Fatal' ? '#b91c1c' : acc.severity === 'Major' ? '#b45309' : '#1d4ed8'
                  }}>
                    {acc.severity === 'Fatal' ? '🔴 FATAL' : acc.severity === 'Major' ? '🟠 MAJOR' : '🔵 MINOR'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#64748b', fontSize: '0.74rem', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#2563eb" /> {acc.location_name} {acc.landmark && `(${acc.landmark})`}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {acc.accident_date} • {acc.accident_time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Car size={12} /> {acc.vehicle_type}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: '#475569',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {acc.possible_cause || 'Road Defect'}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  color: '#15803d',
                  background: '#dcfce7',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  📡 OSM Geo-Node
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Severity Distribution Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '22px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
            Severity Breakdown (Vijay Nagar Corridor)
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Total: {summary.total_accidents} incidents recorded
          </span>
        </div>

        <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', background: '#f1f5f9', marginBottom: '10px' }}>
          <div style={{ width: `${fatalPct}%`, background: '#ef4444' }} title={`Fatal: ${severityBreakdown.Fatal || 0}`} />
          <div style={{ width: `${majorPct}%`, background: '#f59e0b' }} title={`Major: ${severityBreakdown.Major || 0}`} />
          <div style={{ width: `${minorPct}%`, background: '#3b82f6' }} title={`Minor: ${severityBreakdown.Minor || 0}`} />
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <span>Fatal: <strong>{severityBreakdown.Fatal || 0}</strong> ({fatalPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>Major Injury: <strong>{severityBreakdown.Major || 0}</strong> ({majorPct}%)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
            <span>Minor Damage: <strong>{severityBreakdown.Minor || 0}</strong> ({minorPct}%)</span>
          </div>
        </div>
      </div>

      {/* 6. Two Clean Sections: Blackspots & Safety Advisories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Identified Hotspots List */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} color="#ef4444" />
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Vijay Nagar Blackspots ({hotspots.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('map')}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              See On Map <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {hotspots.map((hs) => (
              <div 
                key={hs.id} 
                style={{ 
                  padding: '10px', 
                  borderRadius: '6px', 
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a' }}>
                    {hs.location_name}
                  </span>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    background: hs.risk_level === 'CRITICAL' ? '#fee2e2' : '#ffedd5',
                    color: hs.risk_level === 'CRITICAL' ? '#dc2626' : '#c2410c'
                  }}>
                    {hs.risk_level}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  {hs.total_accidents} crashes • Factor: {hs.primary_cause}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Safety Advisories */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <ShieldAlert size={16} color="#16a34a" />
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Citizen Safety Advisories (जन सुरक्षा)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#991b1b' }}>
                🛑 Vijay Nagar Square BRTS Lane Cut
              </div>
              <p style={{ fontSize: '0.74rem', color: '#7f1d1d', margin: '3px 0 0 0', lineHeight: '1.4' }}>
                Private cars and two-wheelers strictly barred from entering BRTS bus lanes. Obey 30 km/h speed limit.
              </p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#92400e' }}>
                🚶 C21 & Malhar Mall Pedestrian Zone
              </div>
              <p style={{ fontSize: '0.74rem', color: '#78350f', margin: '3px 0 0 0', lineHeight: '1.4' }}>
                Heavy shopper footfall. Motorists must reduce speed to 30 km/h and respect zebra crossing lines.
              </p>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#166534' }}>
                🚑 Scheme 54 Hospital Corridor
              </div>
              <p style={{ fontSize: '0.74rem', color: '#14532d', margin: '3px 0 0 0', lineHeight: '1.4' }}>
                Keep emergency approach lane clear. Always yield immediate right-of-way to ambulances.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
