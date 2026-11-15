import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Trash2, 
  MapPin, 
  Eye, 
  ShieldCheck, 
  Edit3,
  X
} from 'lucide-react';

export default function RecordManagement({ 
  accidents = [], 
  currentUser, 
  onRefreshData,
  onOpenReportModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [adminModalRecord, setAdminModalRecord] = useState(null);
  
  // Admin form state
  const [newStatus, setNewStatus] = useState('Verified');
  const [actionNotes, setActionNotes] = useState('');
  const [adminComments, setAdminComments] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filter records
  const filteredRecords = accidents.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.possible_cause && item.possible_cause.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = severityFilter === 'All' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Admin status update handler
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!adminModalRecord) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/accidents/${adminModalRecord.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminComments,
          action_taken: actionNotes
        })
      });

      if (res.ok) {
        setAdminModalRecord(null);
        if (onRefreshData) onRefreshData();
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      alert('Error communicating with backend.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Accident Report #${id}?`)) return;

    try {
      const res = await fetch(`/api/accidents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (onRefreshData) onRefreshData();
      } else {
        alert('Failed to delete report.');
      }
    } catch (err) {
      alert('Error connecting to backend.');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredRecords.length) {
      alert('No records to export.');
      return;
    }
    const headers = ['ID', 'Title', 'Location', 'Date', 'Time', 'Severity', 'Vehicle', 'Road Condition', 'Casualties', 'Injuries', 'Status', 'Action Taken'];
    const rows = filteredRecords.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.location_name.replace(/"/g, '""')}"`,
      r.accident_date,
      r.accident_time,
      r.severity,
      r.vehicle_type,
      r.road_condition,
      r.casualties_count,
      r.injuries_count,
      r.status,
      `"${(r.action_taken || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `road_accident_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openAdminWorkflow = (rec) => {
    setAdminModalRecord(rec);
    setNewStatus(rec.status || 'Verified');
    setActionNotes(rec.action_taken || '');
    setAdminComments(rec.admin_notes || '');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 20px' }}>
      
      {/* Title & Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
            Accident Records & Reports
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            View, search, filter, and export accident records for Vijay Nagar Square, Indore.
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#334155'
            }}
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by location, title, or cause..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
            >
              <option value="All">All Severities</option>
              <option value="Fatal">🔴 Fatal</option>
              <option value="Major">🟠 Major</option>
              <option value="Minor">🔵 Minor</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="glass-card" style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>ID</th>
              <th style={{ padding: '12px 16px' }}>Incident & Location</th>
              <th style={{ padding: '12px 16px' }}>Date & Time</th>
              <th style={{ padding: '12px 16px' }}>Severity</th>
              <th style={{ padding: '12px 16px' }}>Casualties</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  No accident records match the applied criteria.
                </td>
              </tr>
            ) : (
              filteredRecords.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#64748b' }}>
                    #{item.id}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={13} color="#2563eb" /> {item.location_name} {item.landmark && `(${item.landmark})`}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>
                    <div>{item.accident_date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.accident_time}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${item.severity.toLowerCase()}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: item.casualties_count > 0 ? '#dc2626' : '#1e293b' }}>
                      {item.casualties_count} Dead / {item.injuries_count} Hurt
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.vehicle_type}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge badge-${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedAccident(item)}
                        title="View Full Details"
                        style={{ padding: '6px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '6px', cursor: 'pointer', color: '#2563eb' }}
                      >
                        <Eye size={15} />
                      </button>

                      {/* Admin update button */}
                      <button
                        onClick={() => openAdminWorkflow(item)}
                        title="Admin Status & Investigation Workflow"
                        style={{ padding: '6px', border: '1px solid #fdba74', background: '#fff7ed', borderRadius: '6px', cursor: 'pointer', color: '#ea580c' }}
                      >
                        <Edit3 size={15} />
                      </button>

                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
                          style={{ padding: '6px', border: '1px solid #fecaca', background: '#fee2e2', borderRadius: '6px', cursor: 'pointer', color: '#dc2626' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Workflow Modal (Step 5: Accident Management) */}
      {adminModalRecord && (
        <div className="modal-overlay animate-fade-in" onClick={() => setAdminModalRecord(null)}>
          <div 
            className="glass-card" 
            style={{ maxWidth: '540px', width: '100%', padding: '24px', background: '#fff', borderRadius: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Admin Record Management
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Case #{adminModalRecord.id}: {adminModalRecord.title}
                </p>
              </div>
              <button onClick={() => setAdminModalRecord(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Workflow Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="Pending">Pending Verification</option>
                  <option value="Verified">Verified by Authority</option>
                  <option value="Under Investigation">Under Investigation (Traffic Police / PWD)</option>
                  <option value="Resolved">Resolved (Corrective Measure Deployed)</option>
                  <option value="Rejected">Rejected / Inaccurate</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Corrective Road Safety Action Taken
                </label>
                <input
                  type="text"
                  placeholder="e.g. Speed humps installed; Streetlights repaired by PWD; Warning sign installed"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Internal Administrative Investigation Remarks
                </label>
                <textarea
                  rows="3"
                  placeholder="Add notes on police report verification, CCTV footage findings, or blackspot classification..."
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={updating}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: updating ? 'not-allowed' : 'pointer'
                  }}
                >
                  {updating ? 'Saving Changes...' : 'Save & Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Dossier View Modal */}
      {selectedAccident && (
        <div className="modal-overlay animate-fade-in" onClick={() => setSelectedAccident(null)}>
          <div 
            className="glass-card" 
            style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '24px', background: '#fff', borderRadius: '16px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className={`badge badge-${selectedAccident.severity.toLowerCase()}`}>
                  {selectedAccident.severity} Incident
                </span>
                <span className={`badge badge-${selectedAccident.status.toLowerCase().replace(' ', '-')}`} style={{ marginLeft: '6px' }}>
                  {selectedAccident.status}
                </span>
              </div>
              <button onClick={() => setSelectedAccident(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              {selectedAccident.title}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', marginBottom: '16px' }}>
              <MapPin size={15} color="#2563eb" />
              <span>{selectedAccident.location_name} {selectedAccident.landmark && `(Landmark: ${selectedAccident.landmark})`}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Date & Time</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', marginTop: '2px' }}>
                  {selectedAccident.accident_date} at {selectedAccident.accident_time}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>GPS Coordinates</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {selectedAccident.latitude}, {selectedAccident.longitude}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Vehicle Involved</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', marginTop: '2px' }}>
                  {selectedAccident.vehicle_type}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Probable Cause</div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.82rem', marginTop: '2px' }}>
                  {selectedAccident.possible_cause}
                </div>
              </div>
            </div>

            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.82rem' }}>
              <div><strong>Road Surface:</strong> {selectedAccident.road_condition}</div>
              <div style={{ marginTop: '4px' }}><strong>Weather Condition:</strong> {selectedAccident.weather_condition}</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>
                Detailed Observation
              </div>
              <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: '1.5', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {selectedAccident.description || 'No detailed narrative entered.'}
              </p>
            </div>

            {selectedAccident.action_taken && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase' }}>
                  Official Safety Action Deployed
                </div>
                <div style={{ fontSize: '0.84rem', color: '#047857', marginTop: '2px' }}>
                  {selectedAccident.action_taken}
                </div>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={() => setSelectedAccident(null)}
                style={{ padding: '8px 18px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
