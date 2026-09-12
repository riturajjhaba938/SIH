import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AudioRecorder from './components/AudioRecorder';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import BeneficiaryReportModal from './components/BeneficiaryReportModal';
import AuthModal from './components/AuthModal';
import AIAssistantView from './components/AIAssistantView';
import RecommendationsView from './components/RecommendationsView';
import PersonalDashboardView from './components/PersonalDashboardView';
import { 
  Mic, 
  LayoutDashboard, 
  BookOpen, 
  Building2, 
  MapPin, 
  UserCheck, 
  ArrowLeft,
  FileText,
  Briefcase,
  Sparkles,
  Award,
  LogIn
} from 'lucide-react';
import LoginPage from './components/LoginPage';
import { ENRICHED_NSQF_CATALOG, DEMO_PERSONAS } from './data/mockProfiles';
import { useLanguage } from './context/LanguageContext';
import './index.css';

function App() {
  const { selectedLang, setLanguage, setLanguage: setSelectedLang, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ravi Kumar',
    phone: '9876543210',
    district: 'Varanasi, UP',
    education_level: '10th Grade',
    traditional_trade: 'Tailoring & Garments',
    current_livelihood: 'Local Garment Shop Helper',
    mobility_km: 10,
    preference: 'Wage Employment (Job)',
    interests: 'Industrial Sewing, Quality Inspection, Solar Tech'
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Enrolled courses state (defaults with Sewing Machine Operator for rich out-of-the-box experience)
  const [enrolledCourses, setEnrolledCourses] = useState([
    ENRICHED_NSQF_CATALOG[0]
  ]);
  const [enrolledMicroModules, setEnrolledMicroModules] = useState(['micro_soft_skills']);

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
      district: persona.district,
      phone: persona.phone || '9876543210'
    });
  };

  const handleResetAll = () => {
    setProfile({
      name: 'Ravi Kumar',
      phone: '9876543210',
      district: 'Varanasi, UP',
      education_level: '10th Grade',
      traditional_trade: 'Tailoring & Garments',
      current_livelihood: 'Local Garment Shop Helper',
      mobility_km: 10,
      preference: 'Wage Employment (Job)',
      interests: 'Industrial Sewing'
    });
    setEnrolledCourses([ENRICHED_NSQF_CATALOG[0]]);
    setActiveSection('home');
  };

  const handleLoginSuccess = (newProfile) => {
    setProfile(newProfile);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setActiveSection('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveSection('home');
  };

  const handleEnrollSuccess = (courses, microModules, appId) => {
    setEnrolledCourses(prev => {
      const existingIds = prev.map(c => c.id);
      const newAdditions = courses.filter(c => !existingIds.includes(c.id));
      return [...prev, ...newAdditions];
    });
    if (microModules) {
      setEnrolledMicroModules(microModules);
    }
  };

  const handleSearchSubmit = () => {
    setActiveSection('courses');
  };

  // ENTRANCE GATE: Show Login and Sign Up Page before reaching the Dashboard
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f5f3] text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        onLoadPersona={handleLoadPersona}
        isOnline={isOnline}
        currentProfile={profile}
        onSearchSubmit={handleSearchSubmit}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Container with Sidebar + Dynamic Full-Page Content */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onOpenReport={() => setShowReportModal(true)}
          onResetAll={handleResetAll}
          onOpenHelp={() => {}}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          courseCount={ENRICHED_NSQF_CATALOG.length}
          centerCount={4}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-x-hidden flex flex-col">
          {/* Mobile Top Navigation Pills */}
          <div className="lg:hidden flex mb-4 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto gap-1.5 shadow-xs scrollbar-none">
            {[
              { id: 'home', label: t('home', 'Overview Dashboard'), icon: LayoutDashboard },
              { id: 'my_learning', label: t('my_learning', 'Personal Dashboard'), icon: Briefcase },
              { id: 'assistant', label: t('assistant', 'AI Voice Profiler'), icon: Mic },
              { id: 'courses', label: t('courses', 'Recommended NSQF Packs'), icon: BookOpen },
              { id: 'subsidies', label: t('subsidies', 'PM-AJAY Subsidies'), icon: Building2 },
              { id: 'centers', label: t('centers', 'Training Centers'), icon: MapPin },
              { id: 'profile', label: t('profile', 'Beneficiary Profile'), icon: UserCheck }
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

              {/* 3-Column Fast Action Launchers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Voice AI Profiler */}
                <div 
                  onClick={() => setActiveSection('assistant')}
                  className="clay-card p-5 bg-gradient-to-tr from-emerald-900 to-slate-900 text-white cursor-pointer hover:border-emerald-400 group transition relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 border border-emerald-400/30">
                    <Mic className="w-5 h-5 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-white text-base group-hover:text-emerald-300 transition-colors">
                    🎙️ {t('aiVoiceProfilerCardTitle', 'AI Voice Profiler')}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {t('aiVoiceProfilerCardDesc', 'Ajay Saathi asks 6 simple questions to discover your ideal NSQF courses.')}
                  </p>
                  <div className="mt-4 text-xs font-bold text-emerald-400 flex items-center">
                    <span>{t('startVoiceAssessment', 'Start Voice Assessment')}</span>
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* 2. Personal Learning Dashboard */}
                <div 
                  onClick={() => setActiveSection('my_learning')}
                  className="clay-card p-5 bg-white cursor-pointer hover:border-orange-300 group transition"
                >
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base group-hover:text-orange-800 transition-colors">
                    📊 {t('personalDashboardCardTitle', 'Personal Dashboard & Job Readiness')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('personalDashboardCardDesc', 'Track your enrolled courses, pending vs completed skills, and placement company readiness.')}
                  </p>
                  <div className="mt-4 text-xs font-bold text-orange-700 flex items-center">
                    <span>{t('openLearningHub', 'Open My Learning Hub')}</span>
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* 3. Recommended NSQF Packs */}
                <div 
                  onClick={() => setActiveSection('courses')}
                  className="clay-card p-5 bg-white cursor-pointer hover:border-emerald-300 group transition"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                    🎓 {t('multiCourseCardTitle', 'Multi-Course Enrollment')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('multiCourseCardDesc', 'Select and enroll in multiple NSQF courses with monthly DBT stipends and free toolkits.')}
                  </p>
                  <div className="mt-4 text-xs font-bold text-emerald-700 flex items-center">
                    <span>{t('exploreCoursesCenters', 'Explore Courses & Centers')}</span>
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: AI VOICE ASSISTANT INTERACTION (FLOW 2) */}
          {activeSection === 'assistant' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {t('home', 'Home')}
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t('assistant', 'AI Voice Profiler')}</span>
              </div>
              <AIAssistantView
                profile={profile}
                onUpdateProfile={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
                onProceedToRecommendations={() => setActiveSection('courses')}
                activeLanguage={selectedLang}
              />
            </div>
          )}

          {/* VIEW 3: SMART RECOMMENDATIONS & MULTI-ENROLLMENT (FLOW 3 & 4) */}
          {activeSection === 'courses' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {t('home', 'Home')}
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t('courses', 'Recommended NSQF Packs')}</span>
              </div>
              <RecommendationsView
                profile={profile}
                enrolledCourseIds={enrolledCourses.map(c => c.id)}
                onEnrollSuccess={handleEnrollSuccess}
                onNavigateToDashboard={() => setActiveSection('my_learning')}
              />
            </div>
          )}

          {/* VIEW 4: PERSONAL DASHBOARD (FLOW 5) */}
          {activeSection === 'my_learning' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {t('home', 'Home')}
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t('my_learning', 'Personal Learning Dashboard')}</span>
              </div>
              <PersonalDashboardView
                profile={profile}
                enrolledCourses={enrolledCourses}
                onExploreMoreCourses={() => setActiveSection('courses')}
                onOpenReportModal={() => setShowReportModal(true)}
              />
            </div>
          )}

          {/* VIEW 5: FULL-PAGE PM-AJAY SUBSIDIES */}
          {activeSection === 'subsidies' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {t('home', 'Home')}
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t('subsidies', 'PM-AJAY Subsidies')}</span>
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

          {/* VIEW 6: FULL-PAGE TRAINING CENTERS DIRECTORY */}
          {activeSection === 'centers' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {t('home', 'Home')}
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t('centers', 'Training Centers Directory')}</span>
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

          {/* VIEW 7: FULL-PAGE SKILL PROFILE DOSSIER */}
          {activeSection === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-200 w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <button onClick={() => setActiveSection('home')} className="hover:text-slate-800 flex items-center cursor-pointer">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> {t('home', 'Home')}
                </button>
                <span>/</span>
                <span className="font-bold text-slate-800">{t('profile', 'Beneficiary Profile Dossier')}</span>
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
        </main>
      </div>

      {/* Auth Modal (Mobile OTP & Voice Registration) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
      />

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

export default App;
