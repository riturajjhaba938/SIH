import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  MapPin, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Briefcase, 
  Check, 
  Plus, 
  ArrowRight, 
  Filter, 
  SlidersHorizontal,
  Building,
  GraduationCap,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { ENRICHED_NSQF_CATALOG, RELATED_SKILL_MODULES } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';
import EnrollmentModal from './EnrollmentModal';

export default function RecommendationsView({ 
  profile, 
  onEnrollSuccess,
  enrolledCourseIds = [],
  onNavigateToDashboard 
}) {
  const { t } = useLanguage();
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedMicroModules, setSelectedMicroModules] = useState(['micro_soft_skills']);
  const [activeSectorFilter, setActiveSectorFilter] = useState('all');
  const [modalCourse, setModalCourse] = useState(null);
  const [showMultiEnrollSuccess, setShowMultiEnrollSuccess] = useState(false);
  const [multiEnrollAppId, setMultiEnrollAppId] = useState('');

  // Sector options for filtering
  const sectors = ['all', 'Apparel, Made-Ups & Home Furnishing', 'Green Jobs & Renewable Energy', 'Beauty & Wellness', 'Agriculture & Allied', 'Automotive & Electric Mobility'];

  const filteredCourses = ENRICHED_NSQF_CATALOG.filter(course => {
    if (activeSectorFilter === 'all') return true;
    return course.sector === activeSectorFilter;
  });

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleMicroModule = (modId) => {
    setSelectedMicroModules(prev => 
      prev.includes(modId)
        ? prev.filter(id => id !== modId)
        : [...prev, modId]
    );
  };

  const handleOpenSingleEnroll = (course) => {
    setModalCourse(course);
  };

  const handleMultiEnrollSubmit = () => {
    const coursesToEnroll = ENRICHED_NSQF_CATALOG.filter(c => selectedCourses.includes(c.id));
    const generatedId = `PMAJAY-2026-RAVI-${Math.floor(1000 + Math.random() * 9000)}`;
    setMultiEnrollAppId(generatedId);
    setShowMultiEnrollSuccess(true);
    
    if (onEnrollSuccess) {
      onEnrollSuccess(coursesToEnroll, selectedMicroModules, generatedId);
    }
  };

  // Calculate cumulative stipend for selected courses
  const totalStipendAmount = selectedCourses.reduce((acc, cId) => {
    const course = ENRICHED_NSQF_CATALOG.find(c => c.id === cId);
    if (!course) return acc;
    return acc + (course.level >= 4 ? 2000 : 1500);
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="clay-card p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold">
                {t('smartNsqfMatchingEngine', 'Smart NSQF Matching Engine')}
              </span>
              <span className="text-xs text-slate-300">• {t('basedOn', 'Based on')} {t(profile.traditional_trade, profile.traditional_trade || 'Tailoring')} {t('profile', 'Profile')}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              {t('recommendedNsqfSkillingPrograms', 'Recommended NSQF Skilling Programs')}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {t('nsqfSkillingDesc', 'Curated government-funded courses aligned with the National Skills Qualification Framework. You can enroll in multiple courses and supplementary micro-modules simultaneously under PM-AJAY.')}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onNavigateToDashboard}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('goToMyLearningDashboard', 'Go to My Learning Dashboard →')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sector Filter Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 flex items-center space-x-1 shrink-0 px-2">
          <Filter className="w-3.5 h-3.5" />
          <span>{t('sectorFilter', 'Sector Filter:')}</span>
        </span>
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setActiveSectorFilter(sec)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              activeSectorFilter === sec
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {sec === 'all' ? `${t('allSectors', 'All Sectors')} (5)` : t(sec.split(',')[0], sec.split(',')[0])}
          </button>
        ))}
      </div>

      {/* NSQF Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isSelected = selectedCourses.includes(course.id);
          const isAlreadyEnrolled = enrolledCourseIds.includes(course.id);

          return (
            <div 
              key={course.id}
              className={`clay-card p-5 bg-white border flex flex-col justify-between transition-all duration-200 hover:shadow-lg relative ${
                isSelected 
                  ? 'border-emerald-500 ring-2 ring-emerald-400/30 bg-emerald-50/10' 
                  : 'border-slate-200/90'
              }`}
            >
              <div>
                {/* Match Badge & Level */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px]">
                      {course.matchScore}% {t('match', 'Match')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {t('nsqfLevel', 'NSQF Level')} {course.level}
                    </span>
                  </div>

                  {/* Multi-Select Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleCourseSelection(course.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{t('selected', 'Selected')}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>{t('select', 'Select')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Title & Sector */}
                <h3 className="font-extrabold text-slate-900 text-base leading-snug mb-1">
                  {t(course.nsqf_pack_name, course.nsqf_pack_name)}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mb-3">
                  {t('sector', 'Sector')}: {t(course.sector, course.sector)} • QP: {course.code}
                </p>

                {/* Benefits & DBT Stipend */}
                <div className="p-3 bg-[#f0fdf4] rounded-2xl border border-emerald-200 mb-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">{t('dbtStipend', 'DBT Stipend')}:</span>
                    <span className="font-extrabold text-emerald-900">{t(course.stipend.split('(')[0], course.stipend.split('(')[0])}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">{t('duration', 'Duration')}:</span>
                    <span className="font-bold text-slate-800">{t(course.duration, course.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">{t('freeToolkit', 'Free Toolkit')}:</span>
                    <span className="font-bold text-orange-800">{t(course.toolkit_grant.split('(')[0], course.toolkit_grant.split('(')[0])}</span>
                  </div>
                </div>

                {/* Modules Summary */}
                <div className="mb-4">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5 tracking-wider">
                    {t('coreTrainingModules', 'Core Training Modules (4)')}
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {course.modules.slice(0, 3).map((mod, idx) => {
                      const modText = typeof mod === 'string' ? mod : mod.name;
                      return (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span className="truncate">{t(modText, modText)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Nearest Training Center */}
                {course.local_centers && course.local_centers[0] && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span className="truncate font-semibold">{t(course.local_centers[0].name.split(',')[0], course.local_centers[0].name.split(',')[0])}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                      {t(course.local_centers[0].distance, course.local_centers[0].distance)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenSingleEnroll(course)}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isAlreadyEnrolled ? t('viewEnrollment', 'View Enrollment') : t('enrollNow', 'Enroll Now')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Related Skill Micro-Modules Section */}
      <div className="clay-card p-6 bg-white border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                {t('additionalMicroSkills', 'Additional Related Micro-Skills (Add-On Modules)')}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('microSkillsDesc', 'Boost your job readiness and self-employment subsidy eligibility by adding these short modules to your PM-AJAY training.')}
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {t('includedFree', 'Included 100% Free')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {RELATED_SKILL_MODULES.map((mod) => {
            const isChecked = selectedMicroModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => toggleMicroModule(mod.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isChecked
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {t(mod.duration, mod.duration)}
                    </span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 pointer-events-none"
                    />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">
                    {t(mod.title, mod.title)}
                  </h4>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                    ✓ {t(mod.benefit, mod.benefit)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Floating Multi-Enrollment Bar */}
      {selectedCourses.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white shadow-2xl border border-emerald-500/50 animate-in slide-in-from-bottom duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-extrabold text-sm border border-emerald-400/40">
              {selectedCourses.length}
            </div>
            <div>
              <div className="font-bold text-sm text-white">
                {selectedCourses.length} {t('nsqfCoursesSelected', 'NSQF Courses Selected')}
              </div>
              <div className="text-xs text-emerald-300 font-semibold">
                {t('totalDirectBenefit', 'Total Direct Benefit')}: ₹{totalStipendAmount.toLocaleString()}/month {t('dbtStipendToolkits', 'DBT Stipend + Toolkits')}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedCourses([])}
              className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
            >
              {t('clear', 'Clear')}
            </button>
            <button
              onClick={handleMultiEnrollSubmit}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-lg transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('confirmMultiCourseEnrollment', 'Confirm Multi-Course Enrollment')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Single Course Modal */}
      {modalCourse && (
        <EnrollmentModal
          course={modalCourse}
          profile={profile}
          onClose={() => setModalCourse(null)}
          onEnrollSuccess={(courseData) => {
            if (onEnrollSuccess) {
              onEnrollSuccess([modalCourse], selectedMicroModules, `PMAJAY-2026-RAVI-${Math.floor(1000 + Math.random() * 9000)}`);
            }
          }}
        />
      )}

      {/* Multi-Enrollment Confirmation Modal */}
      {showMultiEnrollSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 relative overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0 right-0" />

            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 border-4 border-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Multi-Course Enrollment Confirmed!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                You have successfully enrolled in {selectedCourses.length} NSQF programs under PM-AJAY.
              </p>

              <div className="my-5 p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Application Number:</span>
                  <span className="font-extrabold text-emerald-950">{multiEnrollAppId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Beneficiary:</span>
                  <span className="font-bold text-slate-900">{profile.name || 'Ravi Kumar'} (+91 {profile.phone || '9876543210'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly DBT Stipend:</span>
                  <span className="font-extrabold text-emerald-800">₹{totalStipendAmount.toLocaleString()} / month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">SMS Confirmation:</span>
                  <span className="font-bold text-emerald-900">Sent to linked mobile</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowMultiEnrollSuccess(false);
                    setSelectedCourses([]);
                    if (onNavigateToDashboard) onNavigateToDashboard();
                  }}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Open My Learning & Placement Dashboard →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
