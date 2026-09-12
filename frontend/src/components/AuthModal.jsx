import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  KeyRound, 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  MapPin, 
  BookOpen, 
  Briefcase, 
  Loader2,
  X,
  Languages
} from 'lucide-react';
import mainLogo from '../assets/2-logo.png';
import pmajayLogo from '../assets/PM-AJAY.png';
import { DEMO_PERSONAS, SUPPORTED_LANGUAGES } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  selectedLang: propLang, 
  onSelectLang 
}) {
  const { selectedLang: contextLang, setLanguage, t } = useLanguage();
  const selectedLang = propLang || contextLang;
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'voice_register'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Voice Registration State
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceStep, setVoiceStep] = useState(1);
  const [voiceProfile, setVoiceProfile] = useState({
    name: '',
    phone: '',
    district: '',
    education_level: '10th Grade',
    traditional_trade: 'Tailoring',
    preference: 'Wage Employment (Job)'
  });

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    let timer;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        parseVoiceInput(text);
      };

      rec.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const parseVoiceInput = (text) => {
    const lower = text.toLowerCase();
    setVoiceProfile(prev => {
      const updated = { ...prev };
      
      // Phone number extraction
      const phoneMatch = text.match(/\d{10}/);
      if (phoneMatch) updated.phone = phoneMatch[0];

      // Name extraction heuristic
      if (text.includes('नाम') || text.includes('name')) {
        const parts = text.split(/(?:नाम|name is|name)/i);
        if (parts[1]) {
          const rawName = parts[1].trim().split(/\s+/).slice(0, 2).join(' ').replace(/[,.]/g, '');
          if (rawName) updated.name = rawName;
        }
      } else if (!updated.name && text.trim().split(/\s+/).length <= 3) {
        updated.name = text.trim();
      }

      // District / City
      if (lower.includes('varanasi') || text.includes('वाराणसी') || text.includes('बनारस')) updated.district = 'Varanasi, UP';
      else if (lower.includes('ranchi') || text.includes('राँची') || text.includes('रांची')) updated.district = 'Ranchi, Jharkhand';
      else if (lower.includes('patna') || text.includes('पटना')) updated.district = 'Patna, Bihar';
      else if (lower.includes('bhopal') || text.includes('भोपाल')) updated.district = 'Bhopal, MP';
      else if (lower.includes('delhi') || text.includes('दिल्ली')) updated.district = 'Delhi NCR';

      // Trade
      if (lower.includes('tailor') || text.includes('सिलाई') || text.includes('कपड़ा')) updated.traditional_trade = 'Tailoring & Garments';
      else if (lower.includes('solar') || text.includes('सोलर') || lower.includes('electric') || text.includes('बिजली')) updated.traditional_trade = 'Solar & Electrical';
      else if (lower.includes('beauty') || text.includes('पार्लर') || text.includes('मेकअप')) updated.traditional_trade = 'Beauty & Wellness';
      else if (lower.includes('farm') || text.includes('किसान') || text.includes('खेती')) updated.traditional_trade = 'Organic Farming';
      else if (lower.includes('ev') || text.includes('गाड़ी') || text.includes('गाडी') || text.includes('motor')) updated.traditional_trade = 'Electric Vehicle (EV)';

      // Education
      if (lower.includes('10th') || text.includes('10वीं') || text.includes('दसवीं')) updated.education_level = '10th Grade';
      else if (lower.includes('12th') || text.includes('12वीं') || text.includes('बारहवीं')) updated.education_level = '12th Pass';
      else if (lower.includes('8th') || text.includes('8वीं') || text.includes('आठवीं')) updated.education_level = '8th Pass';
      else if (lower.includes('5th') || text.includes('5वीं') || text.includes('पांचवीं')) updated.education_level = '5th Pass';
      else if (lower.includes('graduate') || text.includes('स्नातक')) updated.education_level = 'Graduate';

      // Preference
      if (lower.includes('self') || text.includes('स्वरोजगार') || text.includes('दुकान') || text.includes('व्यापार')) {
        updated.preference = 'Self-Employment (Micro-enterprise)';
      } else {
        updated.preference = 'Wage Employment (Job)';
      }

      return updated;
    });
  };

  const startVoiceRecording = () => {
    setError('');
    setTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        speakText(selectedLang === 'hi' 
          ? 'नमस्ते! अपना नाम, मोबाइल नंबर, और जिला बोलें।' 
          : 'Hello! Please speak your Name, Mobile number, and District.'
        );
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    } else {
      // Fallback for browsers without speech recognition
      setIsRecording(true);
      setTimeout(() => {
        setTranscript("मेरा नाम रवि कुमार है, मोबाइल 9876543210, वाराणसी, 10वीं पास, सिलाई का काम करता हूँ।");
        parseVoiceInput("मेरा नाम रवि कुमार है, मोबाइल 9876543210, वाराणसी, 10वीं पास, सिलाई का काम करता हूँ।");
        setIsRecording(false);
      }, 2500);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError(t('phoneInvalid', 'Please enter a valid 10-digit mobile number'));
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setOtpTimer(30);
      setOtp(['1', '2', '3', '4']); // Auto-fill for hackathon ease
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setError(t('otpInvalid', 'Please enter a valid 4-digit OTP'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Find matching demo persona or fallback to Ravi
      const matched = DEMO_PERSONAS.find(p => p.phone === phone) || DEMO_PERSONAS[0];
      onLoginSuccess({
        ...matched.profile,
        name: matched.name || 'Ravi Kumar',
        phone: phone || matched.phone
      });
      if (onClose) onClose();
    }, 600);
  };

  const handleVoiceRegisterSubmit = (e) => {
    e.preventDefault();
    if (!voiceProfile.name) {
      setError(t('voiceProvideName', 'Please provide your name'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: voiceProfile.name || 'Ravi Kumar',
        phone: voiceProfile.phone || '9876543210',
        district: voiceProfile.district || 'Varanasi, UP',
        education_level: voiceProfile.education_level || '10th Grade',
        traditional_trade: voiceProfile.traditional_trade || 'Tailoring & Garments',
        current_livelihood: 'Local Garment Shop Helper',
        mobility_km: 10,
        preference: voiceProfile.preference || 'Wage Employment (Job)',
        interests: voiceProfile.traditional_trade
      });
      if (onClose) onClose();
    }, 700);
  };

  const handleSelectQuickPersona = (persona) => {
    setPhone(persona.phone);
    setOtp(['1', '2', '3', '4']);
    setOtpSent(true);
    onLoginSuccess({
      ...persona.profile,
      name: persona.name,
      phone: persona.phone
    });
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Flag top border accent */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 w-full shrink-0" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between bg-[#fafcfa]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shadow-xs">
              <img src={mainLogo} alt="Ajay Saathi" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  PM-AJAY Portal Login
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Beneficiary Access
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Pradhan Mantri Anusuchit Jaati Abhyuday Yojana
              </p>
            </div>
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tabs: Standard OTP Login vs Voice Registration */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => { setAuthMode('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition flex items-center justify-center space-x-2 cursor-pointer ${
              authMode === 'login'
                ? 'border-emerald-600 text-emerald-950 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile + OTP Login</span>
          </button>
          <button
            onClick={() => { setAuthMode('voice_register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition flex items-center justify-center space-x-2 cursor-pointer ${
              authMode === 'voice_register'
                ? 'border-orange-500 text-orange-950 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
            <span className="text-orange-900 font-extrabold">🎙️ {t('voiceRegistration', 'Voice Registration')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-shake">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: OTP LOGIN */}
          {authMode === 'login' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1.5">
                      Mobile Number / मोबाइल नंबर
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        +91
                      </div>
                      <input
                        type="tel"
                        maxLength="10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210 (e.g. Ravi Kumar)"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 focus:bg-white border border-slate-300 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      A 4-digit verification code will be sent via SMS to verify your Aadhaar linked number.
                    </p>
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
                        <span>Send Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-600">OTP sent to: </span>
                      <span className="font-extrabold text-emerald-950">+91 {phone}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-700 mb-2 text-center">
                      Enter 4-Digit OTP (Demo: 1234)
                    </label>
                    <div className="flex justify-center space-x-3">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value;
                            const nextOtp = [...otp];
                            nextOtp[idx] = val;
                            setOtp(nextOtp);
                            if (val && idx < 3) {
                              document.getElementById(`otp-${idx + 1}`)?.focus();
                            }
                          }}
                          className="w-12 h-14 text-center text-xl font-extrabold bg-slate-50 focus:bg-white border-2 border-slate-300 focus:border-emerald-600 rounded-2xl focus:outline-none transition shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Didn't receive code?</span>
                    {otpTimer > 0 ? (
                      <span className="font-bold text-slate-700">Resend in {otpTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setOtpTimer(30); }}
                        className="font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Resend OTP Now
                      </button>
                    )}
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
                        <span>Verify & Open Dashboard</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Hackathon Quick-Login Demo Personas */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ⚡ Quick Demo Profiles (1-Click Login)
                  </span>
                  <span className="text-[10px] text-orange-700 font-bold">Hackathon Mode</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_PERSONAS.map((persona) => (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleSelectQuickPersona(persona)}
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

          {/* MODE 2: VOICE REGISTRATION (FOR LOW LITERACY BENEFICIARIES) */}
          {authMode === 'voice_register' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-orange-900">
                    {t('voiceRegistration', 'Voice Registration')}
                  </div>
                  <p className="text-orange-800/90 mt-0.5">
                    Specially designed for rural and low-literacy artisans. Just tap the microphone and speak your details in Hindi or your local dialect.
                  </p>
                </div>
              </div>

              {/* Voice Interaction Box */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
                {/* Visual pulse background */}
                {isRecording && (
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
                )}

                <p className="text-xs text-slate-300 mb-3 font-medium">
                  {isRecording 
                    ? `🔴 ${t('listening', 'Listening... Speak clearly')}` 
                    : t('tapToSpeak', 'Tap microphone to speak your details')
                  }
                </p>

                <div className="relative">
                  <button
                    type="button"
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                      isRecording
                        ? 'bg-red-600 text-white scale-110 ring-8 ring-red-500/30 animate-pulse'
                        : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white hover:scale-105 ring-4 ring-orange-400/20'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => speakText("नमस्ते! अपना नाम, मोबाइल नंबर, जिला और हुनर बोलें।")}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-slate-200 font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                    <span>{t('listenInstructions', 'Listen Instructions')}</span>
                  </button>
                </div>

                {transcript && (
                  <div className="mt-4 p-3 bg-white/10 rounded-2xl text-xs text-amber-200 border border-white/10 max-w-md w-full">
                    <span className="font-bold text-white block mb-0.5">Heard:</span>
                    "{transcript}"
                  </div>
                )}
              </div>

              {/* Live Form Auto-Parsed from Speech */}
              <form onSubmit={handleVoiceRegisterSubmit} className="space-y-3 bg-[#f8faf9] p-4 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Live Voice Captured Profile
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name / नाम</label>
                    <input
                      type="text"
                      value={voiceProfile.name}
                      onChange={(e) => setVoiceProfile({ ...voiceProfile, name: e.target.value })}
                      placeholder="e.g. Ravi Kumar"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile / फोन</label>
                    <input
                      type="tel"
                      value={voiceProfile.phone}
                      onChange={(e) => setVoiceProfile({ ...voiceProfile, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">District / जिला</label>
                    <input
                      type="text"
                      value={voiceProfile.district}
                      onChange={(e) => setVoiceProfile({ ...voiceProfile, district: e.target.value })}
                      placeholder="e.g. Varanasi, UP"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Trade / हुनर</label>
                    <input
                      type="text"
                      value={voiceProfile.traditional_trade}
                      onChange={(e) => setVoiceProfile({ ...voiceProfile, traditional_trade: e.target.value })}
                      placeholder="e.g. Tailoring / Solar"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* One-click mock voice input filler */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const demoStr = "मेरा नाम रवि कुमार है, मोबाइल 9876543210, वाराणसी, 10वीं पास, सिलाई का काम करता हूँ।";
                      setTranscript(demoStr);
                      parseVoiceInput(demoStr);
                    }}
                    className="text-[11px] text-orange-700 hover:text-orange-900 font-bold underline cursor-pointer"
                  >
                    ⚡ Auto-Fill Ravi's Voice Sample
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Confirm & Enter Portal</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
