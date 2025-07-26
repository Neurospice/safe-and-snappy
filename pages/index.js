import React, { useState, useEffect } from 'react';
import { Phone, User, MapPin, AlertTriangle, Heart, School, Edit3, QrCode, Save, Plus, Trash2, Eye, Loader, CheckCircle, ArrowRight, Camera, Upload } from 'lucide-react';

// Supabase configuration
const SUPABASE_URL = 'https://hztyncmvfboiqaskzkgz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dHluY212ZmJvaXFhc2t6a2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjEzNzQsImV4cCI6MjA2OTAzNzM3NH0.qFLB6Uyttct-v5aYIs59kcu6Tpy9I9eKRh0J_ISuqdQ';

// Brand configuration - Easy to customize
const BRAND_CONFIG = {
  name: "Safe and Snappy",
  tagline: "Emergency Information When Every Second Counts",
  logo: null, // Can be replaced with actual logo URL
  colors: {
    primary: "#2563eb",      // Blue
    primaryHover: "#1d4ed8",
    secondary: "#f8fafc",    // Light gray
    accent: "#10b981",       // Green
    warning: "#f59e0b",      // Amber
    danger: "#dc2626",       // Red
    text: "#111827",         // Dark gray
    textLight: "#6b7280"     // Medium gray
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif"
  }
};

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

  async select(table, filter = null) {
    return this.query(table, 'GET');
  }
}

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function SafeAndSnappyApp() {
  const [currentView, setCurrentView] = useState('register');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [qrCode, setQrCode] = useState('');

  // Check URL for QR code parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const qrParam = urlParams.get('qr');
    if (qrParam) {
      setQrCode(qrParam);
      setCurrentView('register');
    }
  }, []);

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

  // Branded Logo Component
  const BrandLogo = ({ size = "large" }) => {
    const sizeClasses = {
      small: "w-8 h-8",
      medium: "w-12 h-12", 
      large: "w-16 h-16"
    };
    
    return (
      <div 
        className={`${sizeClasses[size]} rounded-xl flex items-center justify-center text-white font-bold text-xl`}
        style={{ backgroundColor: BRAND_CONFIG.colors.primary }}
      >
        {BRAND_CONFIG.logo ? (
          <img src={BRAND_CONFIG.logo} alt={BRAND_CONFIG.name} className="w-full h-full object-contain" />
        ) : (
          <QrCode className={size === 'large' ? 'w-8 h-8' : size === 'medium' ? 'w-6 h-6' : 'w-4 h-4'} />
        )}
      </div>
    );
  };

  // QR Scanner Component
  const QRScanner = ({ onCodeScanned, onClose }) => {
    const [manualEntry, setManualEntry] = useState(false);
    const [manualCode, setManualCode] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <div className="text-center mb-6">
            <Camera className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND_CONFIG.colors.primary }} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Scan Your QR Code</h3>
            <p className="text-gray-600 text-sm">Point your camera at the QR code on your Safe and Snappy product</p>
          </div>

          {!manualEntry ? (
            <div className="space-y-4">
              <div 
                className="border-2 border-dashed rounded-lg p-8 text-center"
                style={{ borderColor: BRAND_CONFIG.colors.primary }}
              >
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 text-sm">Camera scanning would be implemented here</p>
                <p className="text-xs text-gray-400 mt-2">For demo: Use manual entry below</p>
              </div>
              
              <button
                onClick={() => setManualEntry(true)}
                className="w-full text-center py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                style={{ borderColor: BRAND_CONFIG.colors.primary, color: BRAND_CONFIG.colors.primary }}
              >
                Enter code manually instead
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter QR code (e.g., SNS-SC-1234)"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                autoFocus
              />
              <button
                onClick={() => {
                  if (manualCode.trim()) {
                    onCodeScanned(manualCode.trim());
                  }
                }}
                disabled={!manualCode.trim()}
                className="w-full py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                style={{ 
                  backgroundColor: BRAND_CONFIG.colors.primary,
                  ':hover': { backgroundColor: BRAND_CONFIG.colors.primaryHover }
                }}
              >
                Continue
              </button>
              <button
                onClick={() => setManualEntry(false)}
                className="w-full text-center py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to scanning
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // Registration Page with improved design
  const RegistrationPage = () => {
    const [step, setStep] = useState(1);
    const [showScanner, setShowScanner] = useState(false);
    const [registrationData, setRegistrationData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      qrCode: qrCode || '',
      firstName: '',
      lastName: '',
      productType: 'school'
    });

    const handleSubmit = async () => {
      if (step === 3) {
        setUserEmail(registrationData.email);
        setCurrentView('setup');
      } else {
        setStep(step + 1);
      }
    };

    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(135deg, ${BRAND_CONFIG.colors.primary}15 0%, ${BRAND_CONFIG.colors.secondary} 100%)`
        }}
      >
        {showScanner && (
          <QRScanner
            onCodeScanned={(code) => {
              setRegistrationData({...registrationData, qrCode: code});
              setQrCode(code);
              setShowScanner(false);
            }}
            onClose={() => setShowScanner(false)}
          />
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <BrandLogo size="large" />
            <h1 
              className="text-2xl font-bold mt-4 mb-2"
              style={{ color: BRAND_CONFIG.colors.text, fontFamily: BRAND_CONFIG.fonts.heading }}
            >
              Welcome to {BRAND_CONFIG.name}
            </h1>
            <p style={{ color: BRAND_CONFIG.colors.textLight }}>
              Let's set up your emergency profile
            </p>
          </div>

          {/* Enhanced Progress indicator */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step >= stepNum 
                      ? 'text-white shadow-lg transform scale-110' 
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: step >= stepNum ? BRAND_CONFIG.colors.primary : undefined 
                  }}
                >
                  {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div 
                    className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                      step > stepNum ? '' : 'bg-gray-200'
                    }`}
                    style={{ 
                      backgroundColor: step > stepNum ? BRAND_CONFIG.colors.primary : undefined 
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h3 
                className="text-lg font-semibold text-center"
                style={{ color: BRAND_CONFIG.colors.text }}
              >
                Product Registration
              </h3>
              
              {!registrationData.qrCode ? (
                <div className="text-center space-y-4">
                  <button
                    onClick={() => setShowScanner(true)}
                    className="w-full p-4 border-2 border-dashed rounded-xl hover:bg-gray-50 transition-colors flex flex-col items-center space-y-3"
                    style={{ borderColor: BRAND_CONFIG.colors.primary }}
                  >
                    <QrCode 
                      className="w-12 h-12"
                      style={{ color: BRAND_CONFIG.colors.primary }}
                    />
                    <div>
                      <p 
                        className="font-medium"
                        style={{ color: BRAND_CONFIG.colors.primary }}
                      >
                        Scan QR Code
                      </p>
                      <p className="text-sm text-gray-500">
                        Point your camera at the QR code on your product
                      </p>
                    </div>
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">or</span>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Enter code manually (e.g., SNS-SC-1234)"
                    value={registrationData.qrCode}
                    onChange={(e) => setRegistrationData({...registrationData, qrCode: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                  />
                </div>
              ) : (
                <div 
                  className="p-4 rounded-lg border text-center"
                  style={{ 
                    backgroundColor: `${BRAND_CONFIG.colors.accent}15`,
                    borderColor: BRAND_CONFIG.colors.accent 
                  }}
                >
                  <CheckCircle 
                    className="w-8 h-8 mx-auto mb-2"
                    style={{ color: BRAND_CONFIG.colors.accent }}
                  />
                  <p className="font-medium" style={{ color: BRAND_CONFIG.colors.accent }}>
                    Product Registered
                  </p>
                  <p className="text-sm text-gray-600">Code: {registrationData.qrCode}</p>
                  <button
                    onClick={() => setRegistrationData({...registrationData, qrCode: ''})}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-2"
                  >
                    Change code
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 
                className="text-lg font-semibold text-center"
                style={{ color: BRAND_CONFIG.colors.text }}
              >
                Create Your Account
              </h3>
              <input
                type="email"
                placeholder="Email address"
                value={registrationData.email}
                onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
              />
              <input
                type="password"
                placeholder="Password"
                value={registrationData.password}
                onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={registrationData.confirmPassword}
                onChange={(e) => setRegistrationData({...registrationData, confirmPassword: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 
                className="text-lg font-semibold text-center"
                style={{ color: BRAND_CONFIG.colors.text }}
              >
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={registrationData.firstName}
                  onChange={(e) => setRegistrationData({...registrationData, firstName: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={registrationData.lastName}
                  onChange={(e) => setRegistrationData({...registrationData, lastName: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-medium" style={{ color: BRAND_CONFIG.colors.text }}>
                  What type of profile do you need?
                </p>
                <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="profileType"
                    value="school"
                    checked={registrationData.productType === 'school'}
                    onChange={(e) => setRegistrationData({...registrationData, productType: e.target.value})}
                    style={{ accentColor: BRAND_CONFIG.colors.primary }}
                  />
                  <School 
                    className="w-6 h-6"
                    style={{ color: BRAND_CONFIG.colors.primary }}
                  />
                  <div>
                    <p className="font-medium" style={{ color: BRAND_CONFIG.colors.text }}>
                      School/Group Profile
                    </p>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.colors.textLight }}>
                      For school trips and group activities
                    </p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="profileType"
                    value="medical"
                    checked={registrationData.productType === 'medical'}
                    onChange={(e) => setRegistrationData({...registrationData, productType: e.target.value})}
                    style={{ accentColor: BRAND_CONFIG.colors.primary }}
                  />
                  <Heart 
                    className="w-6 h-6"
                    style={{ color: BRAND_CONFIG.colors.danger }}
                  />
                  <div>
                    <p className="font-medium" style={{ color: BRAND_CONFIG.colors.text }}>
                      Personal Medical Profile
                    </p>
                    <p className="text-sm" style={{ color: BRAND_CONFIG.colors.textLight }}>
                      For individuals with medical needs
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          <div className="flex space-x-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3 border-2 rounded-xl font-medium transition-colors hover:bg-gray-50"
                style={{ 
                  borderColor: BRAND_CONFIG.colors.primary,
                  color: BRAND_CONFIG.colors.primary
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={step === 1 && !registrationData.qrCode}
              className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
              style={{ 
                backgroundColor: BRAND_CONFIG.colors.primary,
                ':hover': { backgroundColor: BRAND_CONFIG.colors.primaryHover }
              }}
            >
              <span>{step === 3 ? 'Complete Registration' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: BRAND_CONFIG.colors.textLight }}>
            Already have an account? 
            <button 
              onClick={() => setCurrentView('login')}
              className="ml-1 font-medium hover:underline"
              style={{ color: BRAND_CONFIG.colors.primary }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Profile Setup with enhanced design
  const SetupPage = () => {
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
          user_id: null,
          qr_code: qrCode || `SNS-SC-${Math.floor(Math.random() * 9999)}`,
          created_at: new Date().toISOString()
        };

        await supabase.insert('school_profiles', profileData);
        setCurrentView('success');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
      } finally {
        setSaving(false);
      }
    };

    return (
      <div style={{ backgroundColor: BRAND_CONFIG.colors.secondary }} className="min-h-screen">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-3">
              <BrandLogo size="medium" />
              <div className="text-center">
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: BRAND_CONFIG.colors.text, fontFamily: BRAND_CONFIG.fonts.heading }}
                >
                  Set Up Your Emergency Profile
                </h1>
                <p style={{ color: BRAND_CONFIG.colors.textLight }}>
                  This information will be displayed when someone scans your QR code in an emergency
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              <div className="p-6 rounded-xl" style={{ backgroundColor: `${BRAND_CONFIG.colors.primary}08` }}>
                <h3 
                  className="font-bold text-lg mb-6 flex items-center"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  <School 
                    className="w-6 h-6 mr-3"
                    style={{ color: BRAND_CONFIG.colors.primary }}
                  />
                  School Information
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="School Name"
                    value={formData.school_name}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                    onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="School Address"
                    value={formData.school_address}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                    onChange={(e) => setFormData({...formData, school_address: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Lead Teacher Name"
                    value={formData.teacher_name}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                    onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: `${BRAND_CONFIG.colors.accent}08` }}>
                <h3 
                  className="font-bold text-lg mb-6 flex items-center"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  <Phone 
                    className="w-6 h-6 mr-3"
                    style={{ color: BRAND_CONFIG.colors.accent }}
                  />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <input
                    type="tel"
                    placeholder="Teacher Mobile Number"
                    value={formData.teacher_phone}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                    onChange={(e) => setFormData({...formData, teacher_phone: e.target.value})}
                  />
                  <input
                    type="tel"
                    placeholder="School Office Number"
                    value={formData.school_phone}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                    onChange={(e) => setFormData({...formData, school_phone: e.target.value})}
                  />
                  <textarea
                    placeholder="Emergency Instructions"
                    value={formData.emergency_instructions}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                    style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
                    rows="4"
                    onChange={(e) => setFormData({...formData, emergency_instructions: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-4 rounded-xl text-white font-semibold transition-all disabled:opacity-50 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                style={{ 
                  backgroundColor: BRAND_CONFIG.colors.primary,
                  ':hover': { backgroundColor: BRAND_CONFIG.colors.primaryHover }
                }}
              >
                {saving ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{saving ? 'Setting Up Profile...' : 'Complete Setup'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Success Page
  const SuccessPage = () => (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        background: `linear-gradient(135deg, ${BRAND_CONFIG.colors.accent}15 0%, ${BRAND_CONFIG.colors.secondary} 100%)`
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div 
          className="rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg"
          style={{ backgroundColor: `${BRAND_CONFIG.colors.accent}15` }}
        >
          <CheckCircle 
            className="w-12 h-12"
            style={{ color: BRAND_CONFIG.colors.accent }}
          />
        </div>
        <h1 
          className="text-2xl font-bold mb-4"
          style={{ color: BRAND_CONFIG.colors.text, fontFamily: BRAND_CONFIG.fonts.heading }}
        >
          You're All Set!
        </h1>
        <p style={{ color: BRAND_CONFIG.colors.textLight }} className="mb-6">
          Your emergency profile has been created successfully. Your QR code is now active and ready to use.
        </p>
        <div 
          className="p-4 rounded-xl mb-6"
          style={{ backgroundColor: `${BRAND_CONFIG.colors.primary}08` }}
        >
          <p 
            className="text-sm font-medium"
            style={{ color: BRAND_CONFIG.colors.text }}
          >
            Your QR Code: {qrCode}
          </p>
          <p className="text-xs mt-1" style={{ color: BRAND_CONFIG.colors.textLight }}>
            Keep this safe - you can use it to manage your profile
          </p>
        </div>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="w-full py-4 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          style={{ 
            backgroundColor: BRAND_CONFIG.colors.primary,
            ':hover': { backgroundColor: BRAND_CONFIG.colors.primaryHover }
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  // Login Page with enhanced design
  const LoginPage = () => {
    const [email, setEmailInput] = useState('');

    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ 
          background: `linear-gradient(135deg, ${BRAND_CONFIG.colors.primary}15 0%, ${BRAND_CONFIG.colors.secondary} 100%)`
        }}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <BrandLogo size="large" />
            <h1 
              className="text-2xl font-bold mt-4 mb-2"
              style={{ color: BRAND_CONFIG.colors.text, fontFamily: BRAND_CONFIG.fonts.heading }}
            >
              Welcome Back
            </h1>
            <p style={{ color: BRAND_CONFIG.colors.textLight }}>
              Sign in to manage your emergency profiles
            </p>
          </div>
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
              style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
              style={{ focusRingColor: BRAND_CONFIG.colors.primary }}
            />
            <button
              onClick={() => {
                setUserEmail(email);
                setCurrentView('dashboard');
              }}
              className="w-full py-4 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ 
                backgroundColor: BRAND_CONFIG.colors.primary,
                ':hover': { backgroundColor: BRAND_CONFIG.colors.primaryHover }
              }}
            >
              Sign In
            </button>
          </div>
          
          <p className="text-center text-sm mt-6" style={{ color: BRAND_CONFIG.colors.textLight }}>
            New customer? 
            <button 
              onClick={() => setCurrentView('register')}
              className="ml-1 font-medium hover:underline"
              style={{ color: BRAND_CONFIG.colors.primary }}
            >
              Register your product
            </button>
          </p>
        </div>
      </div>
    );
  };

  // Dashboard - keeping existing functionality but with better styling
  const Dashboard = () => (
    <div style={{ backgroundColor: BRAND_CONFIG.colors.secondary }} className="min-h-screen">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrandLogo size="medium" />
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: BRAND_CONFIG.colors.text, fontFamily: BRAND_CONFIG.fonts.heading }}
                >
                  {BRAND_CONFIG.name}
                </h1>
                <p className="text-sm" style={{ color: BRAND_CONFIG.colors.textLight }}>
                  School Emergency Profiles
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentView('login')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 
            className="text-xl font-bold"
            style={{ color: BRAND_CONFIG.colors.text }}
          >
            Your Emergency Profiles
          </h2>
          <button
            onClick={() => setCurrentView('setup')}
            className="px-6 py-3 rounded-xl text-white font-medium transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ 
              backgroundColor: BRAND_CONFIG.colors.primary,
              ':hover': { backgroundColor: BRAND_CONFIG.colors.primaryHover }
            }}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Profile</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader 
              className="w-8 h-8 animate-spin mr-3"
              style={{ color: BRAND_CONFIG.colors.primary }}
            />
            <span style={{ color: BRAND_CONFIG.colors.textLight }}>Loading profiles...</span>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <School 
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: BRAND_CONFIG.colors.textLight }}
            />
            <h3 
              className="text-lg font-medium mb-2"
              style={{ color: BRAND_CONFIG.colors.text }}
            >
              No profiles yet
            </h3>
            <p style={{ color: BRAND_CONFIG.colors.textLight }} className="mb-4">
              Create your first emergency profile to get started.
            </p>
            <button
              onClick={() => setCurrentView('setup')}
              className="px-6 py-3 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{ 
                backgroundColor: BRAND_CONFIG.colors.primary,
                ':hover': { backgroundColor: BRAND_CONFIG.colors.primaryHover }
              }}
            >
              Create Your First Profile
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all transform hover:scale-105" style={{ borderLeftColor: BRAND_CONFIG.colors.primary }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <School 
                      className="w-5 h-5"
                      style={{ color: BRAND_CONFIG.colors.primary }}
                    />
                    <span 
                      className="text-sm font-medium"
                      style={{ color: BRAND_CONFIG.colors.textLight }}
                    >
                      School Profile
                    </span>
                  </div>
                </div>
                
                <h3 
                  className="font-bold text-lg mb-2"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  {profile.school_name}
                </h3>
                <p className="text-sm mb-2" style={{ color: BRAND_CONFIG.colors.textLight }}>
                  {profile.school_address}
                </p>
                <p className="text-sm mb-4" style={{ color: BRAND_CONFIG.colors.textLight }}>
                  QR: {profile.qr_code}
                </p>
                <p className="text-xs mb-4" style={{ color: BRAND_CONFIG.colors.textLight }}>
                  Created: {new Date(profile.created_at).toLocaleDateString()}
                </p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setViewingProfile(profile);
                      setCurrentView('preview');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                  <button 
                    className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors text-white"
                    style={{ backgroundColor: BRAND_CONFIG.colors.primary }}
                  >
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

  // Emergency Preview - what gets shown when QR code is scanned
  const EmergencyPreview = () => {
    if (!viewingProfile) return null;

    return (
      <div style={{ backgroundColor: `${BRAND_CONFIG.colors.danger}15` }} className="min-h-screen">
        <div 
          className="text-white p-4"
          style={{ backgroundColor: BRAND_CONFIG.colors.danger }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6" />
              <h1 className="text-xl font-bold">SCHOOL EMERGENCY INFORMATION</h1>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
              style={{ backgroundColor: `${BRAND_CONFIG.colors.danger}aa` }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderLeftColor: BRAND_CONFIG.colors.primary }}>
            <h2 
              className="font-bold text-lg mb-4 flex items-center"
              style={{ color: BRAND_CONFIG.colors.text }}
            >
              <School 
                className="w-5 h-5 mr-2"
                style={{ color: BRAND_CONFIG.colors.primary }}
              />
              School Emergency Information
            </h2>
            <div className="space-y-4">
              <div>
                <p 
                  className="font-semibold"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  School:
                </p>
                <p style={{ color: BRAND_CONFIG.colors.textLight }}>
                  {viewingProfile.school_name}
                </p>
              </div>
              <div>
                <p 
                  className="font-semibold"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  Address:
                </p>
                <p style={{ color: BRAND_CONFIG.colors.textLight }}>
                  {viewingProfile.school_address}
                </p>
              </div>
              <div>
                <p 
                  className="font-semibold"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  Teacher:
                </p>
                <p style={{ color: BRAND_CONFIG.colors.textLight }}>
                  {viewingProfile.teacher_name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4" style={{ borderLeftColor: BRAND_CONFIG.colors.accent }}>
            <h3 
              className="font-bold text-lg mb-4 flex items-center"
              style={{ color: BRAND_CONFIG.colors.text }}
            >
              <Phone 
                className="w-5 h-5 mr-2"
                style={{ color: BRAND_CONFIG.colors.accent }}
              />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${BRAND_CONFIG.colors.accent}15` }}
              >
                <p 
                  className="font-semibold"
                  style={{ color: BRAND_CONFIG.colors.accent }}
                >
                  Teacher Mobile
                </p>
                <p 
                  className="text-lg font-mono"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  {viewingProfile.teacher_phone}
                </p>
              </div>
              <div 
                className="p-4 rounded-xl"
                style={{ backgroundColor: `${BRAND_CONFIG.colors.accent}15` }}
              >
                <p 
                  className="font-semibold"
                  style={{ color: BRAND_CONFIG.colors.accent }}
                >
                  School Office
                </p>
                <p 
                  className="text-lg font-mono"
                  style={{ color: BRAND_CONFIG.colors.text }}
                >
                  {viewingProfile.school_phone}
                </p>
              </div>
            </div>
          </div>

          <div 
            className="border rounded-xl p-6"
            style={{ 
              backgroundColor: `${BRAND_CONFIG.colors.warning}15`,
              borderColor: BRAND_CONFIG.colors.warning
            }}
          >
            <h3 
              className="font-bold mb-3"
              style={{ color: BRAND_CONFIG.colors.warning }}
            >
              Special Instructions:
            </h3>
            <p style={{ color: BRAND_CONFIG.colors.text }}>
              {viewingProfile.emergency_instructions}
            </p>
          </div>

          <div className="text-center text-sm mt-8" style={{ color: BRAND_CONFIG.colors.textLight }}>
            <p>QR Code: {viewingProfile.qr_code}</p>
            <p>Powered by {BRAND_CONFIG.name}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render current view
  switch (currentView) {
    case 'register':
      return <RegistrationPage />;
    case 'login':
      return <LoginPage />;
    case 'setup':
      return <SetupPage />;
    case 'success':
      return <SuccessPage />;
    case 'dashboard':
      return <Dashboard />;
    case 'preview':
      return <EmergencyPreview />;
    default:
      return <RegistrationPage />;
  }
}