import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Filter, 
  Flame,
  AlertTriangle,
  ShieldAlert,
  PhoneCall
} from 'lucide-react';

/**
 * Returns citizen road safety advice based on incident location & cause
 * for Vijay Nagar Square, Indore.
 */
export function getCitizenSafetyAdvice(acc) {
  if (!acc) return null;
  const loc = (acc.location_name || '').toLowerCase();
  const cause = (acc.possible_cause || '').toLowerCase();
  const desc = (acc.description || '').toLowerCase();

  if (loc.includes('brts') || desc.includes('brts') || loc.includes('vijay nagar square')) {
    return {
      category: 'High Traffic Junction & BRTS',
      title: 'BRTS Lane & Rotary Cut Alert (विजय नगर चौराहा)',
      tip: 'Private two-wheelers and cars are strictly prohibited inside the dedicated BRTS bus lane. Maintain 30 km/h and respect the signal clearance interval.',
      hindi: 'बीआरटीएस बस लेन में निजी वाहन न ले जाएं। रोटरी मोड़ पर गति 30 किमी/घंटे रखें।'
    };
  }
  if (loc.includes('c21') || loc.includes('malhar') || cause.includes('pedestrian')) {
    return {
      category: 'Commercial Shopping Zone',
      title: 'Pedestrian Caution Zone (C21 / मल्हार मॉल)',
      tip: 'Heavy shopper footfall. Motorists must reduce speed to 30 km/h, watch for pedestrians crossing, and be cautious of vehicles entering/exiting mall ramps.',
      hindi: 'शॉपिंग मॉल क्षेत्र में पैदल यात्रियों का ध्यान रखें और ज़ेबरा क्रॉसिंग पर गति धीमी करें।'
    };
  }
  if (loc.includes('bombay hospital') || desc.includes('hospital') || desc.includes('ambulance') || loc.includes('scheme 54')) {
    return {
      category: 'Emergency Corridor Link',
      title: 'Ambulance Priority Route (स्कीम 54 मार्ग)',
      tip: 'Always yield immediate right-of-way to ambulances with active sirens. Strictly maintain vehicle speed below 25 km/h. Do not park on the emergency service road.',
      hindi: 'एम्बुलेंस को तत्काल रास्ता दें। गति 25 किमी/घंटे से कम रखें और अस्पताल गेट पर पार्किंग न करें।'
    };
  }
  if (cause.includes('speed') || desc.includes('speed')) {
    return {
      category: 'Speed Regulation Area',
      title: 'Radar Speed Enforcement Zone (गति सीमा नियंत्रण)',
      tip: 'Vijay Nagar corridor is monitored by Smart City radar speed cameras. Strictly obey the 40 km/h speed limit to prevent severe crashes and ₹2,000 challans.',
      hindi: 'स्मार्ट सिटी स्पीड कैमरों द्वारा निगरानी जारी है। 40 किमी/घंटे की गति सीमा का पालन करें।'
    };
  }
  if (loc.includes('radisson') || cause.includes('fog') || cause.includes('visibility') || desc.includes('fog')) {
    return {
      category: 'Arterial Ring Road',
      title: 'Rotary Curve & Visibility Advisory (रेडिसन चौराहा लिंक)',
      tip: 'Decelerate when approaching the rotary curvature. Use low-beam fog lights and follow reflective road studs during winter mornings and rain.',
      hindi: 'मोड़ पर गति धीमी रखें। कोहरे या बारिश के दौरान लो-बीम लाइट का उपयोग करें।'
    };
  }
  if (cause.includes('pothole') || cause.includes('wet') || cause.includes('skidding')) {
    return {
      category: 'Road Surface Hazard',
      title: 'Wet Surface & Divider Caution (सड़क सुरक्षा निर्देश)',
      tip: 'Avoid sudden braking on metal lane separators and wet patches. Ensure proper two-wheeler tyre tread depth to prevent skidding.',
      hindi: 'गीली सड़क और डिवाइडर पर अचानक ब्रेक न लगाएं। टायरों की उचित ग्रिप सुनिश्चित करें।'
    };
  }
  return {
    category: 'Citizen Safety Guideline',
    title: 'General Traffic Safety Rule (सामान्य सुरक्षा नियम)',
    tip: 'Mandatory ISI helmet for both rider and pillion. Fasten three-point seatbelts. Maintain safe distance and strictly avoid mobile phone usage while driving.',
    hindi: 'हेलमेट व सीटबेल्ट अनिवार्य है। सुरक्षित दूरी बनाए रखें और वाहन चलाते समय मोबाइल का उपयोग न करें।'
  };
}

export default function MapView({ 
  accidents = [], 
  hotspots = [], 
  onSelectReportLocation, 
  onViewAccidentDetails 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const hotspotsLayerRef = useRef(null);

  const [severityFilter, setSeverityFilter] = useState('All');
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [clickCoord, setClickCoord] = useState(null);
  const [showAwarenessGuide, setShowAwarenessGuide] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Vijay Nagar Square, Indore (22.7533, 75.8937)
      const map = L.map(mapContainerRef.current, {
        center: [22.7533, 75.8937],
        zoom: 15,
        zoomControl: true,
      });

      // Standard OpenStreetMap TileLayer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Layer groups
      markersLayerRef.current = L.layerGroup().addTo(map);
      hotspotsLayerRef.current = L.layerGroup().addTo(map);

      // Map Click Handler to pick coordinates
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setClickCoord({ lat: lat.toFixed(5), lng: lng.toFixed(5) });
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup handled by Leaflet
    };
  }, []);

  // Update Markers & Hotspots whenever accidents or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !hotspotsLayerRef.current) return;

    // Clear previous layers
    markersLayerRef.current.clearLayers();
    hotspotsLayerRef.current.clearLayers();

    // 1. Draw Hotspots Danger Circles (Blackspot Zones)
    if (showHotspots && hotspots.length > 0) {
      hotspots.forEach((hs) => {
        const isCritical = hs.risk_level === 'CRITICAL';
        const circleRadius = isCritical ? 420 : 280;
        const circleColor = isCritical ? '#ef4444' : '#f97316';

        const circle = L.circle([hs.latitude, hs.longitude], {
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: 0.16,
          radius: circleRadius,
          weight: 2,
          dashArray: '5, 6'
        });

        circle.bindTooltip(
          `<div style="font-family:system-ui, sans-serif; font-size:12px; line-height:1.4;">
            <strong style="color:${circleColor}; font-size:13px;">🚨 ${hs.location_name}</strong><br/>
            Risk Level: <strong>${hs.risk_level}</strong> (${hs.total_accidents} Crashes)<br/>
            <span style="color:#64748b; font-size:11px;">${hs.recommended_action || 'Traffic enforcement required'}</span>
          </div>`,
          { sticky: true }
        );

        circle.on('click', () => {
          focusLocation(hs.latitude, hs.longitude, 16);
        });

        hotspotsLayerRef.current.addLayer(circle);
      });
    }

    // 2. Draw Accident Markers
    const filteredAccidents = accidents.filter((acc) => {
      if (severityFilter === 'All') return true;
      return acc.severity === severityFilter;
    });

    filteredAccidents.forEach((acc) => {
      if (!acc.latitude || !acc.longitude) return;

      const isFatal = acc.severity === 'Fatal';
      const isMajor = acc.severity === 'Major';
      const markerColor = isFatal ? '#ef4444' : isMajor ? '#f59e0b' : '#0284c7';
      const advice = getCitizenSafetyAdvice(acc);

      // Custom sleek SVG HTML Pin Marker
      const customIcon = L.divIcon({
        className: 'custom-accident-marker',
        html: `
          <div style="
            position: relative;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            ${isFatal ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${markerColor}; opacity: 0.35; animation: pulseGlow 1.5s infinite;"></div>` : ''}
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${markerColor};
              border: 2px solid #ffffff;
              box-shadow: 0 2px 8px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
              font-weight: 800;
            ">
              ${isFatal ? '!' : isMajor ? '▲' : '•'}
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([acc.latitude, acc.longitude], { icon: customIcon });

      // Interactive popup with Public Awareness guidance
      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; line-height: 1.4; min-width: 230px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
            <span style="
              font-size: 10px; 
              font-weight: 700; 
              padding: 2px 6px; 
              border-radius: 4px; 
              background: ${isFatal ? '#fee2e2' : isMajor ? '#fef3c7' : '#e0f2fe'}; 
              color: ${isFatal ? '#b91c1c' : isMajor ? '#b45309' : '#0369a1'};
            ">
              ${acc.severity} Crash
            </span>
            <span style="font-size: 10px; color: #64748b;">${acc.accident_date}</span>
          </div>

          <div style="font-weight: 700; color: #0f172a; font-size: 13px; margin-bottom: 3px;">
            ${acc.title}
          </div>
          
          <div style="font-size: 11px; color: #475569; margin-bottom: 8px;">
            📍 ${acc.location_name} ${acc.landmark ? `(${acc.landmark})` : ''}
          </div>

          ${advice ? `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-left: 3px solid #16a34a; padding: 6px 8px; border-radius: 4px; font-size: 11px; color: #166534; margin-bottom: 6px;">
              <strong>🛡️ Public Safety Advice:</strong><br/>
              ${advice.tip}
            </div>
          ` : ''}

          <div style="font-size: 10px; color: #64748b; text-align: right;">
            Click marker for complete incident dossier →
          </div>
        </div>
      `);

      // Click opens the right drawer for full inspection
      marker.on('click', () => {
        setSelectedAccident(acc);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [accidents, hotspots, severityFilter, showHotspots]);

  // Handle focus on hotspot / corridor landmark
  const focusLocation = (lat, lng, zoom = 16) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1.2 });
    }
  };

  const selectedAdvice = selectedAccident ? getCitizenSafetyAdvice(selectedAccident) : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)', minHeight: '620px', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Public Road Safety Awareness Header Banner */}
      <div style={{
        background: '#fffbeb',
        borderBottom: '1px solid #fef3c7',
        padding: '10px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        zIndex: 25
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="#d97706" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400e' }}>
              Public Safety Awareness Map: Vijay Nagar Square, Indore
            </div>
            <div style={{ fontSize: '0.72rem', color: '#b45309' }}>
              Showing {accidents.length} historical crash points & identified blackspots to alert drivers and citizens.
            </div>
          </div>
        </div>

        {/* Quick Corridor View Jump Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#78350f' }}>Quick Jumps:</span>
          
          <button
            type="button"
            onClick={() => focusLocation(22.7533, 75.8937, 16)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #fca5a5',
              background: '#fef2f2',
              color: '#b91c1c',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📍 Vijay Nagar Sq. (Main)
          </button>

          <button
            type="button"
            onClick={() => focusLocation(22.7540, 75.8942, 17)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #fde68a',
              background: '#fffbeb',
              color: '#92400e',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🚨 AB Road BRTS Cut
          </button>

          <button
            type="button"
            onClick={() => focusLocation(22.7521, 75.8948, 17)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🛍️ C21 / Malhar Mall
          </button>

          <button
            type="button"
            onClick={() => focusLocation(22.7441, 75.8988, 17)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #bfdbfe',
              background: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔄 Sayaji / Ring Road Link
          </button>

          <button
            type="button"
            onClick={() => focusLocation(22.7510, 75.8885, 17)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🌳 Meghdoot Garden
          </button>
        </div>
      </div>

      {/* 2. Top Filter and Controls Bar */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '10px 18px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
            <Filter size={15} color="#2563eb" /> Filter Severity:
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Fatal', 'Major', 'Minor'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: severityFilter === sev ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  background: severityFilter === sev ? '#eff6ff' : '#ffffff',
                  color: severityFilter === sev ? '#1d4ed8' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {sev === 'Fatal' && '🔴 '}
                {sev === 'Major' && '🟠 '}
                {sev === 'Minor' && '🔵 '}
                {sev}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dbeafe', color: '#1e40af', padding: '3px 8px', borderRadius: '4px' }}>
            📍 Vijay Nagar Square, Indore
          </span>

          <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />

          {/* Toggle Hotspots */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#1e293b' }}>
            <input
              type="checkbox"
              checked={showHotspots}
              onChange={(e) => setShowHotspots(e.target.checked)}
              style={{ width: '15px', height: '15px', accentColor: '#ef4444' }}
            />
            <Flame size={15} color="#ef4444" />
            Show Hotspot Blackspot Zones
          </label>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.73rem', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            Fatal Crash
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            Major Injury
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#0284c7', display: 'inline-block' }}></span>
            Minor Damage
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', border: '2px dashed #ef4444', background: 'rgba(239,68,68,0.2)', display: 'inline-block' }}></span>
            Blackspot Zone
          </div>
        </div>
      </div>

      {/* 3. Main Map Area */}
      <div style={{ position: 'relative', flex: 1, width: '100%' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: 0 }} />

        {/* Floating Identified Blackspots Panel on Left */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 500,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(8px)',
          borderRadius: '12px',
          padding: '12px 14px',
          maxWidth: '290px',
          width: 'calc(100% - 32px)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid #e2e8f0',
          maxHeight: '320px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800, fontSize: '0.82rem', color: '#991b1b' }}>
              <Flame size={15} color="#ef4444" /> Identified Blackspots ({hotspots.length})
            </div>
            <span style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#b91c1c', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
              Vijay Nagar
            </span>
          </div>
          
          <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '8px' }}>
            Click a zone to focus map and view citizen awareness advisory:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {hotspots.map((hs) => (
              <div
                key={hs.id}
                onClick={() => focusLocation(hs.latitude, hs.longitude, 16)}
                style={{
                  padding: '7px 9px',
                  borderRadius: '7px',
                  background: hs.risk_level === 'CRITICAL' ? '#fef2f2' : '#fff7ed',
                  border: `1px solid ${hs.risk_level === 'CRITICAL' ? '#fca5a5' : '#fdba74'}`,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                    {hs.location_name}
                  </span>
                  <span style={{ 
                    fontSize: '0.62rem', 
                    fontWeight: 700, 
                    padding: '1px 5px', 
                    borderRadius: '4px',
                    background: hs.color, 
                    color: '#ffffff' 
                  }}>
                    {hs.risk_level}
                  </span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: '2px' }}>
                  {hs.total_accidents} crashes • {hs.fatal_count} fatal • {hs.primary_cause}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Road Safety Awareness Box at Bottom Left (Collapsible) */}
        {showAwarenessGuide && (
          <div style={{
            position: 'absolute',
            bottom: clickCoord ? '70px' : '20px',
            left: '16px',
            zIndex: 500,
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '12px 14px',
            maxWidth: '340px',
            width: 'calc(100% - 32px)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#166534' }}>
                <ShieldAlert size={16} color="#16a34a" /> Citizen Safety Advisories (जन सुरक्षा)
              </div>
              <button 
                onClick={() => setShowAwarenessGuide(false)} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                title="Hide guide"
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: '#334155' }}>
              <div style={{ background: '#fef2f2', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #dc2626' }}>
                <strong>🛑 Vijay Nagar BRTS Cut:</strong> Do not enter dedicated bus corridor; beware of turning buses.
              </div>
              <div style={{ background: '#fffbeb', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #d97706' }}>
                <strong>🚶 C21 Mall Commercial Cut:</strong> Watch for pedestrians crossing; obey 30 km/h speed limit.
              </div>
              <div style={{ background: '#f0fdf4', padding: '6px 8px', borderRadius: '6px', borderLeft: '3px solid #16a34a' }}>
                <strong>🚑 Scheme 54 Hospital Route:</strong> Yield immediate way to ambulances; maintain speed below 25 km/h.
              </div>
            </div>
          </div>
        )}

        {/* Map Click Coordinate Banner */}
        {clickCoord && (
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 500,
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: '10px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-xl)',
            fontSize: '0.8rem'
          }}>
            <MapPin size={16} color="#38bdf8" />
            <div>
              <strong>Clicked Coordinates:</strong> {clickCoord.lat}, {clickCoord.lng}
            </div>
            <button
              onClick={() => onSelectReportLocation(clickCoord.lat, clickCoord.lng)}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Report Incident Here
            </button>
            <button
              onClick={() => setClickCoord(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Selected Accident Detail Drawer (Right side) */}
        {selectedAccident && (
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            bottom: '16px',
            width: '380px',
            maxWidth: 'calc(100% - 32px)',
            background: '#ffffff',
            zIndex: 600,
            borderRadius: '16px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid #cbd5e1',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }} className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <span className={`badge badge-${selectedAccident.severity.toLowerCase()}`}>
                  {selectedAccident.severity} Crash
                </span>
                <span className={`badge badge-${selectedAccident.status.toLowerCase().replace(' ', '-')}`} style={{ marginLeft: '6px' }}>
                  {selectedAccident.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedAccident(null)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px', lineHeight: '1.3' }}>
              {selectedAccident.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.78rem', marginBottom: '12px' }}>
              <MapPin size={14} color="#2563eb" />
              <span>{selectedAccident.location_name} {selectedAccident.landmark && `(${selectedAccident.landmark})`}</span>
            </div>

            {/* Prominent Public Awareness Card for this Incident */}
            {selectedAdvice && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderLeft: '4px solid #16a34a',
                padding: '10px 12px',
                borderRadius: '8px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                  <ShieldAlert size={14} /> {selectedAdvice.title}
                </div>
                <p style={{ fontSize: '0.76rem', color: '#15803d', marginTop: '4px', lineHeight: '1.4' }}>
                  {selectedAdvice.tip}
                </p>
                <div style={{ fontSize: '0.72rem', color: '#166534', marginTop: '4px', fontStyle: 'italic', background: '#dcfce7', padding: '4px 6px', borderRadius: '4px' }}>
                  💡 {selectedAdvice.hindi}
                </div>
              </div>
            )}

            {/* Quick stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Date & Time</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  {selectedAccident.accident_date} • {selectedAccident.accident_time}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Casualties / Hurt</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedAccident.casualties_count > 0 ? '#dc2626' : '#1e293b', marginTop: '2px' }}>
                  {selectedAccident.casualties_count} Dead / {selectedAccident.injuries_count} Hurt
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Vehicle Involved</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  {selectedAccident.vehicle_type}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Primary Cause</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  {selectedAccident.possible_cause || 'Under Review'}
                </div>
              </div>
            </div>

            {/* Road & Weather */}
            <div style={{ background: '#f1f5f9', padding: '8px 10px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.75rem', color: '#334155' }}>
              <div><strong>Road Condition:</strong> {selectedAccident.road_condition}</div>
              <div style={{ marginTop: '2px' }}><strong>Weather:</strong> {selectedAccident.weather_condition}</div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                Incident Description
              </div>
              <p style={{ fontSize: '0.78rem', color: '#334155', lineHeight: '1.4', background: '#fafafa', padding: '8px 10px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                {selectedAccident.description || 'No detailed narrative entered.'}
              </p>
            </div>

            {/* Action Taken */}
            {selectedAccident.action_taken && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '8px 10px', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
                  Safety Action Executed
                </div>
                <div style={{ fontSize: '0.76rem', color: '#047857', marginTop: '2px' }}>
                  {selectedAccident.action_taken}
                </div>
              </div>
            )}

            {/* Emergency Contacts for Indore Corridor */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                <PhoneCall size={12} color="#dc2626" /> Emergency Contacts (Indore)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#334155' }}>
                <span>Vijay Nagar Police Station:</span>
                <strong>0731-2550100</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#334155', marginTop: '2px' }}>
                <span>Indore Traffic Helpline:</span>
                <strong>7049122222 / 112</strong>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onViewAccidentDetails(selectedAccident)}
                style={{
                  flex: 1,
                  padding: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Full Record Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
