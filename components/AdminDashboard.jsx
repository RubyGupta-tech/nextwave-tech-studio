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
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const [viewTab, setViewTab] = useState('active'); // 'active' or 'archived'
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [sysVersion] = useState('v24.0 (PERFECT MOBILE)');
  const [apiStatus, setApiStatus] = useState('checking'); // 'online', 'offline', 'checking'
  const [expectedLen, setExpectedLen] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Deployment Heartbeat: 2026-04-13T23:30:00Z

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
  };

  useEffect(() => {
    // 1. Domain Enforcement: Redirect to dnextwave.com if on vercel.app
    if (window.location.host.includes('vercel.app')) {
      window.location.replace('https://dnextwave.com/admin');
      return;
    }

    // 2. Ping API to check connection
    fetch('/api/ping?_t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data.status === 'online') {
          setApiStatus('online');
          setExpectedLen(data.pLen || 0);
        } else {
          setApiStatus('offline');
        }
      })
      .catch(() => setApiStatus('offline'));
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setError("Please enter a password first.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        filter: timeFilter,
        search: searchQuery.trim(),
        service: serviceFilter,
        tab: viewTab,
        _t: Date.now(),
        auth: password.trim()
      });

      // Use the original, fully-deployed API endpoint
      const response = await fetch(`/api/get-leads?${params.toString()}`, {
        headers: {
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`Connection Refused [${data.error || response.status}]`);
        if (response.status === 401) {
          sessionStorage.removeItem('admin_key');
        }
        return;
      }

      if (response.ok) {
        setLeads(data.leads);
        setIsLoggedIn(true);
        sessionStorage.setItem('admin_key', password.trim());
        showToast('Connected!');
      } else {
        let errorMsg = 'Invalid credentials';
        
        if (response.status === 401) {
          errorMsg = '❌ Incorrect Admin Password. Please check your Vercel settings.';
        } else if (data.details) {
          errorMsg = `DB Error: ${data.details}`;
        } else if (data.error) {
          errorMsg = data.error;
        }

        setError(errorMsg);
        showToast(errorMsg, 'error');

        // 401 Safety: Clear stored password if it's invalid
        if (response.status === 401) {
          sessionStorage.removeItem('admin_key');
          if (data.status === 'online') {
            setApiStatus('online');
            setExpectedLen(data.pLen || 0);
          } else {
            setIsLoggedIn(false);
            setPassword('');
          }
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError('Connection failed. Check your internet connection.');
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
  }, [timeFilter, searchQuery, serviceFilter, viewTab]);

  const handleEmergencyReset = () => {
    sessionStorage.clear();
    localStorage.clear();
    setPassword('');
    setIsLoggedIn(false);
    showToast('🚨 System Synced & Cleared. Forcing Refresh...', 'success');
    setTimeout(() => {
      window.location.reload(true);
    }, 1500);
  };

  const handleUpdateLead = async (id, status, notes, phone, is_archived) => {
    if (!password.trim()) return;
    setIsUpdating(true);
    try {
      const resp = await fetch('/api/update-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim()
        },
        body: JSON.stringify({ id, status, notes, phone, is_archived, auth: password.trim() })
      });
      if (resp.status === 401) {
        const data = await resp.json();
        showToast(`Unauthorized: ${data.error}`, 'error');
        return;
      }
      if (resp.ok) {
        // If the lead was archived/restored, it should move out of the current view
        if (typeof is_archived !== 'undefined' && is_archived !== (viewTab === 'archived')) {
          setLeads(prev => prev.filter(l => l.id !== id));
          setSelectedLead(null);
          showToast(is_archived ? 'Lead moved to Archives' : 'Lead restored to Inbox');
          return;
        }

        // Otherwise find and update the lead in the main list
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status, notes, phone, is_archived } : l));

        // Force update the selectedLead state to ensure modal reflects changes
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(prev => ({ ...prev, status, notes, phone, is_archived }));
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
    if (!password.trim()) return;

    // 1. Better Validation
    if (!newLead.name || !newLead.name.trim()) {
      showToast("Client Name is required!", "error");
      return;
    }
    if (!newLead.email && !newLead.phone) {
      showToast("Please provide either an Email or Phone!", "error");
      return;
    }

    setIsUpdating(true);
    try {
      const resp = await fetch('/api/add-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim()
        },
        body: JSON.stringify({ ...newLead, auth: password.trim() })
      });

      // Handle cases where the endpoint is not ready yet (404 during deployment)
      if (resp.status === 404) {
        showToast("System is updating... please try again in 30 seconds.", "error");
        return;
      }

      const contentType = resp.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await resp.text();
        console.error("Non-JSON response:", text);
        showToast("Server error. Please refresh and try again.", "error");
        return;
      }

      const data = await resp.json();
      if (resp.status === 401) {
        showToast(`Unauthorized: ${data.error}`, 'error');
        return;
      }
      if (resp.ok) {
        setLeads(prev => [data.lead, ...prev]);
        setShowAddModal(false);
        setNewLead({ name: '', email: '', phone: '', service: 'Website Creation', notes: '' });
        showToast('Manual lead saved successfully!');
      } else {
        showToast(data.details || data.error || "Failed to add lead", 'error');
      }
    } catch (err) {
      console.error("Add failed:", err);
      showToast('Network error. Check your connection.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!password.trim()) return;
    setIsDeleting(true);
    try {
      const resp = await fetch('/api/delete-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim()
        },
        body: JSON.stringify({ id })
      });

      const data = await resp.json();

      if (resp.status === 401) {
        console.error("Auth Failure details:", data);
        showToast(`Unauthorized: ${data.error || 'Session Expired'}`, 'error');
        return;
      }

      if (resp.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
        setSelectedLead(null);
        setDeletingLeadId(null);
        showToast('Lead deleted permanently', 'success');
      } else {
        showToast(data.error || 'Failed to delete lead', 'error');
      }
    } catch (err) {
      console.error("Delete failed:", err);
      showToast('Connection error. Try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendReply = async () => {
    if (!password.trim()) return;
    if (!replyText.trim()) {
      showToast('Please type a message before sending!', 'error');
      return;
    }

    setIsSendingReply(true);
    try {
      const resp = await fetch('/api/crm-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim()
        },
        body: JSON.stringify({
          leadId: selectedLead.id,
          toEmail: selectedLead.email,
          toName: selectedLead.name,
          replyText: replyText,
          originalMessage: selectedLead.message || "Manual Entry",
          service: selectedLead.service,
          auth: password.trim()
        })
      });

      const data = await resp.json();
      if (resp.status === 401) {
        showToast(`Unauthorized: ${data.error}`, 'error');
        return;
      }
      if (resp.ok) {
        showToast('Reply sent and logged successfully!');
        setReplyText('');
        fetchMessages(selectedLead.id); // Refresh chat history
      } else {
        // Show specific server error message
        const errorMsg = data.error || data.details || 'Failed to send reply';
        showToast(errorMsg, 'error');
        console.error("Server error details:", data);
      }
    } catch (err) {
      console.error("Reply failed:", err);
      showToast('Network error!', 'error');
    } finally {
      setIsSendingReply(false);
    }
  };

  const fetchMessages = async (leadId) => {
    if (!password.trim()) return;
    setIsLoadingMessages(true);
    try {
      const resp = await fetch(`/api/get-messages?leadId=${leadId}&auth=${encodeURIComponent(password.trim())}`, {
        headers: { 
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim() 
        }
      });
      const data = await resp.json();
      if (resp.ok) {
        setMessages(data.messages);
      } else if (resp.status === 401) {
        console.error("Auth Failure in fetchMessages:", data);
      }
    } catch (err) {
      console.error("Fetch messages failed:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (messageId, leadId) => {
    if (!password.trim()) return;
    try {
      const resp = await fetch('/api/delete-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim()
        },
        body: JSON.stringify({ id: messageId, auth: password.trim() })
      });
      const data = await resp.json();
      if (resp.ok) {
        showToast('Message deleted');
        fetchMessages(leadId); // Refresh history
      } else {
        showToast(data.error || 'Failed to delete message', 'error');
      }
    } catch (err) {
      console.error("Delete msg failed:", err);
    }
  };

  const handleLogClientMessage = async (content) => {
    if (!password.trim()) return;
    if (!content.trim()) return;
    setIsSendingReply(true);
    try {
      const resp = await fetch('/api/log-client-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-crm-admin-key': password.trim(),
          'x-nextwave-auth': password.trim()
        },
        body: JSON.stringify({ leadId: selectedLead.id, content, auth: password.trim() })
      });
      if (resp.status === 401) {
        const data = await resp.json();
        showToast(`Unauthorized: ${data.error}`, 'error');
        return;
      }
      if (resp.ok) {
        fetchMessages(selectedLead.id);
      }
    } catch (err) {
      console.error("Manual log failed:", err);
    } finally {
      setIsSendingReply(false);
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
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            background: '#f97316', // BRIGHT ORANGE FOR v24
            color: 'white',
            textAlign: 'center',
            padding: '12px',
            fontWeight: '900',
            fontSize: '16px',
            zIndex: 10000,
            boxShadow: '0 4px 25px rgba(249, 115, 22, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            ⚡ VERSION v24.0 (HARD UPDATE) - REFRESH IF NOT ORANGE
          </div>
        <div className="admin-login-card">
          <div className="admin-logo">
            <img src="/NextWave_logo1.web.jpeg" alt="NextWave" style={{ width: '150px', marginBottom: '20px' }} />
          </div>
          <h2>Leads Dashboard</h2>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '20px',
            fontSize: '11px',
            marginTop: '5px',
            marginBottom: '15px',
            color: apiStatus === 'online' ? '#22c55e' : (apiStatus === 'offline' ? '#ef4444' : '#94a3b8')
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'currentColor',
              boxShadow: apiStatus === 'online' ? '0 0 8px #22c55e' : 'none'
            }}></span>
            {apiStatus === 'online' ? 'Database Online' : (apiStatus === 'offline' ? 'Local API Offline' : 'Checking Connection...')}
          </div>
          <p>Secure access only</p>
          <form onSubmit={handleLogin}>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                id="admin-password"
                name="admin-password"
                placeholder="Enter Admin Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                style={{ paddingRight: '40px' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px', width: 'auto', padding: '5px' }}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {expectedLen > 0 && password.length > 0 && password.length !== expectedLen && (
              <div className="error-text" style={{ fontSize: '10px', marginTop: '5px', color: '#fbbf24' }}>
                ⚠️ Password Length Mismatch (Expected: {expectedLen}, Typed: {password.length})
              </div>
            )}
            {error && <div className="error-text">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying Connection...' : 'Login ->'}
            </button>
            <div style={{ marginTop: '15px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => {
                  sessionStorage.removeItem('admin_key');
                  setPassword('');
                  setError(null);
                  showToast('Session cleared. Please re-enter password.', 'success');
                }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Reset Stale Session
              </button>
              <button 
                type="button" 
                onClick={handleEmergencyReset}
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fff', fontSize: '11px', cursor: 'pointer', padding: '8px', borderRadius: '6px', fontWeight: 'bold' }}
              >
                🚨 Emergency Session Reset (Fix Sync)
              </button>
            </div>
            <div style={{ marginTop: '15px', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
              System Version: v6.1 (Resilient Sync Active)
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
          <div className="version-badge" style={{ background: '#dc2626' }}>v18.0</div>
          <span>Admin Portal</span>
        </div>
        <div className="nav-actions">
          <div className="api-status">
            <span className="status-dot"></span>
            {viewTab === 'active' ? 'Viewing Inbox' : 'Viewing Archives'}
          </div>
          <button type="button" onClick={() => {
            sessionStorage.removeItem('admin_key');
            window.location.reload();
          }} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="admin-content">
        <div className="tab-control">
          <button className={`tab-btn ${viewTab === 'active' ? 'active' : ''}`} onClick={() => setViewTab('active')}>
            📥 Main Inbox
            <span className="tab-count">{viewTab === 'active' ? leads.length : ''}</span>
          </button>
          <button className={`tab-btn ${viewTab === 'archived' ? 'active' : ''}`} onClick={() => setViewTab('archived')}>
            📦 Archives
            <span className="tab-count">{viewTab === 'archived' ? leads.length : ''}</span>
          </button>
        </div>

        <div className="integration-info-box">
          <h5>⚡ Gmail Auto-Sync Active</h5>
          <p>Copy this URL into <b>Zapier</b> or <b>Make</b> to auto-post client replies here:</p>
          <div 
            className="webhook-url-display" 
            onClick={() => {
              const url = `https://dnextwave.com/api/inbound?auth=${password.trim()}`;
              navigator.clipboard.writeText(url);
              showToast('URL Copied to Clipboard!');
            }}
          >
            https://dnextwave.com/api/inbound?auth=***
          </div>
          <p style={{ marginTop: '8px', opacity: 0.7 }}>Click above to copy your private sync link.</p>
        </div>

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
            {searchQuery && <button onClick={() => { setSearchQuery(''); setServiceFilter('all'); setTimeFilter('all'); }} className="reset-filters-btn">Clear all filters</button>}
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
                  <tr key={lead.id} className="lead-row" onClick={() => {
                    setSelectedLead(lead);
                    fetchMessages(lead.id);
                  }}>
                    <td data-label="DATE">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td data-label="NAME">
                      <strong>{lead.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{lead.phone}</div>
                    </td>
                    <td data-label="EMAIL">{lead.email}</td>
                    <td data-label="STATUS">
                      <span className={`status-badge ${lead.status?.toLowerCase().replace(/ /g, '-') || 'new'}`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td data-label="SOURCE">{lead.source?.replace('_', ' ') || 'Direct'}</td>
                    <td data-label="ACTION">
                      <button type="button" className="view-btn">Consult / Edit</button>
                      {lead.notes?.includes('--- REPLY SENT') && (
                        <span className="replied-badge" title="Response has been sent via dashboard">✓ Sent</span>
                      )}
                    </td>
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
                  <input type="text" placeholder="John Doe" value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} />
                </div>
                <div className="crf-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="john@example.com" value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} />
                </div>
                <div className="crf-field">
                  <label>Phone Number</label>
                  <input type="text" placeholder="925-XXX-XXXX" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} />
                </div>
                <div className="crf-field">
                  <label>Service Interested In</label>
                  <select onChange={e => setNewLead({ ...newLead, service: e.target.value })}>
                    <option>Website Creation</option>
                    <option>Website Updates &amp; Fixes</option>
                    <option>SEO &amp; Internet Marketing</option>
                    <option>Partnership / Sponsorship</option>
                    <option>Enterprise Web App</option>
                  </select>
                </div>
              </div>
              <div className="crm-notes-section" style={{ borderTop: 'none', paddingTop: 0 }}>
                <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Initial Consultation Notes</label>
                <textarea
                  placeholder="Quick summary of the phone call or inquiry..."
                  onChange={e => setNewLead({ ...newLead, notes: e.target.value })}
                  style={{ minHeight: '100px' }}
                ></textarea>
              </div>
              <div className="modal-footer-actions">
                <button type="button" onClick={handleManualAddLead} className="reply-btn" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save New Lead ->'}
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
                      onChange={(e) => handleUpdateLead(selectedLead.id, e.target.value, selectedLead.notes, selectedLead.phone, selectedLead.is_archived)}
                      className="status-select"
                      disabled={isUpdating}
                    >
                      <option>New</option>
                      <option>In Discussion</option>
                      <option>Proposal Sent</option>
                      <option>Converted</option>
                      <option>New Reply</option>
                      <option>Lost / Closed</option>
                    </select>
                  </div>
                </div>

                <div className="modal-message-section">
                  <h4>Initial Inquiry:</h4>
                  <div className="message-text">
                    {selectedLead.message || "No message provided (Manual Entry)."}
                  </div>
                </div>
              </div>

               {/* CONVERSATION HISTORY (CHAT UI) */}
              <div className="conversation-history-container">
                <header className="history-header">
                  <h4>💬 Conversation History</h4>
                  {isLoadingMessages && <span className="syncing-indicator">Syncing...</span>}
                </header>
                <div className="chat-bubbles-wrap">
                  {messages.length === 0 ? (
                    <div className="empty-chat">
                      <p>No messages yet. Use the tool below to log your first contact.</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div key={msg.id} className={`chat-bubble-container ${msg.sender === 'admin' ? 'sent' : 'received'}`}>
                          <div className={`chat-bubble ${msg.sender}`}>
                            <div className="bubble-sender">
                              {msg.sender === 'admin' ? 'NextWave Studio' : selectedLead.name}
                            </div>
                            <div className="bubble-content">{msg.content}</div>
                            <div className="bubble-footer">
                              <span className="bubble-time">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <button 
                                className="delete-msg-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMessage(msg.id, selectedLead.id);
                                }}
                                title="Delete this message"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                              </button>
                              {msg.sender === 'admin' && (
                                <span className="bubble-status">
                                  <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 9L1.5 6L0.5 7L4.5 11L13.5 2L12.5 1L4.5 9Z" fill="#34B7F1"/>
                                    <path d="M8.5 9L5.5 6L4.5 7L8.5 11L17.5 2L16.5 1L8.5 9Z" fill="#34B7F1"/>
                                  </svg>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                
                {/* NEW: Nice Pop Inline Manual Logger */}
                <div className="manual-log-area">
                  <div className="log-input-group">
                    <input 
                      type="text" 
                      placeholder="Log a client reply (phone call, SMS, or outside email)..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          handleLogClientMessage(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      id="manual-log-input"
                    />
                    <button 
                      className="log-pop-btn"
                      onClick={() => {
                        const input = document.getElementById('manual-log-input');
                        if (input && input.value.trim()) {
                          handleLogClientMessage(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      Log Entry
                    </button>
                  </div>
                </div>
              </div>

              {/* NEW DIRECT REPLY SECTION */}
              <div className="crm-reply-section">
                <header className="reply-header">
                  <h4>🚀 Direct Studio Response</h4>
                  <span className="reply-info">Auto-Sync Enabled • Ruby @ NextWave</span>
                </header>
                <textarea
                  placeholder={`Hi ${selectedLead.name.split(' ')[0]}, thank you for reaching out regarding ${selectedLead.service}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isSendingReply}
                  style={{ minHeight: '140px', background: '#f8fafc', border: '1px solid #1ABC9C' }}
                ></textarea>
                <div className="reply-actions">
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                    This will send a professional HTML email directly to <strong>{selectedLead.email}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="reply-trigger-btn"
                    disabled={isSendingReply || !selectedLead.email}
                  >
                    {isSendingReply ? 'Sending Response...' : 'Send Reply ->'}
                  </button>
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
                  onBlur={(e) => handleUpdateLead(selectedLead.id, selectedLead.status, e.target.value, selectedLead.phone, selectedLead.is_archived)}
                  disabled={isUpdating}
                ></textarea>
                <div className="notes-tip">Changes are saved automatically when you click outside the box.</div>
              </div>

              <div className="modal-footer-actions">
                <div className="secondary-actions">
                  {selectedLead.is_archived ? (
                    <button onClick={() => handleUpdateLead(selectedLead.id, selectedLead.status, selectedLead.notes, selectedLead.phone, false)} className="archive-btn restore">📤 Restore to Inbox</button>
                  ) : (
                    <button onClick={() => handleUpdateLead(selectedLead.id, selectedLead.status, selectedLead.notes, selectedLead.phone, true)} className="archive-btn">📦 Archive Lead</button>
                  )}

                  <button
                    onClick={() => setDeletingLeadId(selectedLead.id)}
                    className="delete-lead-btn"
                  >Permanent Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLeadId && (
        <div className="modal-overlay" style={{ zIndex: 9000 }} onClick={() => !isDeleting && setDeletingLeadId(null)}>
          <div className="lead-modal confirm-box" style={{ zIndex: 9001 }} onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">{isDeleting ? '⏳' : '⚠️'}</div>
            <h3>{isDeleting ? 'Deleting Record...' : 'Delete Record permanently?'}</h3>
            <p>{isDeleting ? 'Please wait while we remove this lead from the database.' : 'Are you sure you want to remove this lead? This action cannot be undone and all consultation notes will be lost.'}</p>
            <div className="confirm-actions">
              <button className="cancel-btn" onClick={() => setDeletingLeadId(null)} disabled={isDeleting}>No, Keep it</button>
              <button 
                className="confirm-btn" 
                onClick={() => handleDeleteLead(deletingLeadId)}
                disabled={isDeleting}
                style={{ opacity: isDeleting ? 0.7 : 1, cursor: isDeleting ? 'not-allowed' : 'pointer' }}
              >
                {isDeleting ? 'Processing...' : 'Yes, Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
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
        .admin-nav { padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .admin-nav-brand { display: flex; align-items: center; gap: 15px; font-weight: 800; }
        .version-badge { background: #1ABC9C; color: #fff; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .nav-actions { display: flex; align-items: center; gap: 20px; }
        .api-status { color: #64748b; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .status-dot { width: 8px; height: 8px; background: #1ABC9C; border-radius: 50%; box-shadow: 0 0 10px #1ABC9C; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .logout-btn { background: #fee2e2; color: #991b1b; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600; }
        
        .integration-info-box { 
          background: #0B1F3A; 
          color: #fff; 
          padding: 15px; 
          border-radius: 12px; 
          margin-bottom: 20px; 
          font-size: 11px;
          border-left: 4px solid #1ABC9C;
        }
        .integration-info-box h5 { margin: 0 0 8px 0; color: #1ABC9C; font-size: 12px; text-transform: uppercase; }
        .webhook-url-display { 
          background: rgba(255,255,255,0.1); 
          padding: 8px; 
          border-radius: 6px; 
          word-break: break-all; 
          margin-top: 5px;
          cursor: pointer;
          font-family: monospace;
        }
        .webhook-url-display:hover { background: rgba(255,255,255,0.2); }

        .tab-control { display: flex; gap: 5px; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .tab-btn { background: transparent; border: none; padding: 10px 20px; font-weight: 800; color: #64748b; cursor: pointer; border-radius: 8px; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
        .tab-btn.active { background: #0B1F3A; color: #fff; }
        .tab-count { background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .tab-btn.active .tab-count { background: rgba(255,255,255,0.2); }

        .admin-content { padding: 40px; max-width: 1400px; margin: auto; }
        .content-header { margin-bottom: 40px; border-bottom: 1px solid #e2e8f0; padding-bottom: 30px; display: flex; flex-direction: column; gap: 25px; }
        
        .header-main { display: flex; justify-content: space-between; align-items: flex-start; }
        .header-main h1 { font-size: 32px; font-weight: 800; color: #0B1F3A; margin: 0; }
        
        .analytics-summary { display: flex; gap: 20px; }
        .ans-item { background: #fff; padding: 10px 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .ans-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold; margin-right: 8px; }
        .ans-val { font-size: 18px; font-weight: 800; color: #1ABC9C; }

        .crm-master-controls { display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
        .search-box { position: relative; flex: 1; min-width: 300px; display: flex; gap: 5px; }
        .search-box input { flex: 1; padding: 12px 20px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 14px; transition: 0.3s; background: #fff; }
        .search-box input:focus { outline: none; border-color: #1ABC9C; box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.1); }
        .search-trigger-btn { background: #1ABC9C; color: white; border: none; padding: 0 15px; border-radius: 10px; cursor: pointer; height: 44px; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .search-trigger-btn:hover { background: #16a085; transform: scale(1.05); }
        .clear-search { position: absolute; right: 55px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; }

        .filter-group { display: flex; gap: 15px; align-items: center; }
        .service-filter-select { padding: 10px 15px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 600; color: #334155; background: #fff; }

        .time-filters { display: flex; background: #e2e8f0; padding: 4px; border-radius: 10px; }
        .filter-btn { background: transparent; border: none; padding: 6px 15px; border-radius: 7px; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .filter-btn.active { background: #fff; color: #0B1F3A; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

        .add-manual-btn { background: #1ABC9C; color: #fff; border: none; padding: 12px 20px; border-radius: 10px; font-weight: bold; font-size: 13px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 10px rgba(26,188,156,0.2); }
        .add-manual-btn:hover { background: #16a085; transform: scale(1.02); }

        .leads-table-container { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
        .leads-table { width: 100%; border-collapse: collapse; }
        .leads-table th { background: #f8fafc; text-align: left; padding: 18px 20px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #f1f5f9; }
        .leads-table td { padding: 18px 20px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
        .lead-row { cursor: pointer; transition: 0.2s; }
        .lead-row:hover { background: #fcfdfe; }
        
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-badge.new { background: #eff6ff; color: #3b82f6; }
        .status-badge.in-discussion { background: #fff7ed; color: #f97316; }
        .status-badge.proposal-sent { background: #f5f3ff; color: #8b5cf6; }
        .status-badge.converted { background: #f0fdf4; color: #22c55e; }
        .status-badge.lost-/-closed { background: #fef2f2; color: #ef4444; }

        /* Modal Core System */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(11, 31, 58, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 5000;
        }
        .lead-modal {
          background: #fff;
          width: 100%;
          max-width: 1200px;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }
        .modal-header { background: #0B1F3A; color: #fff; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 24px; margin: 0; font-weight: 800; }
        .close-modal { background: rgba(255,255,255,0.1); border: none; color: #fff; font-size: 20px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .close-modal:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }
        
        .modal-body { padding: 40px; overflow-y: auto; flex: 1; scrollbar-width: thin; }
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .message-text { background: #f8fafc; padding: 25px; border-radius: 15px; font-size: 15px; line-height: 1.7; color: #334155; border: 1px solid #e2e8f0; white-space: pre-wrap; }

        /* Advanced Chat UI */
        .conversation-history-container { 
          margin-top: 40px; 
          border: 1px solid #e2e8f0; 
          border-radius: 20px; 
          overflow: hidden; 
          background: #fff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .history-header { background: #f8fafc; padding: 15px 25px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .history-header h4 { margin: 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 800; }
        
        .chat-bubbles-wrap { 
          width: 100%;
          padding: 30px; 
          max-height: 500px; 
          overflow-y: auto; 
          display: flex; 
          flex-direction: column; 
          box-sizing: border-box;
          gap: 12px; 
          background: #e5ddd5; /* WhatsApp beige background */
          background-image: radial-gradient(#d2c6b9 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .chat-bubble-container { display: flex; width: 100%; margin-bottom: 2px; }
        .chat-bubble-container.sent { justify-content: flex-end; }
        .chat-bubble-container.received { justify-content: flex-start; }

        .chat-bubble { 
          max-width: 98%; 
          min-width: 240px;
          padding: 12px 18px 10px; 
          border-radius: 14px; 
          font-size: 16px; 
          line-height: 1.6; 
          position: relative;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          animation: slideUp 0.3s ease-out forwards;
          flex: 0 0 auto !important;
          width: fit-content !important;
          min-width: 240px !important;
          box-sizing: border-box !important;
          display: block !important;
          border: 1px solid rgba(0,0,0,0.05);
        }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(15px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        .chat-bubble.admin { 
          background: #e7ffdb; /* WhatsApp sent color */
          color: #1e293b; 
          border-top-right-radius: 0; 
        }
        .chat-bubble.client { 
          background: #ffffff; /* WhatsApp received color */
          color: #1e293b; 
          border-top-left-radius: 0; 
        }
        
        .bubble-sender { 
          font-size: 11px; 
          font-weight: 800; 
          color: #128c7e; 
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chat-bubble.admin .bubble-sender { color: #075e54; }
        
        .bubble-content { 
          margin-bottom: 6px; 
          overflow-wrap: break-word; 
          word-wrap: break-word;
          word-break: normal; 
          white-space: pre-wrap; 
        }
        
        .bubble-footer { display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: -2px; }
        .bubble-time { font-size: 10px; color: #64748b; font-weight: 600; text-transform: uppercase; }
        .bubble-status { display: flex; align-items: center; }
        .bubble-status svg { width: 15px; height: 10px; }

        .delete-msg-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(0, 0, 0, 0.05);
          color: #94a3b8;
          padding: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: scale(0.8);
          z-index: 10;
        }

        .chat-bubble:hover .delete-msg-btn {
          opacity: 1;
          transform: scale(1);
        }

        .delete-msg-btn:hover {
          background: #fee2e2;
          color: #ef4444 !important;
          border-color: #fecaca;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
        }

        .chat-bubble.client .bubble-meta { color: #64748b; }

        /* Deluxe Logging Bar */
        .manual-log-area { 
          padding: 20px 30px; 
          background: #f8fafc; 
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .log-input-group { display: flex; gap: 12px; }
        .log-input-group input { 
          flex: 1; 
          padding: 14px 20px; 
          border-radius: 12px; 
          border: 1px solid #cbd5e1; 
          font-size: 14px;
          transition: 0.3s;
          background: #fff;
          color: #1e293b; /* Explicit dark text */
        }
        .log-input-group input:focus { border-color: #1ABC9C; box-shadow: 0 0 0 4px rgba(26, 188, 156, 0.15); outline: none; }
        
        .log-pop-btn { 
          background: linear-gradient(135deg, #1ABC9C 0%, #16a085 100%);
          color: white; 
          border: none; 
          padding: 0 25px; 
          border-radius: 12px; 
          font-weight: 800; 
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(26, 188, 156, 0.3);
        }
        .log-pop-btn:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 8px 20px rgba(26, 188, 156, 0.4); }
        .log-pop-btn:active { transform: scale(0.95); }

        /* Response & Notes Styling */
        .crm-reply-section { margin-top: 30px; padding: 30px; background: #eff6ff; border-radius: 20px; border: 1px solid #dbeafe; }
        .crm-reply-section textarea { width: 100%; min-height: 140px; padding: 20px; border-radius: 15px; border: 1px solid #cbd5e1; font-family: inherit; font-size: 14px; line-height: 1.6; background: #fff; color: #1e293b; box-sizing: border-box; }
        .reply-trigger-btn { background: #0B1F3A; color: #fff; border: none; padding: 14px 30px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 12px rgba(11,31,58,0.2); }
        .reply-trigger-btn:hover { background: #1a3a5f; transform: translateY(-2px); }

        .crm-notes-section { margin-top: 30px; }
        .crm-notes-section textarea {
          width: 100%;
          min-height: 220px;
          padding: 20px;
          border-radius: 15px;
          border: 1px solid #cbd5e1;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.6;
          background: #fff;
          box-sizing: border-box;
          transition: 0.3s;
          resize: vertical;
        }
        .crm-notes-section textarea:focus { outline: none; border-color: #1ABC9C; box-shadow: 0 0 0 3px rgba(26, 188, 156, 0.1); }
        .notes-tip { font-size: 11px; color: #94a3b8; margin-top: 8px; font-style: italic; }

        /* Secondary Actions & Delete Button */
        .modal-footer-actions { margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .delete-lead-btn { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .delete-lead-btn:hover { background: #fecaca; transform: scale(1.02); }
        .archive-btn { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .archive-btn:hover { background: #e2e8f0; }

        /* Mobile Fixes & Transitions */
        @media (max-width: 768px) {
          .admin-nav { padding: 20px; flex-direction: column; gap: 15px; }
          .admin-nav-brand { flex-direction: column; gap: 8px; }
          .nav-actions { width: 100%; justify-content: center; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 15px; }
          .admin-nav-brand span { display: block; font-size: 14px; opacity: 0.6; }
          .version-badge { position: absolute; top: 10px; left: 10px; margin: 0; }
          
          /* Main Modal Full-Screen on Mobile */
          .lead-modal:not(.confirm-box) { max-height: 100vh; border-radius: 0; }
          .modal-header { background: #0B1F3A; color: #fff; padding: 25px 60px 25px 25px; display: flex; justify-content: space-between; align-items: center; }
          .modal-header h3 { font-size: 20px; }
          .modal-grid { grid-template-columns: 1fr; }
          .modal-body { padding: 20px; }
          .chat-bubbles-wrap { padding: 15px; }
          .chat-bubble { max-width: 98%; } 
          
          .integration-info-box { padding: 12px; font-size: 10px; border-radius: 8px; }
          .integration-info-box h5 { font-size: 11px; }

          .secondary-actions { flex-direction: column; width: 100%; gap: 10px; }
          .archive-btn, .delete-lead-btn { width: 100%; }
          .modal-footer-actions { flex-direction: column-reverse; gap: 20px; }
          .reply-trigger-btn { width: 100%; }
        }

        /* The "Perfect Mobile Card" Overhaul */
        @media (max-width: 640px) {
          .leads-table-container { background: transparent; box-shadow: none; border: none; }
          .leads-table { display: block; }
          .leads-table thead { display: none; } /* Hide headers on mobile */
          .leads-table tbody { display: block; }
          .lead-row { 
            display: grid; 
            grid-template-columns: 1fr; 
            background: #fff; 
            margin-bottom: 20px; 
            border-radius: 18px; 
            padding: 20px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            position: relative;
          }
          .lead-row td { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 10px 0; 
            border: none;
            font-size: 14px;
          }
          .lead-row td::before { 
            content: attr(data-label); 
            font-weight: 800; 
            color: #64748b; 
            font-size: 11px; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .lead-row td:last-child { 
            border-top: 1px solid #f1f5f9; 
            margin-top: 10px; 
            padding-top: 15px;
            justify-content: stretch;
          }
          .lead-row td:last-child button { width: 100%; display: flex; justify-content: center; }
          
          .crm-master-controls { gap: 12px; }
          .search-box { min-width: 100%; }
          .add-manual-btn, .export-btn { width: 100%; }
        }

        @media (max-width: 480px) {
          .confirm-box { padding: 25px !important; border-radius: 20px !important; width: 90% !important; }
          .confirm-actions { flex-direction: column; gap: 10px; }
          .confirm-btn, .cancel-btn { width: 100%; flex: none; }
          .analytics-summary { flex-direction: column; width: 100%; gap: 10px; }
          .ans-item { width: 100%; justify-content: space-between; display: flex; padding: 15px; }
        }

        /* Toast UI */
        .toast-container { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px); background: #fff; padding: 12px 24px; border-radius: 50px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 12px; z-index: 9999; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); opacity: 0; border: 1px solid #eee; }
        .toast-container.visible { transform: translateX(-50%) translateY(0); opacity: 1; }
        .toast-container.success { border-left: 5px solid #1ABC9C; }
        .toast-container.error { border-left: 5px solid #ef4444; }
      `}} />
    </div>
  );
};

export default AdminDashboard;
