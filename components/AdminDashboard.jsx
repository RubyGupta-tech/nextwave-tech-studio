import React, { useState, useEffect } from 'react';
import '../src/styles/global.css';

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(sessionStorage.getItem('last_search') || '');
  const [serviceFilter, setServiceFilter] = useState(sessionStorage.getItem('last_service') || 'all');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', email: '', phone: '', service: 'Website Creation', notes: '' });
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Build query string - Trim the search query here too
      const params = new URLSearchParams({
        filter: timeFilter,
        search: searchQuery.trim(),
        service: serviceFilter
      });

      const response = await fetch(`/api/get-leads?${params.toString()}`, {
        headers: {
          'x-nextwave-auth': password
        }
      });

      const data = await response.json();

      if (response.ok) {
        setLeads(data.leads);
        setIsLoggedIn(true);
        // Store password in session storage for refreshing
        sessionStorage.setItem('admin_key', password);
        showToast('Login successful!');
      } else {
        setError(data.error || 'Invalid password');
        showToast(data.error || 'Invalid password', 'error');
      }
    } catch (err) {
      setError('Connection failed. Are you online?');
    } finally {
      setLoading(false);
    }
  };

  // Auto-login if key is in session
  useEffect(() => {
    const savedKey = sessionStorage.getItem('admin_key');
    if (savedKey) {
      setPassword(savedKey);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('admin_key') && !isLoggedIn) {
      handleLogin();
    }
  }, [password]);

  // Re-fetch when filter, search, or service changes
  useEffect(() => {
    if (isLoggedIn) {
      const delayDebounceFn = setTimeout(() => {
        // Persist filters so they survive refresh
        sessionStorage.setItem('last_search', searchQuery);
        sessionStorage.setItem('last_service', serviceFilter);
        handleLogin();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [timeFilter, searchQuery, serviceFilter]);

  const handleUpdateLead = async (id, status, notes, phone) => {
    setIsUpdating(true);
    try {
      const resp = await fetch('/api/update-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nextwave-auth': password
        },
        body: JSON.stringify({ id, status, notes, phone })
      });
      if (resp.ok) {
        // Find and update the lead in the main list
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status, notes, phone } : l));
        
        // Force update the selectedLead state to ensure modal reflects changes
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(prev => ({ ...prev, status, notes, phone }));
        }
        showToast('Lead updated successfully');
      }
    } catch (err) {
      console.error("Update failed:", err);
      showToast('Update failed!', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleManualAddLead = async (e) => {
    if (e) e.preventDefault();
    
    // 1. Validation
    if (!newLead.name || !newLead.name.trim()) {
      showToast("Client Name is required!", "error");
      return;
    }

    setIsUpdating(true);
    try {
      const resp = await fetch('/api/add-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nextwave-auth': password
        },
        body: JSON.stringify(newLead)
      });
      const data = await resp.json();
      if (resp.ok) {
        setLeads(prev => [data.lead, ...prev]);
        setShowAddModal(false);
        setNewLead({ name: '', email: '', phone: '', service: 'Website Creation', notes: '' });
        showToast('Manual lead saved!');
      } else {
        showToast(data.details || data.error || "Failed to add lead", 'error');
      }
    } catch (err) {
      console.error("Add failed:", err);
      showToast('Connection error', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead permanently?")) return;
    try {
      const resp = await fetch('/api/delete-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nextwave-auth': password
        },
        body: JSON.stringify({ id })
      });
      if (resp.ok) {
        setLeads(leads.filter(l => l.id !== id));
        setSelectedLead(null);
        showToast('Lead deleted', 'error');
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showToast('Delete failed', 'error');
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ["ID", "Date", "Name", "Email", "Service", "Source", "Status", "Message", "Notes"];
    const rows = leads.map(l => [
      l.id,
      new Date(l.created_at).toLocaleString(),
      l.name,
      l.email,
      l.service,
      l.source,
      l.status,
      `"${l.message?.replace(/"/g, '""')}"`,
      `"${l.notes?.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `nextwave_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-logo">
            <img src="/NextWave_logo1.web.jpeg" alt="NextWave" style={{ width: '150px', marginBottom: '20px' }} />
          </div>
          <h2>Leads Dashboard</h2>
          <p>Secure access only</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              id="admin-password"
              name="admin-password"
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            {error && <div className="error-text">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Login ➔'}
            </button>
            <div style={{ marginTop: '15px', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
              System Version: v3.1 (NextWave-Restore)
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      <nav className="admin-nav">
        <div className="admin-nav-brand">
          <img src="/NextWave_logo1.web.jpeg" alt="NextWave" style={{ height: '30px' }} />
          <span>Admin Portal</span>
        </div>
        <button type="button" onClick={() => {
          sessionStorage.removeItem('admin_key');
          window.location.reload();
        }} className="logout-btn">Logout</button>
      </nav>

      <main className="admin-content">
        <header className="content-header">
          <div className="header-main">
            <h1>Customer Inquiries</h1>
            <div className="analytics-summary">
              <div className="ans-item"><span className="ans-label">Total Leads:</span> <span className="ans-val">{leads.length}</span></div>
              <div className="ans-item"><span className="ans-label">Converted:</span> <span className="ans-val">{leads.filter(l => l.status === 'Converted').length}</span></div>
              <div className="ans-item"><span className="ans-label">New:</span> <span className="ans-val">{leads.filter(l => l.status === 'New').length}</span></div>
            </div>
          </div>
          
          <div className="crm-master-controls">
            <form className="search-box" onSubmit={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                handleLogin(); 
              }}>
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  // Save immediately so it survives a reload even if debounce hasn't fired
                  sessionStorage.setItem('last_search', val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Enter will trigger the form's onSubmit
                  }
                }}
              />
              {searchQuery && <button type="button" className="clear-search" onClick={() => { setSearchQuery(''); sessionStorage.removeItem('last_search'); }}>×</button>}
              <button type="submit" className="search-trigger-btn">🔍</button>
            </form>
            
            <div className="filter-group">
              <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="service-filter-select">
                <option value="all">All Services</option>
                <option>Website Creation</option>
                <option>Website Updates &amp; Fixes</option>
                <option>SEO &amp; Internet Marketing</option>
                <option>Partnership / Sponsorship</option>
                <option>Enterprise Web App</option>
              </select>

              <div className="time-filters">
                <button type="button" className={`filter-btn ${timeFilter === 'all' ? 'active' : ''}`} onClick={() => setTimeFilter('all')}>All</button>
                <button type="button" className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`} onClick={() => setTimeFilter('month')}>Month</button>
                <button type="button" className={`filter-btn ${timeFilter === 'week' ? 'active' : ''}`} onClick={() => setTimeFilter('week')}>Week</button>
                <button type="button" className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`} onClick={() => setTimeFilter('today')}>Today</button>
              </div>
            </div>

            <button onClick={() => setShowAddModal(true)} className="add-manual-btn">
              ➕ New Manual Lead
            </button>
            <button type="button" onClick={exportToCSV} className="export-btn" title="Download Excel List">
              📊 Export CSV
            </button>
          </div>
        </header>

        {loading ? (
          <div className="leads-loading">
            <div className="loader"></div>
            <p>Filtering Lead Database...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="no-leads">
            <p>{searchQuery ? `No results found for "${searchQuery}"` : "No inquiries found in the database yet."}</p>
            {searchQuery && <button onClick={() => {setSearchQuery(''); setServiceFilter('all'); setTimeFilter('all');}} className="reset-filters-btn">Clear all filters</button>}
          </div>
        ) : (
          <div className="leads-table-container">
            <table className="leads-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="lead-row">
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td><strong>{lead.name}</strong><div style={{fontSize: '11px', color: '#64748b'}}>{lead.phone}</div></td>
                    <td>{lead.email}</td>
                    <td>
                      <span className={`status-badge ${lead.status?.toLowerCase().replace(' ', '-') || 'new'}`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td>
                      <span className={`source-tag ${lead.source || 'website_form'}`}>
                        {lead.source === 'chat_widget' ? '💬 Chat' : '📄 Form'}
                      </span>
                    </td>
                    <td><button type="button" className="view-btn">Consult / Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="lead-modal" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Add New Manual Lead</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>×</button>
            </header>
            <div className="modal-body">
              <div className="modal-grid">
                <div className="crf-field">
                  <label>Client Name</label>
                  <input type="text" placeholder="John Doe" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
                </div>
                <div className="crf-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                </div>
                <div className="crf-field">
                  <label>Phone Number</label>
                  <input type="text" placeholder="925-XXX-XXXX" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} />
                </div>
                <div className="crf-field">
                  <label>Service Interested In</label>
                  <select onChange={e => setNewLead({...newLead, service: e.target.value})}>
                    <option>Website Creation</option>
                    <option>Website Updates &amp; Fixes</option>
                    <option>SEO &amp; Internet Marketing</option>
                    <option>Partnership / Sponsorship</option>
                    <option>Enterprise Web App</option>
                  </select>
                </div>
              </div>
              <div className="crm-notes-section" style={{borderTop: 'none', paddingTop: 0}}>
                <label style={{fontSize: '13px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px'}}>Initial Consultation Notes</label>
                <textarea 
                  placeholder="Quick summary of the phone call or inquiry..."
                  onChange={e => setNewLead({...newLead, notes: e.target.value})}
                  style={{minHeight: '100px'}}
                ></textarea>
              </div>
              <div className="modal-footer-actions">
                <button type="button" onClick={handleManualAddLead} className="reply-btn" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save New Lead ➔'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="lead-modal" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <div className="modal-id">Lead #{selectedLead.id}</div>
              <h3>{selectedLead.name}</h3>
              <button className="close-modal" onClick={() => setSelectedLead(null)}>×</button>
            </header>
            
            <div className="modal-body">
              <div className="modal-grid">
                <div className="modal-main-info">
                  <div className="info-row"><strong>Phone:</strong> <input type="text" className="inline-edit-input" defaultValue={selectedLead.phone} onBlur={(e) => handleUpdateLead(selectedLead.id, selectedLead.status, selectedLead.notes, e.target.value)} /></div>
                  <div className="info-row"><strong>Service:</strong> <span className="service-tag">{selectedLead.service}</span></div>
                  <div className="info-row"><strong>Email:</strong> <a href={`mailto:${selectedLead.email}`} className="email-link">{selectedLead.email}</a></div>
                  <div className="info-row"><strong>Date:</strong> {new Date(selectedLead.created_at).toLocaleString()}</div>
                  <div className="info-row"><strong>Source:</strong> <span className="source-tag">{selectedLead.source?.replace('_', ' ')}</span></div>
                  
                  <div className="status-management">
                    <label>Lifecycle Status:</label>
                    <select 
                      value={selectedLead.status || 'New'} 
                      onChange={(e) => handleUpdateLead(selectedLead.id, e.target.value, selectedLead.notes, selectedLead.phone)}
                      className="status-select"
                      disabled={isUpdating}
                    >
                      <option>New</option>
                      <option>In Discussion</option>
                      <option>Proposal Sent</option>
                      <option>Converted</option>
                      <option>Lost / Closed</option>
                    </select>
                  </div>
                </div>

                <div className="modal-message-section">
                  <h4>Customer Message:</h4>
                  <div className="message-text">
                    {selectedLead.message}
                  </div>
                </div>
              </div>

              <div className="crm-notes-section">
                <div className="notes-header">
                  <h4>Consultation Workspace</h4>
                  <span className="live-tag">Live Notes</span>
                </div>
                <textarea 
                  placeholder="Type real-time notes during your call (budget, deadlines, project scope, internal thoughts)..."
                  defaultValue={selectedLead.notes || ''}
                  onBlur={(e) => handleUpdateLead(selectedLead.id, selectedLead.status, e.target.value, selectedLead.phone)}
                  disabled={isUpdating}
                ></textarea>
                <div className="notes-tip">Changes are saved automatically when you click outside the box.</div>
              </div>

              <div className="modal-footer-actions">
                <a 
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedLead.email}&su=Project Follow-up: ${selectedLead.service} - NextWave Tech Studio`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="reply-btn"
                >Reply via Gmail ✉️</a>
                
                <button 
                  onClick={() => handleDeleteLead(selectedLead.id)} 
                  className="delete-lead-btn"
                >Delete Record</button>
              </div>
            </div>
          </div>
        </div>
      )}


      <style dangerouslySetInnerHTML={{ __html: `
        .admin-login-container {
          min-height: 100vh;
          background: #0B1F3A;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }
        .admin-login-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .admin-login-card p { color: #8892b0; margin-bottom: 30px; }
        .admin-login-card input {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          margin-bottom: 20px;
          font-size: 16px;
        }
        .admin-login-card button {
          width: 100%;
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: #1ABC9C;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        .admin-login-card button:hover { background: #16a085; }
        .error-text { color: #ff4d4d; margin-bottom: 15px; font-size: 14px; }

        .admin-dashboard-layout {
          min-height: 100vh;
          background: #f8fafc;
          color: #333;
          font-family: 'Inter', sans-serif;
        }
        .admin-nav {
          background: #fff;
          padding: 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .admin-nav-brand { display: flex; align-items: center; gap: 10px; font-weight: 800; }
        .portal-tag { font-size: 12px; background: #2c3e50; color: #fff; padding: 2px 8px; border-radius: 4px; }
        .logout-btn { background: #fee2e2; color: #991b1b; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600; }

        .admin-content { padding: 40px; max-width: 1400px; margin: auto; }
        .content-header { margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 30px; display: flex; flex-direction: column; gap: 25px; }
        
        .header-main { display: flex; justify-content: space-between; align-items: flex-start; }
        .header-main h1 { font-size: 32px; font-weight: 800; color: #0B1F3A; margin: 0; }
        
        .analytics-summary { display: flex; gap: 20px; }
        .ans-item { background: #fff; padding: 10px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .ans-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold; margin-right: 8px; }
        .ans-val { font-size: 18px; font-weight: 800; color: #1ABC9C; }

        .crm-master-controls { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
        .search-box { flex: 1; min-width: 300px; }
        .search-box input {
          width: 100%;
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 14px;
          transition: 0.3s;
          background: #fff;
        }
        .search-box input:focus { outline: none; border-color: #1ABC9C; box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.1); }

        .filter-group { display: flex; gap: 15px; align-items: center; }
        .service-filter-select {
          padding: 10px 15px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          background: #fff;
        }

        .time-filters { display: flex; background: #e2e8f0; padding: 4px; border-radius: 10px; }
        .filter-btn {
          background: transparent;
          border: none;
          padding: 6px 15px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn.active { background: #fff; color: #0B1F3A; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

        .add-manual-btn {
          background: #1ABC9C;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 13px;
          cursor: pointer;
          transition: 0.3s;
        }
        .add-manual-btn:hover { background: #16a085; transform: translateY(-2px); }

        .export-btn {
          background: #0B1F3A;
          color: #fff;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: bold;
          font-size: 13px;
          cursor: pointer;
          transition: 0.3s;
        }
        .export-btn:hover { background: #1a3a5f; transform: translateY(-2px); }

        .no-leads { text-align: center; padding: 100px; color: #64748b; background: #fff; border-radius: 15px; border: 1px dashed #cbd5e1; }
        .reset-filters-btn { margin-top: 15px; background: #f1f5f9; border: none; padding: 8px 16px; border-radius: 6px; color: #1ABC9C; font-weight: bold; cursor: pointer; }
        
        .leads-loading { text-align: center; padding: 100px; background: #fff; border-radius: 15px; border: 1px solid #e2e8f0; }
        .loader { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #1ABC9C; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .search-box { position: relative; flex: 1; min-width: 300px; display: flex; gap: 5px; }
        .search-box input { flex: 1; }
        .search-trigger-btn { background: #1ABC9C; color: white; border: none; padding: 0 15px; border-radius: 10px; cursor: pointer; height: 44px; display: flex; align-items: center; justify-content: center; }
        .search-trigger-btn:hover { background: #16a085; }

        .clear-search { position: absolute; right: 55px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; }
        .clear-search:hover { color: #64748b; }

        .leads-table-container { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .leads-table { width: 100%; border-collapse: collapse; }
        .leads-table th { background: #f8fafc; text-align: left; padding: 18px 20px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f1f5f9; }
        .leads-table td { padding: 18px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
        .lead-row { cursor: pointer; transition: 0.2s; }
        .lead-row:hover { background: #fcfdfe; }
        
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .status-badge.new { background: #eff6ff; color: #3b82f6; }
        .status-badge.in-discussion { background: #fff7ed; color: #f97316; }
        .status-badge.proposal-sent { background: #f5f3ff; color: #8b5cf6; }
        .status-badge.converted { background: #f0fdf4; color: #22c55e; }
        .status-badge.lost-/-closed { background: #fef2f2; color: #ef4444; }

        .service-tag { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 12px; color: #475569; font-weight: 600; }
        .source-tag { font-size: 12px; font-weight: bold; }
        .source-tag.chat_widget { color: #1ABC9C; }
        .source-tag.website_form { color: #3b82f6; }
        .view-btn { border: 1px solid #e2e8f0; background: #fff; padding: 6px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; color: #64748b; font-weight: 600; }
        .view-btn:hover { border-color: #1ABC9C; color: #1ABC9C; }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(11, 31, 58, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 2000;
        }
        .lead-modal {
          background: #fff;
          width: 100%;
          max-width: 900px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }
        .modal-header { background: #0B1F3A; color: #fff; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
        .modal-id { font-size: 12px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .modal-header h3 { font-size: 24px; margin: 0; font-weight: 800; }
        .close-modal { background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 20px; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        
        .modal-body { padding: 40px; }
        
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .crf-field { margin-bottom: 20px; }
        .crf-field label { display: block; font-size: 12px; font-weight: 800; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
        .crf-field input, .crf-field select { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #0B1F3A; }
        .crf-field input:focus, .crf-field select:focus { outline: none; border-color: #1ABC9C; box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.1); }

        .modal-message-section h4, .crm-notes-section h4 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 15px; }
        .message-text { background: #f1f5f9; padding: 25px; border-radius: 12px; font-size: 15px; line-height: 1.6; color: #334155; min-height: 150px; white-space: pre-wrap; }

        .inline-edit-input { border: 1px dashed #cbd5e1; background: transparent; padding: 2px 5px; border-radius: 4px; font-weight: 600; color: #1ABC9C; font-size: 14px; width: 150px; }
        .inline-edit-input:focus { outline: none; border-color: #1ABC9C; background: #fff; }

        .notes-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .live-tag { font-size: 10px; color: #ef4444; border: 1px solid #fee2e2; padding: 2px 6px; border-radius: 4px; font-weight: 800; text-transform: uppercase; animation: blink 2s infinite; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

        .crm-notes-section textarea {
          width: 100%;
          min-height: 120px;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.6;
          transition: 0.3s;
          resize: vertical;
        }
        .crm-notes-section textarea:focus { outline: none; border-color: #1ABC9C; box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.1); }
        .notes-tip { font-size: 11px; color: #94a3b8; margin-top: 8px; font-style: italic; }

        .modal-footer-actions { margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .reply-btn {
          background: #1ABC9C;
          color: #fff;
          padding: 14px 28px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 800;
          font-size: 15px;
          transition: 0.3s;
          box-shadow: 0 4px 15px rgba(26, 188, 156, 0.3);
        }
        .reply-btn:hover { background: #16a085; transform: translateY(-2px); }
        .delete-lead-btn { background: #fee2e2; color: #ef4444; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .delete-lead-btn:hover { background: #fecaca; }

        .no-leads { text-align: center; padding: 100px; color: #64748b; background: #fff; border-radius: 15px; }

        .leads-table-container { background: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .leads-table { width: 100%; border-collapse: collapse; }
        .leads-table th { background: #f1f5f9; text-align: left; padding: 15px; color: #64748b; font-size: 13px; text-transform: uppercase; }
        .leads-table td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .lead-row { cursor: pointer; transition: 0.2s; }
        .lead-row:hover { background: #f8fafc; }
        .service-tag { background: #e2e8f0; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
        .source-tag { font-size: 12px; font-weight: bold; }
        .source-tag.chat_widget { color: #1ABC9C; }
        .source-tag.website_form { color: #3b82f6; }
        .view-btn { background: #f1f5f9; border: none; padding: 5px 10px; border-radius: 5px; font-size: 12px; cursor: pointer; }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }
        .lead-modal {
          background: #fff;
          width: 100%;
          max-width: 600px;
          border-radius: 20px;
          overflow: hidden;
        }
        .modal-header { background: #0B1F3A; color: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
        .close-modal { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; }
        .modal-body { padding: 30px; }
        .meta-info p { margin-bottom: 8px; font-size: 14px; }
        .message-content { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; min-height: 100px; }
        .reply-btn {
          display: inline-block;
          background: #1ABC9C;
          color: #fff;
          padding: 12px 25px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
        }

        /* Toast Styles */
        .toast-container {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%) translateY(100px);
          background: #fff;
          padding: 12px 24px;
          border-radius: 50px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 9999;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          border: 1px solid #eee;
        }
        .toast-container.visible {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        .toast-container.success { border-left: 5px solid #1ABC9C; }
        .toast-container.error { border-left: 5px solid #ef4444; }
        .toast-icon { font-size: 18px; }
        .toast-message { font-size: 14px; font-weight: 600; color: #0B1F3A; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
