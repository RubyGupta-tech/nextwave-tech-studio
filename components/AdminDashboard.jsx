import React, { useState, useEffect } from 'react';
import '../src/styles/global.css';

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        headers: {
          'x-admin-password': password
        }
      });

      const data = await response.json();

      if (response.ok) {
        setLeads(data.leads);
        setIsLoggedIn(true);
        // Store password in session storage for refreshing
        sessionStorage.setItem('admin_key', password);
      } else {
        setError(data.error || 'Invalid password');
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
      // We can't call handleLogin directly here because of state lifecycle, 
      // but we can trigger it once password is set.
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('admin_key') && !isLoggedIn) {
      handleLogin();
    }
  }, [password]);

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
              placeholder="Enter Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            {error && <div className="error-text">{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Login ➔'}
            </button>
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
        <button onClick={() => {
          sessionStorage.removeItem('admin_key');
          window.location.reload();
        }} className="logout-btn">Logout</button>
      </nav>

      <main className="admin-content">
        <header className="content-header">
          <h1>Customer Inquiries</h1>
          <div className="stats-badge">{leads.length} Total Leads</div>
        </header>

        <div className="leads-table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Source</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="lead-row">
                  <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td><strong>{lead.name}</strong></td>
                  <td>{lead.email}</td>
                  <td><span className="service-tag">{lead.service}</span></td>
                  <td>
                    <span className={`source-tag ${lead.source}`}>
                      {lead.source === 'chat_widget' ? '💬 Chat' : '📄 Form'}
                    </span>
                  </td>
                  <td><button className="view-btn">View Message</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Message Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="lead-modal" onClick={e => e.stopPropagation()}>
            <header className="modal-header">
              <h3>Inquiry from {selectedLead.name}</h3>
              <button className="close-modal" onClick={() => setSelectedLead(null)}>×</button>
            </header>
            <div className="modal-body">
              <div className="meta-info">
                <p><strong>Email:</strong> {selectedLead.email}</p>
                <p><strong>Service:</strong> {selectedLead.service}</p>
                <p><strong>Date:</strong> {new Date(selectedLead.created_at).toLocaleString()}</p>
              </div>
              <hr />
              <div className="message-content">
                <h4>Message:</h4>
                <p>{selectedLead.message}</p>
              </div>
              <div className="modal-actions">
                <a href={`mailto:${selectedLead.email}`} className="reply-btn">Reply via Email ✉️</a>
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
        .admin-login-card h2 { color: #fff; margin-bottom: 10px; }
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
        }
        .admin-nav {
          background: #fff;
          padding: 15px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .admin-nav-brand { display: flex; align-items: center; gap: 10px; font-weight: bold; }
        .logout-btn { background: #eee; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; }

        .admin-content { padding: 40px; max-width: 1200px; margin: auto; }
        .content-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .stats-badge { background: #1ABC9C; color: #fff; padding: 5px 15px; border-radius: 20px; font-weight: bold; }

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
      `}} />
    </div>
  );
};

export default AdminDashboard;
