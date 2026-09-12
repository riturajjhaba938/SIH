import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AudioRecorder from './components/AudioRecorder';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import BeneficiaryReportModal from './components/BeneficiaryReportModal';
import Registration from './components/Registration';
import Login from './components/Login';
import { 
  Mic, 
  LayoutDashboard, 
  BookOpen, 
  Building2, 
  MapPin, 
  UserCheck, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import './index.css';
import { TranslationProvider, useTranslation } from './contexts/TranslationContext';

function MainApp({ selectedLang, onSelectLang }) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    name: 'New Beneficiary',
    district: '',
    education_level: '',
    traditional_trade: '',
    current_livelihood: '',
    mobility_km: 10,
    preference: ''
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (phone, isNewUser, dbProfile) => {
    if (dbProfile) {
      setProfile(prev => ({ ...prev, ...dbProfile }));
    }
    setIsAuthenticated(true);
    setActiveSection(isNewUser ? 'registration' : 'home');
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLoadPersona = (persona) => {
    setProfile({
      ...persona.profile,
      name: persona.name,
      district: persona.district
    });
  };

  const handleResetAll = () => {
    setProfile({
      name: 'New Beneficiary',
      district: 'District Hub',
      education_level: '',
      traditional_trade: '',
      current_livelihood: '',
      mobility_km: 10,
      preference: 'Wage Employment'
    });
  };

  const handleSearchSubmit = () => {
    setActiveSection('courses');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f2f5f3] flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-md">
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f5f3] text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        selectedLang={selectedLang}
        onSelectLang={onSelectLang}
        onLoadPersona={handleLoadPersona}
        isOnline={isOnline}
        currentProfile={profile}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Container with Sidebar + Dynamic Full-Page Content */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto">
        {/* Left Sidebar Navigation with functional links */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onOpenReport={() => setShowReportModal(true)}
          onResetAll={handleResetAll}
          onOpenHelp={() => {}}
          courseCount={4}
          centerCount={4}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-x-hidden flex flex-col">
          {/* Mobile Top Navigation Pills */}
          <div className="lg:hidden flex mb-4 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto gap-1.5 shadow-xs">
            {[
              { id: 'courses', label: t('NSQF Packs (4)'), icon: BookOpen },
              { id: 'subsidies', label: t('Subsidies'), icon: Building2 },
              { id: 'centers', label: t('Centers (4)'), icon: MapPin },
              { id: 'home', label: t('Home'), icon: LayoutDashboard },
              { id: 'assistant', label: t('Voice AI'), icon: Mic },
              { id: 'profile', label: t('Profile'), icon: UserCheck },
              { id: 'registration', label: t('Registration Form'), icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* VIEW 1: HOME DASHBOARD OVERVIEW */}
          {activeSection === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Beneficiary Dashboard Hero + Progress + Metric Cards */}
              <BeneficiaryDashboard 
                profile={profile}
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                activeTab="courses"
                onSelectTab={setActiveSection}
                showHero={true}
              />

              {/* Side-by-Side Quick Split on Home: Voice Assistant & Quick Access */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t(t("Voice Agent Quick Access"))}</span>
                    <button 
                      onClick={() => setActiveSection('assistant')} 
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
                    >
                      Open Full Page →
                    </button>
                  </div>
                  <AudioRecorder 
                    onProfileUpdate={(updated) => setProfile(prev => ({ ...prev, ...updated }))} 
                    activeLanguage={selectedLang}
                    currentProfile={profile}
                  />
                  <div className="mt-4 p-4 clay-card bg-orange-50 border-orange-200 text-center">
                    <p className="text-sm text-slate-700 mb-2">{t("Prefer to type instead of speaking?")}</p>
                    <button 
                      onClick={() => setActiveSection('registration')}
                      className="w-full py-2 bg-orange-600 text-white font-bold rounded-xl shadow-sm hover:bg-orange-700 transition"
                    >
                      {t("Open Manual Registration Form")}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t(t("PM-AJAY Fast Links"))}</span>
                    <span className="text-xs text-slate-400">{t(t("Quick Navigation"))}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div 
                      onClick={() => setActiveSection('courses')}
                      className="clay-card p-5 cursor-pointer hover:border-emerald-300 group transition"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800">
                        Recommended NSQF Packs
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        4 tailored skilling programs matching your trade with ₹1,500/mo DBT.
                      </p>
                      <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center">
                        <span>{t(t("Browse Courses"))}</span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveSection('centers')}
                      className="clay-card p-5 cursor-pointer hover:border-emerald-300 group transition"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-800">
                        Training Centers Directory
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Locate 4 certified training hubs in your district with open batches.
                      </p>
                      <div className="mt-3 text-xs font-bold text-orange-700 flex items-center">
                        <span>{t(t("Find Nearest Hub"))}</span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setActiveSection('subsidies')}
                      className="clay-card p-5 cursor-pointer hover:border-emerald-300 group transition"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800">
                        PM-AJAY Subsidies & Grants
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Capital subsidy up to ₹50,000 and free professional toolkits.
                      </p>
                      <div className="mt-3 text-xs font-bold text-amber-700 flex items-center">
                        <span>{t(t("Explore Subsidies"))}</span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setShowReportModal(true)}
                      className="clay-card p-5 cursor-pointer hover:border-emerald-300 group transition"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-800">
                        Assessment Dossier
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        View & print your official government beneficiary card.
                      </p>
                      <div className="mt-3 text-xs font-bold text-orange-700 flex items-center">
                        <span>{t(t("Print Dossier"))}</span>
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: FULL-PAGE RECOMMENDED NSQF PACKS */}
          {activeSection === 'courses' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Home
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t(t("Recommended Packs"))}</span>
              </div>
              <BeneficiaryDashboard 
                profile={profile}
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                activeTab="courses"
                onSelectTab={setActiveSection}
                showHero={false}
              />
            </div>
          )}

          {/* VIEW 3: FULL-PAGE PM-AJAY SUBSIDIES */}
          {activeSection === 'subsidies' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Home
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t(t("PM-AJAY Subsidies"))}</span>
              </div>
              <BeneficiaryDashboard 
                profile={profile}
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                activeTab="subsidies"
                onSelectTab={setActiveSection}
                showHero={false}
              />
            </div>
          )}

          {/* VIEW 4: FULL-PAGE TRAINING CENTERS DIRECTORY */}
          {activeSection === 'centers' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Home
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t(t("Training Centers"))}</span>
              </div>
              <BeneficiaryDashboard 
                profile={profile}
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                activeTab="centers"
                onSelectTab={setActiveSection}
                showHero={false}
              />
            </div>
          )}

          {/* VIEW 5: FULL-PAGE VOICE AI ASSISTANT */}
          {activeSection === 'assistant' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Home
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t(t("Voice Assistant"))}</span>
              </div>
              <div className="max-w-4xl mx-auto w-full">
                <AudioRecorder 
                  onProfileUpdate={(updated) => setProfile(prev => ({ ...prev, ...updated }))} 
                  activeLanguage={selectedLang}
                  currentProfile={profile}
                />
              </div>
            </div>
          )}

          {/* VIEW 6: FULL-PAGE SKILL PROFILE */}
          {activeSection === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Home
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t(t("Skill Profile Assessment"))}</span>
              </div>
              <BeneficiaryDashboard 
                profile={profile}
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                activeTab="courses"
                onSelectTab={setActiveSection}
                showHero={true}
              />
            </div>
          )}

          {/* VIEW 7: REGISTRATION FORM */}
          {activeSection === 'registration' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Home
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t("Registration Form")}</span>
              </div>
              <Registration 
                phone="1234567890" 
                onRegistrationSuccess={(newProfile) => {
                  if (newProfile) setProfile(prev => ({ ...prev, ...newProfile }));
                  setActiveSection('profile');
                }} 
              />
            </div>
          )}
        </main>
      </div>

      {/* Printable Assessment Modal */}
      {showReportModal && (
        <BeneficiaryReportModal
          profile={profile}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}


export default function App() {
  const [selectedLang, setSelectedLang] = useState('hi');
  return (
    <TranslationProvider selectedLang={selectedLang}>
      <MainApp selectedLang={selectedLang} onSelectLang={setSelectedLang} />
    </TranslationProvider>
  );
}

