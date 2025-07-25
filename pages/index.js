import React, { useState, useEffect } from 'react';
import { Phone, User, MapPin, AlertTriangle, Heart, School, Edit3, QrCode, Save, Plus, Trash2, Eye, Loader } from 'lucide-react';

// Supabase configuration
const SUPABASE_URL = 'https://hztyncmvfboiqaskzkgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dHluY212ZmJvaXFhc2t6a2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjEzNzQsImV4cCI6MjA2OTAzNzM3NH0.qFLB6Uyttct-v5aYIs59kcu6Tpy9I9eKRh0J_ISuqdQ';

// Simple Supabase client
class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  async query(table, method = 'GET', data = null) {
    const url = `${this.url}/rest/v1/${table}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.key,
        'Authorization': `Bearer ${this.key}`,
        'Prefer': method === 'POST' ? 'return=representation' : ''
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async insert(table, data) {
    return this.query(table, 'POST', data);
  }

  async select(table) {
    return this.query(table, 'GET');
  }
}

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function SafeAndSnappyApp() {
  const [currentView, setCurrentView] = useState('login');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('demo@safesnappy.com');
  const [viewingProfile, setViewingProfile] = useState(null);

  // Load profiles from database
  const loadProfiles = async () => {
    try {
      setLoading(true);
      const data = await supabase.select('school_profiles');
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard') {
      loadProfiles();
    }
  }, [currentView]);

  const LoginPage = () => {
    const [email, setEmailInput] = useState('demo@safesnappy.com');

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Safe and Snappy</h1>
            <p className="text-gray-600">School Emergency Profiles</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={() => {
                setUserEmail(email);
                setCurrentView('dashboard');
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Connected to Supabase database
          </p>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QrCode className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Safe and Snappy</h1>
                <p className="text-sm text-gray-500">School Emergency Profiles</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('login')}
              className="text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your School Profiles</h2>
          <button
            onClick={() => setCurrentView('create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create School Profile</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading profiles...</span>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No school profiles yet</h3>
            <p className="text-gray-500 mb-4">Create your first school emergency profile to get started.</p>
            <button
              onClick={() => setCurrentView('create')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Create Your First Profile
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <School className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-500">School Profile</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-gray-800 mb-2">{profile.school_name}</h3>
                <p className="text-sm text-gray-600 mb-2">{profile.school_address}</p>
                <p className="text-sm text-gray-500 mb-4">QR: {profile.qr_code}</p>
                <p className="text-xs text-gray-400 mb-4">
                  Created: {new Date(profile.created_at).toLocaleDateString()}
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setViewingProfile(profile);
                      setCurrentView('preview');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded text-sm flex items-center justify-center space-x-1 transition-colors">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const CreateProfile = () => {
    const [formData, setFormData] = useState({
      school_name: '',
      school_address: '',
      teacher_name: '',
      teacher_phone: '',
      school_phone: '',
      emergency_instructions: ''
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
      try {
        setSaving(true);
        
        const profileData = {
          ...formData,
          user_email: userEmail,
          qr_code: `SNS-SC-${Math.floor(Math.random() * 9999)}`,
          created_at: new Date().toISOString()
        };

        await supabase.insert('school_profiles', profileData);
        
        // Refresh profiles and go back to dashboard
        await loadProfiles();
        setCurrentView('dashboard');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-gray-800">Create School Emergency Profile</h1>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">School Information</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="School Name"
                  value={formData.school_name}
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="School Address"
                  value={formData.school_address}
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => setFormData({...formData, school_address: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Lead Teacher Name"
                  value={formData.teacher_name}
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-lg mb-4">Contact Information</h3>
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="Teacher Mobile Number"
                  value={formData.teacher_phone}
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => setFormData({...formData, teacher_phone: e.target.value})}
                />
                <input
                  type="tel"
                  placeholder="School Office Number"
                  value={formData.school_phone}
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => setFormData({...formData, school_phone: e.target.value})}
                />
                <textarea
                  placeholder="Emergency Instructions"
                  value={formData.emergency_instructions}
                  className="w-full p-3 border rounded-lg"
                  rows="3"
                  onChange={(e) => setFormData({...formData, emergency_instructions: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EmergencyPreview = () => {
    if (!viewingProfile) return null;

    return (
      <div className="min-h-screen bg-red-50">
        <div className="bg-red-600 text-white p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <h1 className="text-xl font-bold">SCHOOL EMERGENCY INFORMATION</h1>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded text-sm transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
            <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
              <School className="w-5 h-5 text-blue-600 mr-2" />
              School Emergency Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-700">School:</p>
                <p className="text-gray-600">{viewingProfile.school_name}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Address:</p>
                <p className="text-gray-600">{viewingProfile.school_address}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Teacher:</p>
                <p className="text-gray-600">{viewingProfile.teacher_name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
              <Phone className="w-5 h-5 text-green-600 mr-2" />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 p-4 rounded">
                <p className="font-semibold text-green-800">Teacher Mobile</p>
                <p className="text-green-700 text-lg font-mono">{viewingProfile.teacher_phone}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="font-semibold text-green-800">School Office</p>
                <p className="text-green-700 text-lg font-mono">{viewingProfile.school_phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-800 mb-3">Special Instructions:</h3>
            <p className="text-yellow-700">{viewingProfile.emergency_instructions}</p>
          </div>

          <div className="text-center text-gray-500 text-sm mt-8">
            <p>QR Code: {viewingProfile.qr_code}</p>
            <p>Safe and Snappy Emergency System</p>
          </div>
        </div>
      </div>
    );
  };

  // Render current view
  switch (currentView) {
    case 'login':
      return <LoginPage />;
    case 'dashboard':
      return <Dashboard />;
    case 'create':
      return <CreateProfile />;
    case 'preview':
      return <EmergencyPreview />;
    default:
      return <LoginPage />;
  }
}