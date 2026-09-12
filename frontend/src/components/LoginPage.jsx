import React, { useState } from 'react';
import { 
  Phone, 
  KeyRound, 
  Mic, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Building2, 
  Award, 
  CheckCircle2, 
  Loader2, 
  Languages, 
  ChevronRight, 
  LogIn, 
  UserPlus,
  Compass,
  FileText
} from 'lucide-react';
import VoiceInput from './VoiceInput';
import mainLogo from '../assets/2-logo.png';
import pmajayLogo from '../assets/PM-AJAY.png';
import { DEMO_PERSONAS } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage({ onLoginSuccess }) {
  const { selectedLang, setLanguage, t, currentLangObj, supportedLanguages } = useLanguage();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loginStep, setLoginStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male',
    disability: 'None',
    district: 'Varanasi, UP',
    education_level: '10th Grade',
    primary_skill: 'Tailoring & Garments',
    field_of_interest: 'Industrial Sewing & Quality Inspection',
    preference: 'Wage Employment (Job)',
    description: 'I want to learn industrial lockstitch machines and get a salaried placement.'
  });

  const updateRegForm = (key, value) => {
    setRegForm(prev => ({ ...prev, [key]: value }));
  };

  // --- Handlers for Login ---
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone || phone.length < 10) {
      setError(
        selectedLang === 'hi' 
          ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें'
          : selectedLang === 'bn'
          ? 'অনুগ্রহ করে একটি বৈধ ১০ সংখ্যার মোবাইল নম্বর লিখুন'
          : 'Please enter a valid 10-digit phone number'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setLoginStep('OTP');
        setOtp('1234');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      // Fallback for mock demo
      setLoginStep('OTP');
      setOtp('1234');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) {
      setError(
        selectedLang === 'hi'
          ? 'कृपया 4 अंकों का ओटीपी दर्ज करें'
          : selectedLang === 'bn'
          ? 'অনুগ্রহ করে ৪ সংখ্যার ওটিপি লিখুন'
          : 'Please enter 4-digit OTP'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (data.status === 'success') {
        completeLogin(phone);
      } else {
        setError(data.message || 'Invalid OTP. Try 1234.');
      }
    } catch (err) {
      if (otp === '1234' || otp.length === 4) {
        completeLogin(phone);
      } else {
        setError('Invalid OTP. Please enter 1234.');
      }
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (verifiedPhone) => {
    const matched = DEMO_PERSONAS.find(p => p.phone === verifiedPhone) || DEMO_PERSONAS[0];
    onLoginSuccess({
      ...matched.profile,
      name: matched.name,
      phone: verifiedPhone || matched.phone
    });
  };

  // --- Handlers for Registration ---
  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!regForm.name || !regForm.phone) {
      setError(
        selectedLang === 'hi'
          ? 'कृपया अपना नाम और मोबाइल नंबर दर्ज करें'
          : selectedLang === 'bn'
          ? 'অনুগ্রহ করে আপনার নাম এবং মোবাইল নম্বর লিখুন'
          : 'Please enter your name and phone number'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (data.status === 'success' || res.ok) {
        onLoginSuccess({
          name: regForm.name,
          phone: regForm.phone,
          district: regForm.district,
          education_level: regForm.education_level,
          traditional_trade: regForm.primary_skill,
          current_livelihood: regForm.primary_skill,
          mobility_km: 10,
          preference: regForm.preference,
          interests: regForm.field_of_interest
        });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      onLoginSuccess({
        name: regForm.name,
        phone: regForm.phone,
        district: regForm.district,
        education_level: regForm.education_level,
        traditional_trade: regForm.primary_skill,
        current_livelihood: regForm.primary_skill,
        mobility_km: 10,
        preference: regForm.preference,
        interests: regForm.field_of_interest
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (persona) => {
    onLoginSuccess({
      ...persona.profile,
      name: persona.name,
      phone: persona.phone
    });
  };

  const handleFillRaviSample = () => {
    setRegForm({
      name: 'Ravi Kumar',
      phone: '9876543210',
      age: '26',
      gender: 'Male',
      disability: 'None',
      district: 'Varanasi, UP',
      education_level: '10th Grade',
      primary_skill: 'Tailoring & Garments',
      field_of_interest: 'Industrial Sewing & Quality Inspection',
      preference: 'Wage Employment (Job)',
      description: 'I want to learn modern computerized lockstitch machines and get a salaried placement.'
    });
  };

  return (
    <div className="min-h-screen bg-[#f2f5f3] flex flex-col font-sans text-slate-800 selection:bg-orange-500 selection:text-white">
      {/* Top Tricolor Accent Line */}
      <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 w-full shrink-0" />

      {/* Top Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
            <img src={mainLogo} alt="Ajay Saathi" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                Ajay Saathi
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-200">
                PM-AJAY
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              {t('ministry', 'Ministry of Social Justice & Empowerment, Govt. of India')}
            </p>
          </div>
        </div>

        {/* Right Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-xs cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-700" />
            <span>{currentLangObj.name.split(' ')[0]}</span>
            <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded">
              {currentLangObj.short}
            </span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 max-h-60 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 tracking-wider">
                {selectedLang === 'hi' ? 'भाषा चुनें' : selectedLang === 'bn' ? 'ভাষা নির্বাচন করুন' : 'Select Language'}
              </div>
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition text-xs flex items-center justify-between cursor-pointer ${
                    selectedLang === lang.code 
                      ? 'bg-emerald-50 text-emerald-800 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {lang.short}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          {/* Subtle Banner Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white relative overflow-hidden">
            <div className="flex items-center space-x-3.5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {t('loginPortalTitle', 'Beneficiary Authentication Gate')}
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  {t('loginPortalSub', 'Sign in or create your voice profile to access NSQF training and monthly stipends.')}
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
            <button
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'login'
                  ? 'border-emerald-600 text-emerald-950 bg-white rounded-t-xl shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4 text-emerald-700" />
              <span>{t('loginTab', 'Login with Mobile OTP')}</span>
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(''); }}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-orange-500 text-orange-950 bg-white rounded-t-xl shadow-xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4 text-orange-600" />
              <span>{t('signupTab', 'Sign Up & Voice Profile')}</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-shake">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FLOW */}
            {activeTab === 'login' && (
              <div className="space-y-5">
                {loginStep === 'PHONE' ? (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <VoiceInput
                      label={t('phoneLabel', 'Mobile Number')}
                      fieldName="phone"
                      value={phone}
                      onChangeText={setPhone}
                      placeholder={t('phonePlaceholder', 'Enter 10-digit mobile number')}
                    />

                    <p className="text-[11px] text-slate-500">
                      {t('phoneHelp', 'We will verify your identity via SMS OTP linked with the PM-AJAY national registry.')}
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>{t('getOtp', 'Get OTP')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-600">Verification code sent to: </span>
                        <span className="font-extrabold text-emerald-950">+91 {phone}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLoginStep('PHONE')}
                        className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    <VoiceInput
                      label={t('otpLabel', 'Enter 4-Digit OTP')}
                      fieldName="otp"
                      value={otp}
                      onChangeText={setOtp}
                      placeholder={t('otpPlaceholder', 'Enter 4-digit code')}
                    />

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{t('didntReceive', "Didn't receive code?")}</span>
                      <button
                        type="button"
                        onClick={() => setOtp('1234')}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        {t('autoFillOtp', 'Auto-Fill Demo Code (1234)')}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>{t('verifyOtp', 'Verify & Access Dashboard')}</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* 1-Click Fast Judge / Persona Login */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      ⚡ {t('quickDemo', 'Quick 1-Click Demo Profiles')}
                    </span>
                    <span className="text-[10px] text-orange-700 font-bold">
                      {t('directAccess', 'Direct Access')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_PERSONAS.map((persona) => (
                      <button
                        key={persona.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(persona)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60 transition text-left cursor-pointer group flex items-center space-x-2"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-200 text-slate-700 group-hover:text-emerald-900 flex items-center justify-center text-xs font-bold shrink-0">
                          {persona.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-950">
                            {persona.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {persona.profile.traditional_trade} • {persona.district.split(',')[0]}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTRATION / SIGN UP FLOW */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-start justify-between">
                  <div>
                    <strong className="block text-orange-900 font-bold">
                      {t('voiceAssistedReg', 'Voice-Assisted Registration')}
                    </strong>
                    <span>
                      {t('voiceAssistedSub', 'Use the microphone icon next to each field to speak your details in your language.')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillRaviSample}
                    className="px-2.5 py-1 bg-white border border-orange-300 rounded-lg text-orange-800 text-[10px] font-extrabold shadow-2xs hover:bg-orange-100 cursor-pointer shrink-0 ml-2"
                  >
                    ⚡ {t('autoFillRavi', "Auto-Fill Ravi's Data")}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <VoiceInput
                    label={t('fullName', 'Full Name')}
                    fieldName="name"
                    value={regForm.name}
                    onChangeText={(val) => updateRegForm('name', val)}
                    placeholder={t('fullNamePlaceholder', 'e.g. Ravi Kumar')}
                  />

                  <VoiceInput
                    label={t('phoneLabel', 'Mobile Number')}
                    fieldName="phone"
                    value={regForm.phone}
                    onChangeText={(val) => updateRegForm('phone', val)}
                    placeholder={t('phonePlaceholder', 'Enter 10-digit mobile number')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <VoiceInput
                    label={t('age', 'Age')}
                    fieldName="age"
                    value={regForm.age}
                    onChangeText={(val) => updateRegForm('age', val)}
                    placeholder="26"
                  />

                  <VoiceInput
                    label={t('district', 'District and State')}
                    fieldName="district"
                    value={regForm.district}
                    onChangeText={(val) => updateRegForm('district', val)}
                    placeholder={t('districtPlaceholder', 'e.g. Varanasi, UP')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <VoiceInput
                    label={t('primarySkill', 'Primary Skill or Craft')}
                    fieldName="primary_skill"
                    value={regForm.primary_skill}
                    onChangeText={(val) => updateRegForm('primary_skill', val)}
                    placeholder={t('primarySkillPlaceholder', 'e.g. Tailoring / Solar / Farming')}
                  />

                  <VoiceInput
                    label={t('fieldOfInterest', 'Field of Interest')}
                    fieldName="field_of_interest"
                    value={regForm.field_of_interest}
                    onChangeText={(val) => updateRegForm('field_of_interest', val)}
                    placeholder={t('fieldOfInterestPlaceholder', 'e.g. Quality Inspection / Solar PV')}
                  />
                </div>

                <VoiceInput
                  label={t('description', 'Description and Goals')}
                  fieldName="description"
                  value={regForm.description}
                  onChangeText={(val) => updateRegForm('description', val)}
                  placeholder={t('descriptionPlaceholder', 'Describe what you want to achieve or learn...')}
                  multiline={true}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('completeReg', 'Complete Registration & Launch Dashboard')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white">
        PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) • {t('schemeServices', 'Scheme Services')}
      </footer>
    </div>
  );
}
