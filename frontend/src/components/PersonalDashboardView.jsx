import React, { useState } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Award, 
  AlertCircle, 
  Building, 
  MapPin, 
  Phone, 
  Download, 
  Printer, 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  ShieldCheck, 
  Calendar, 
  Target, 
  Check, 
  PlusCircle, 
  Coins,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { ENRICHED_NSQF_CATALOG } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';

export default function PersonalDashboardView({ 
  profile, 
  enrolledCourses = [], 
  onExploreMoreCourses,
  onOpenReportModal 
}) {
  const { selectedLang, t } = useLanguage();
  // Default to at least one course (Sewing Machine Operator) if empty
  const activeCourses = enrolledCourses.length > 0 
    ? enrolledCourses 
    : [ENRICHED_NSQF_CATALOG[0]];

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [courseProgress, setCourseProgress] = useState({
    'nsqf_sewing_3': 65,
    'nsqf_solar_4': 30,
    'nsqf_beauty_3': 50,
    'nsqf_organic_4': 25,
    'nsqf_ev_4': 40
  });

  const [actionsChecklist, setActionsChecklist] = useState([
    { id: 1, text: 'Attend Practical Workshop at District Kaushal Kendra on 22 Sep', completed: true, tag: 'Workshop' },
    { id: 2, text: 'Submit Aadhaar e-KYC Document Verification for DBT Stipend', completed: true, tag: 'DBT Direct' },
    { id: 3, text: 'Complete Module 3 Practical Assessment (Fabric defect identification)', completed: false, tag: 'Exam' },
    { id: 4, text: 'Download and Print Official PM-AJAY Trainee Identity Card', completed: false, tag: 'ID Card' },
    { id: 5, text: 'Book 1-on-1 Mock Placement Interview with Raymond Recruiter', completed: false, tag: 'Placement' }
  ]);

  const currentActiveCourse = activeCourses[selectedCourseIndex] || activeCourses[0];
  const currentProgress = courseProgress[currentActiveCourse?.id] || 65;

  const toggleActionItem = (id) => {
    setActionsChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  // Job readiness metric calculation
  const completedActionsCount = actionsChecklist.filter(a => a.completed).length;
  const jobReadinessScore = Math.round((currentProgress * 0.6) + (completedActionsCount / actionsChecklist.length * 40));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome & Beneficiary Card Banner */}
      <div className="clay-card p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 text-emerald-400 flex items-center justify-center text-2xl font-extrabold shadow-inner shrink-0">
              {profile.name ? profile.name.charAt(0) : 'R'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-extrabold text-white">
                  {profile.name || 'Ravi Kumar'}'s {t('learningHub', 'Learning Hub')}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  {t('activeBeneficiary', 'Active Beneficiary')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                District: <strong>{profile.district || 'Varanasi, UP'}</strong> • Education: <strong>{profile.education_level || '10th Grade'}</strong> • Preference: <strong>{profile.preference || 'Wage Employment'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-center">
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white shadow-md transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('printDossier', 'Print Beneficiary Dossier')}</span>
            </button>
            <button
              onClick={onExploreMoreCourses}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t('addAnotherCourse', 'Add Another Course')}</span>
            </button>
          </div>
        </div>

        {/* Quick High-Level Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-slate-400">{t('enrolledPrograms', 'Enrolled Programs')}</div>
            <div className="text-lg font-extrabold text-white mt-0.5">{activeCourses.length} NSQF Course{activeCourses.length > 1 ? 's' : ''}</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-slate-400">{t('jobReadiness', 'Job Readiness')}</div>
            <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{jobReadinessScore}% Ready</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-slate-400">{t('monthlyDbtStipend', 'Monthly DBT Stipend')}</div>
            <div className="text-lg font-extrabold text-amber-300 mt-0.5">₹1,500 / mo</div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-[10px] uppercase font-bold text-slate-400">{t('placementAssistance', 'Placement Assistance')}</div>
            <div className="text-lg font-extrabold text-orange-400 mt-0.5">{t('activeLinkage', 'Active Linkage')}</div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Enrolled Courses & Skill Modules Progress */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Course Selector Pills (if multi-enrolled) */}
          {activeCourses.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold text-slate-500 shrink-0">Switch Course:</span>
              {activeCourses.map((crs, idx) => (
                <button
                  key={crs.id || idx}
                  onClick={() => setSelectedCourseIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                    selectedCourseIndex === idx
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {crs.nsqf_pack_name}
                </button>
              ))}
            </div>
          )}

          {/* Active Enrolled Course Progress Card */}
          <div className="clay-card p-6 bg-white border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    NSQF Level {currentActiveCourse.level} • {currentActiveCourse.sector || 'Skilling'}
                  </span>
                  <span className="text-xs text-slate-400">QP: {currentActiveCourse.code || 'AMH/Q0301'}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {currentActiveCourse.nsqf_pack_name}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-500">Overall Progress</span>
                <div className="text-2xl font-extrabold text-emerald-800">{currentProgress}%</div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>195 of 300 Hours Completed</span>
                <span>Batch: Pradhan Mantri Kaushal Kendra (PMKK)</span>
              </div>
            </div>

            {/* Skills Completed vs Skills Pending Matrix */}
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider mb-3 flex items-center justify-between">
                <span>Skills Completed vs Skills Pending</span>
                <span className="text-[11px] text-emerald-700 font-bold">2 of 4 Modules Completed</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentActiveCourse.modules.map((mod, idx) => {
                  const modName = typeof mod === 'string' ? mod : mod.name;
                  const isCompleted = typeof mod === 'object' ? mod.completed : (idx < 2);

                  return (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition flex items-start space-x-3 ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                          : 'border-slate-200 bg-slate-50/60 text-slate-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted 
                          ? 'bg-emerald-200 text-emerald-900' 
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold leading-snug">
                          {modName}
                        </div>
                        <div className="text-[10px] font-semibold mt-1 flex items-center justify-between">
                          <span className={isCompleted ? 'text-emerald-700' : 'text-slate-400'}>
                            {isCompleted ? '✓ Skill Verified' : '○ In-Progress / Pending'}
                          </span>
                          <span className="text-slate-400">Mod 0{idx + 1}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Training Center Details */}
            {currentActiveCourse.local_centers && currentActiveCourse.local_centers[0] && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-orange-600" />
                    <span>{currentActiveCourse.local_centers[0].name}</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Batch Time: 09:30 AM - 01:30 PM • Contact: {currentActiveCourse.local_centers[0].phone}
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-extrabold text-[11px] shrink-0">
                  {currentActiveCourse.local_centers[0].distance} away
                </span>
              </div>
            )}
          </div>

          {/* Recommended Next Actions Checklist */}
          <div className="clay-card p-6 bg-white border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {t('recommendedNextActions', 'Recommended Next Actions')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('nextActionsSub', 'Complete these items to unlock your direct job interview call and ₹15,000 tool kit grant.')}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {completedActionsCount} / {actionsChecklist.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {actionsChecklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleActionItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    item.completed
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      item.completed 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {item.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-xs font-bold truncate ${item.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {item.text}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0 ml-2">
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Job / Company Readiness & Hiring Partners */}
        <div className="lg:col-span-4 space-y-6">
          {/* Placement Readiness Card */}
          <div className="clay-card p-6 bg-[#fbfdfb] border-emerald-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-emerald-700" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {t('jobPlacementReadiness', 'Job Placement Readiness')}
                </h3>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                High Match
              </span>
            </div>

            {/* Circular / Large Score Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white text-center shadow-sm">
              <div className="text-3xl font-extrabold">{jobReadinessScore}%</div>
              <div className="text-xs font-semibold text-emerald-200 mt-0.5">
                {t('eligibleDrives', 'Eligible for Industry Placement Drives')}
              </div>
              <div className="text-[11px] text-emerald-100/80 mt-1">
                Avg. Starting Salary: ₹14,000 - ₹19,000 / month
              </div>
            </div>

            {/* Target Hiring Partners */}
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-2 tracking-wider">
                {t('matchingPartners', 'Matching Company Placement Partners')}
              </span>
              <div className="space-y-2">
                {(currentActiveCourse.hiring_partners || ["Raymond Ltd", "Shahi Exports", "Arvind Fashions", "Gokaldas Exports"]).map((comp, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 font-bold text-slate-800">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{comp}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {t('hiringNow', 'Hiring Now')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheme Tool Kit Grant Status */}
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950">
              <div className="font-extrabold text-orange-900 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>{t('freeToolkitReserved', 'Free Tool Kit Grant Reserved')}</span>
              </div>
              <p className="text-[11px] text-orange-800/90 mt-1">
                Upon passing the NSQF final assessment, you will receive a brand-new industrial toolkit at zero cost.
              </p>
            </div>
          </div>

          {/* Quick Help & Counsellor Card */}
          <div className="clay-card p-5 bg-white border-slate-200 text-xs space-y-3">
            <div className="font-bold text-slate-900 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Dedicated PM-AJAY Skill Mitra</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Need help with batch timing, transport subsidy, or documents? Connect with your local center counsellor.
            </p>
            <a 
              href="tel:1800112233" 
              className="block w-full py-2.5 text-center bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold rounded-xl transition"
            >
              📞 Call Toll-Free: 1800-11-2233
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
