import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zip: user?.address?.zip || '',
      country: user?.address?.country || '',
    },
  });

  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/auth/profile`, profile);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) return toast.error('Passwords do not match');
    if (passwords.newPass.length < 6) return toast.error('Password must be at least 6 characters');
    setSaving(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/auth/password`, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      toast.success('Password updated!');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            {user?.role === 'admin' && <span className="badge badge-gold">Admin</span>}
          </div>
        </div>

        <div className="profile-layout">
          {/* Tabs */}
          <nav className="profile-tabs">
            {['profile', 'password'].map(t => (
              <button
                key={t}
                className={`profile-tab ${tab === t ? 'profile-tab--active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'profile' ? '👤 Profile Info' : '🔑 Change Password'}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="profile-content">
            {tab === 'profile' && (
              <form onSubmit={handleProfileSave} className="profile-form">
                <h3>Personal Information</h3>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" value={user?.email} disabled style={{ opacity: 0.5 }} />
                  <small style={{ color: 'var(--text-muted)', fontSize: 12 }}>Email cannot be changed</small>
                </div>

                <h3 style={{ marginTop: 32 }}>Shipping Address</h3>
                <div className="form-grid-2">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Street Address</label>
                    <input
                      className="form-input"
                      value={profile.address.street}
                      onChange={e => setProfile(p => ({ ...p, address: { ...p.address, street: e.target.value } }))}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      className="form-input"
                      value={profile.address.city}
                      onChange={e => setProfile(p => ({ ...p, address: { ...p.address, city: e.target.value } }))}
                      placeholder="New York"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      className="form-input"
                      value={profile.address.state}
                      onChange={e => setProfile(p => ({ ...p, address: { ...p.address, state: e.target.value } }))}
                      placeholder="NY"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP Code</label>
                    <input
                      className="form-input"
                      value={profile.address.zip}
                      onChange={e => setProfile(p => ({ ...p, address: { ...p.address, zip: e.target.value } }))}
                      placeholder="10001"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input
                      className="form-input"
                      value={profile.address.country}
                      onChange={e => setProfile(p => ({ ...p, address: { ...p.address, country: e.target.value } }))}
                      placeholder="US"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {tab === 'password' && (
              <form onSubmit={handlePasswordChange} className="profile-form">
                <h3>Change Password</h3>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwords.current}
                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwords.newPass}
                    onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                    required
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={passwords.confirm}
                    onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                    required
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}