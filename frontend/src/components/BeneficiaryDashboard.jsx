import React, { useEffect, useState, useCallback } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Compass, 
  MapPin, 
  Target, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  Coins, 
  ChevronRight, 
  Sparkles, 
  Search, 
  Phone, 
  Edit3, 
  Check, 
  X, 
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building,
  HeartHandshake
} from 'lucide-react';
import { ENRICHED_NSQF_CATALOG, SCHEME_COMPONENTS } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';
import EnrollmentModal from './EnrollmentModal';
import farmerImg from '../assets/happy-smiling-indian-farmer-with-tractor-real-farming-life-rural-india_1257902-6315.avif';
import childrenImg from '../assets/Children.png';
import pmajayLogo from '../assets/PM-AJAY.png';

export default function BeneficiaryDashboard({ 
  profile, 
  onUpdateProfile, 
  activeTab = 'courses', 
  onSelectTab,
  showHero = true 
}) {
  const { selectedLang, t } = useLanguage();
  const [recommendations, setRecommendations] = useState([]);
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState(profile);

  // Synchronize with parent activeTab prop
  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
    if (onSelectTab) {
      onSelectTab(tabId);
    }
  };

  // Calculate Profile Completion Rate
  const fields = ['education_level', 'traditional_trade', 'current_livelihood', 'mobility_km', 'preference'];
  const filledFieldsCount = fields.filter(f => profile[f] !== undefined && profile[f] !== null && profile[f] !== '').length;
  const completionPercentage = Math.round((filledFieldsCount / fields.length) * 100);

  const fetchRecommendations = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/recommendations?profile_json=${encodeURIComponent(JSON.stringify(profile))}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const merged = data.map(item => {
            const enriched = ENRICHED_NSQF_CATALOG.find(c => 
              c.nsqf_pack_name.toLowerCase().includes(item.nsqf_pack_name.toLowerCase()) ||
              item.nsqf_pack_name.toLowerCase().includes(c.nsqf_pack_name.toLowerCase())
            );
            return {
              ...enriched,
              ...item,
              matchScore: enriched?.matchScore || 94,
              duration: enriched?.duration || '300 Hours (3 Months)',
              stipend: enriched?.stipend || '₹1,500 / month (PM-AJAY DBT)',
              modules: enriched?.modules || [
                'Fundamental domain equipment training',
                'Industrial safety & hygiene practices',
                'Soft skills & digital workplace readiness'
              ],
              local_centers: enriched?.local_centers || item.local_centers
            };
          });
          setRecommendations(merged);
          return;
        }
      }
    } catch (err) {
      console.warn("ChromaDB API unavailable, applying smart profile matching:", err);
    }

    // Client-side intelligent matching fallback
    const trade = (profile.traditional_trade || '').toLowerCase();

    let matched = [...ENRICHED_NSQF_CATALOG];
    if (trade.includes('tailor') || trade.includes('garment') || trade.includes('sewing')) {
      matched.sort((a) => (a.nsqf_pack_name.includes('Sewing') ? -1 : 1));
    } else if (trade.includes('solar') || trade.includes('electr')) {
      matched.sort((a) => (a.nsqf_pack_name.includes('Solar') ? -1 : 1));
    } else if (trade.includes('beauty') || trade.includes('parlour')) {
      matched.sort((a) => (a.nsqf_pack_name.includes('Beauty') ? -1 : 1));
    } else if (trade.includes('farm') || trade.includes('organic')) {
      matched.sort((a) => (a.nsqf_pack_name.includes('Organic') ? -1 : 1));
    }
    setRecommendations(matched);
  }, [profile]);

  useEffect(() => {
    fetchRecommendations();
    setEditFormData(profile);
  }, [fetchRecommendations, profile]);

  const handleSaveManualEdit = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile(editFormData);
    }
    setIsEditingProfile(false);
  };

  const filteredRecommendations = recommendations.filter(rec => 
    rec.nsqf_pack_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.sector?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.skill_gap_analysis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-5 w-full">
      {/* Top Section: Hero Welcome Banner & Progress Widget */}
      {showHero && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left 2 Cols: Inspiring Tri-color Hero with Farmer Artwork */}
          <div className="lg:col-span-2 rounded-3xl relative overflow-hidden flex flex-col justify-between p-6 sm:p-7 border border-orange-200/80 shadow-sm bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-emerald-50/60">
            {/* Background Farmer Image with aesthetic subtle blend */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 opacity-25 sm:opacity-40 pointer-events-none mix-blend-multiply overflow-hidden flex items-center justify-end">
              <img 
                src={farmerImg} 
                alt="Rural Farming and Skilling Beneficiary" 
                className="w-full h-full object-cover object-center scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-transparent to-transparent" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span>PM-AJAY Skill Development Mission</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline text-emerald-800 font-semibold">Government of India</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Namaste, {profile?.name || 'Beneficiary'}</span>
                <Sparkles className="w-5 h-5 text-orange-600 inline shrink-0" />
              </h2>
              <p className="text-sm font-semibold text-slate-700 mt-1.5 max-w-md">
                Explore matched NSQF courses, claim direct monthly stipends, and access subsidized toolkits tailored for your trade.
              </p>
              <div className="mt-2 text-xs text-orange-900 font-bold bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full w-fit border border-orange-200/60 shadow-2xs">
                "{t('motto', 'Every Skill Takes Flight — Your Potential, Our Support')}"
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between relative z-10 pt-3 border-t border-orange-200/60 text-xs gap-2">
              <div className="flex items-center space-x-2 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Free NSQF Certification • ₹1,500/mo DBT • Modern Toolkits</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] shadow-xs border border-emerald-200">
                100% Sponsored
              </span>
            </div>
          </div>

          {/* Right 1 Col: "Your Progress" Widget */}
          <div className="clay-card p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Your Progress</h3>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                title="Edit profile"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              {/* Circular Gauge */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="4.5" fill="transparent" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="26" 
                    stroke="#16a34a" 
                    strokeWidth="4.5" 
                    strokeDasharray={163} 
                    strokeDashoffset={163 - (163 * completionPercentage) / 100} 
                    strokeLinecap="round" 
                    fill="transparent" 
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-sm font-extrabold text-slate-900">
                  {completionPercentage}%
                </span>
              </div>

              {/* Checklist */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-800">Profile Extracted</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${filledFieldsCount >= 3 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={filledFieldsCount >= 3 ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                    Skill Gap Analyzed
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${recommendations.length > 0 ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className={recommendations.length > 0 ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                    Courses Recommended
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 bg-[#f8faf9] p-2 rounded-xl border border-slate-200/60 flex items-center justify-between">
              <span>{filledFieldsCount} of 5 slots captured</span>
              <span className="text-emerald-700 font-bold">NSQF Ready</span>
            </div>
          </div>
        </div>
      )}

      {/* Manual Edit Drawer / Form */}
      {isEditingProfile && (
        <form onSubmit={handleSaveManualEdit} className="clay-card p-4 border border-orange-200 bg-white animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-900 flex items-center space-x-1">
              <Edit3 className="w-3.5 h-3.5 text-orange-600" />
              <span>Manual Profile Adjustment:</span>
            </span>
            <button 
              type="button" 
              onClick={() => setIsEditingProfile(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
            <div>
              <label className="block text-slate-500 mb-1">Education Level</label>
              <input 
                type="text" 
                value={editFormData.education_level || ''} 
                onChange={e => setEditFormData({ ...editFormData, education_level: e.target.value })}
                placeholder="e.g. 10th Grade"
                className="w-full px-3 py-1.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Traditional Trade</label>
              <input 
                type="text" 
                value={editFormData.traditional_trade || ''} 
                onChange={e => setEditFormData({ ...editFormData, traditional_trade: e.target.value })}
                placeholder="e.g. Tailoring"
                className="w-full px-3 py-1.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Job Preference</label>
              <select
                value={editFormData.preference || 'Wage Employment'}
                onChange={e => setEditFormData({ ...editFormData, preference: e.target.value })}
                className="w-full px-3 py-1.5 bg-[#f8faf9] border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="Wage Employment">Wage Employment</option>
                <option value="Self-Employment">Self-Employment</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="clay-btn clay-btn-saffron px-4 py-1.5 text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tri-Color Harmonic Quick Metric Cards */}
      {showHero && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="clay-peach p-3.5 rounded-2xl">
            <div className="flex items-center space-x-1.5 text-orange-700">
              <GraduationCap className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('education', 'Education')}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {t(profile.education_level, profile.education_level || 'Not provided')}
            </div>
          </div>

          <div className="clay-amber p-3.5 rounded-2xl">
            <div className="flex items-center space-x-1.5 text-amber-800">
              <Briefcase className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('trade', 'Trade')}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {t(profile.traditional_trade, profile.traditional_trade || 'Not provided')}
            </div>
          </div>

          <div className="clay-mint p-3.5 rounded-2xl">
            <div className="flex items-center space-x-1.5 text-emerald-800">
              <Target className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('occupation', 'Occupation')}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {t(profile.current_livelihood, profile.current_livelihood || 'Not provided')}
            </div>
          </div>

          <div className="clay-card p-3.5 rounded-2xl border-orange-200/70 bg-gradient-to-br from-white to-orange-50/50">
            <div className="flex items-center space-x-1.5 text-orange-700">
              <Compass className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('mobility', 'Mobility')}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {profile.mobility_km ? `${profile.mobility_km} ${t('kmRadius', 'km radius')}` : `10 ${t('kmRadius', 'km radius')}`}
            </div>
          </div>

          <div className="clay-mint p-3.5 rounded-2xl col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-1.5 text-emerald-800">
              <Coins className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">{t('preference', 'Preference')}</span>
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1 truncate">
              {t(profile.preference, profile.preference || 'Wage Job')}
            </div>
          </div>
        </div>
      )}

      {/* When in dedicated full-page view without hero, show a compact beneficiary context badge */}
      {!showHero && (
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-900">{profile.name || 'Beneficiary'}</span>
            <span>•</span>
            <span className="text-slate-500">{profile.district || 'Varanasi, UP'}</span>
            <span>•</span>
            <span className="bg-orange-50 text-orange-700 font-semibold px-2 py-0.5 rounded-md border border-orange-200">
              {profile.traditional_trade || 'General Trade'}
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-500">
            <span>Profile Match: <strong className="text-emerald-700">{completionPercentage}%</strong></span>
            <button 
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditingProfile ? 'Close Form' : 'Edit Info'}</span>
            </button>
          </div>
        </div>
      )}

      {/* FULL WIDTH Main Container for Courses, Subsidies & Centers */}
      <div className="clay-card p-5 sm:p-7 w-full shadow-sm">
        {/* Navigation Tabs (matches the screenshot pill tabs, synced with Sidebar!) */}
        <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleTabChange('courses')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                currentTab === 'courses'
                  ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-300 font-extrabold shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {t('recommendedNsqfPacks', 'Recommended NSQF Packs')} ({filteredRecommendations.length})
            </button>
            
            <button
              onClick={() => handleTabChange('subsidies')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                currentTab === 'subsidies'
                  ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-300 font-extrabold shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {t('subsidies', 'PM-AJAY Subsidies')}
            </button>

            <button
              onClick={() => handleTabChange('centers')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-xs ${
                currentTab === 'centers'
                  ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-300 font-extrabold shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {t('centers', 'Training Centers')}
            </button>
          </div>

          {currentTab === 'courses' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('searchCoursesSkills', 'Search courses or skills...')}
                className="pl-9 pr-3 py-2 text-xs bg-[#f8faf9] border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-52 shadow-inner"
              />
            </div>
          )}
        </div>

        {/* FULL PAGE VIEW 1: Recommended NSQF Packs */}
        {currentTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {t('nsqfSkillRecs', 'NSQF-Aligned Skill Recommendations')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('matchedBasedOn', 'Matched based on your education and trade')} ({t(profile.education_level, profile.education_level || '10th')}, {t(profile.traditional_trade, profile.traditional_trade || 'Tailoring')})
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {t('freeTraining', '100% Free Training')}
              </span>
            </div>

            {filteredRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold text-xs border border-orange-200">
                          {t('nsqfLevel', 'NSQF Level')} {rec.level}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {t(rec.sector, rec.sector || 'Skilling Domain')} • {t(rec.duration, rec.duration || '3 Months')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center space-x-1">
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          <span>{rec.matchScore || 94}% {t('fit', 'Fit')}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                          {t('highDemand', 'High Demand')}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 hover:text-emerald-800 transition">
                        {t(rec.nsqf_pack_name, rec.nsqf_pack_name)}
                      </h4>

                      {/* Skill Gap Analysis Box */}
                      <div className="mt-3 p-3.5 rounded-2xl bg-[#f8faf9] border border-slate-200/70">
                        <div className="text-[11px] font-bold uppercase text-slate-700 tracking-wider flex items-center space-x-1.5">
                          <Target className="w-3.5 h-3.5 text-orange-600" />
                          <span>{t('skillGapAnalysis', 'Skill Gap Analysis:')}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {t(rec.skill_gap_analysis, rec.skill_gap_analysis)}
                        </p>
                      </div>

                      {/* Training Modules */}
                      {rec.modules && (
                        <div className="mt-3">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            {t('coreCurriculumModules', 'Core Curriculum Modules:')}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                            {rec.modules.map((m, mIdx) => {
                              const moduleName = typeof m === 'object' ? m.name : m;
                              return (
                                <div key={mIdx} className="flex items-center space-x-1.5">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="truncate">{t(moduleName, moduleName)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                          {t(rec.stipend, rec.stipend || '₹1,500/mo DBT Stipend')}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-medium">
                          {t('freeToolkit', 'Free Tool Kit')}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedCourseForEnroll(rec)}
                        className="clay-btn clay-btn-saffron px-5 py-2 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{t('enrollNow', 'Enroll Now')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-3xl bg-[#f8faf9] border border-slate-200">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">{t('noNsqfCoursesFound', 'No NSQF Courses Found')}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {t('noNsqfCoursesDesc', 'Try speaking to the assistant or updating the search filter.')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* FULL PAGE VIEW 2: PM-AJAY Subsidies & Scheme Entitlements */}
        {currentTab === 'subsidies' && (
          <div className="space-y-4">
            {/* Official PM-AJAY Header with Official Emblem */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-emerald-50 border border-orange-200/80 shadow-xs relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-xs shrink-0">
                    <img 
                      src={pmajayLogo} 
                      alt="PM-AJAY Official Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold border border-orange-200">
                        {t('centrallySponsored', '100% Centrally Sponsored')}
                      </span>
                      <span className="text-xs text-emerald-800 font-bold">
                        {t('ministryName', 'Ministry of Social Justice & Empowerment')}
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                      {t('scaEntitlements', 'PM-AJAY Special Central Assistance (SCA) Entitlements')}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {t('scaDesc', 'Direct benefit transfers, income-generating subsidies up to ₹50,000, and fully equipped starter toolkits.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 flex items-center space-x-1 shadow-2xs">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t('activeScheme', 'Active Scheme')}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Scheme Components Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SCHEME_COMPONENTS.map((item, idx) => (
                <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition flex items-start space-x-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 shadow-xs">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{t(item.title, item.title)}</h4>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        {t(item.tag, item.tag)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{t(item.subtitle, item.subtitle)}</p>
                    <div className="mt-3 text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('dbtEligible', 'Direct Benefit Transfer (DBT) eligible')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Community & Next-Gen Livelihood Impact Spotlight using Children.png */}
            <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-50/80 via-white to-orange-50/80 border border-emerald-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5 overflow-hidden">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <HeartHandshake className="w-4 h-4 text-emerald-700" />
                  <span>{t('socioEconomicTrans', 'Socio-Economic Transformation')}</span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {t('buildingBrighterFutures', 'Building Brighter Futures for Families & Youth')}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  {t('buildingBrighterFuturesDesc', 'PM-AJAY skilling and financial grants uplift rural households, creating sustainable multi-generational livelihoods, quality education opportunities, and economic dignity across India.')}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-1 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 shadow-2xs">
                    {t('familyWelfare', 'Family Welfare')}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 shadow-2xs">
                    {t('zeroFees', 'Zero Fees')}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white text-orange-800 font-bold border border-orange-200 shadow-2xs">
                    {t('guaranteedDbt', 'Guaranteed DBT')}
                  </span>
                </div>
              </div>

              <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden border border-slate-200 shadow-xs shrink-0 bg-white relative">
                <img 
                  src={childrenImg} 
                  alt="Rural Children and Future of India" 
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/70 to-transparent p-2 text-center">
                  <span className="text-[10px] text-white font-bold">{t('empoweringNextGen', 'Empowering Next-Gen India')}</span>
                </div>
              </div>
            </div>

            {/* Application & Subsidy Calculator Note */}
            <div className="p-4 rounded-2xl bg-[#f8faf9] border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-600">
                <strong>{t('needLoanHelp', 'Need financial loan assistance?')}</strong> {t('loanHelpDesc', 'PM-AJAY facilitates collateral-free credit tie-up under MUDRA & Stand-Up India schemes.')}
              </div>
              <button
                onClick={() => handleTabChange('centers')}
                className="clay-btn clay-btn-green px-4 py-2 text-xs font-bold text-white shrink-0 cursor-pointer"
              >
                {t('visitNearestCenter', 'Visit Nearest Center')}
              </button>
            </div>
          </div>
        )}

        {/* FULL PAGE VIEW 3: Training Centers Directory */}
        {currentTab === 'centers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {t('certifiedCentersTitle', 'Certified PM-AJAY Training Centers in Your District')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('certifiedCentersDesc', 'Fully accredited centers offering smart classrooms, practical workshops, and direct placement cells.')}
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                4 {t('centersLocated', 'Centers Located')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  name: "PM-AJAY District Kaushal Kendra, Civil Lines", 
                  address: "Plot 42, Skill Tower, Civil Lines", 
                  distance: "3.2 km away", 
                  phone: "+91 98765 00001", 
                  seats: "45 Open Seats",
                  timing: "9:00 AM - 5:00 PM",
                  facility: "Smart Lab & Biometric Desk"
                },
                { 
                  name: "Jan Shikshan Sansthan (JSS) Rural Hub", 
                  address: "Near Block Development Office", 
                  distance: "6.8 km away", 
                  phone: "+91 98765 00002", 
                  seats: "30 Open Seats",
                  timing: "9:30 AM - 4:30 PM",
                  facility: "Tailoring & Agriculture Lab"
                },
                { 
                  name: "MSME Technology Development Centre", 
                  address: "Industrial Area Phase 2", 
                  distance: "9.5 km away", 
                  phone: "+91 98765 00003", 
                  seats: "20 Open Seats",
                  timing: "8:30 AM - 5:30 PM",
                  facility: "Solar PV Mounting Array"
                },
                { 
                  name: "RSETI Rural Self Employment Institute", 
                  address: "Lead Bank Training Complex", 
                  distance: "12.0 km away", 
                  phone: "+91 98765 00004", 
                  seats: "50 Open Seats",
                  timing: "10:00 AM - 6:00 PM",
                  facility: "Hostel & Free Meals Available"
                }
              ].map((center, idx) => (
                <div 
                  key={idx} 
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-900 transition">
                      {t(center.name, center.name)}
                    </h4>

                    <div className="space-y-2 mt-3 text-sm text-slate-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2.5 text-orange-600 shrink-0" />
                        <span className="text-slate-600 font-medium">{t(center.address, center.address)}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2.5 text-slate-400 shrink-0" />
                        <a href={`tel:${center.phone.replace(/\s+/g, '')}`} className="text-slate-600 hover:text-emerald-700 transition font-medium">
                          {center.phone}
                        </a>
                      </div>
                    </div>

                    <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-[#f8faf9] text-xs text-slate-500 font-medium border border-slate-100 flex items-center justify-between">
                      <span>{t('facility', 'Facility')}: {t(center.facility, center.facility)}</span>
                      <span className="text-slate-400">• {center.timing}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 flex items-center justify-between text-sm">
                    <span className="text-orange-700 font-bold text-base tracking-tight">
                      {t(center.distance, center.distance)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200 shadow-2xs">
                        {t(center.seats, center.seats)}
                      </span>
                      <button
                        onClick={() => handleTabChange('courses')}
                        className="px-3 py-1 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 font-bold text-xs transition border border-slate-200 hover:border-emerald-300 cursor-pointer"
                        title="View courses offered here"
                      >
                        {t('coursesArrow', 'Courses →')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enrollment Action Modal */}
      {selectedCourseForEnroll && (
        <EnrollmentModal
          course={selectedCourseForEnroll}
          profile={profile}
          onClose={() => setSelectedCourseForEnroll(null)}
        />
      )}
    </div>
  );
}
