import React from 'react';
import { 
  Home, 
  Mic, 
  UserCheck, 
  BookOpen, 
  Building2, 
  MapPin, 
  FileText, 
  HelpCircle, 
  RefreshCw,
  ShieldCheck, 
  Award,
  Briefcase,
  Sparkles,
  LogIn
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import mainLogo from '../assets/2-logo.png';

export default function Sidebar({ 
  activeSection, 
  onSelectSection, 
  onOpenReport, 
  onResetAll, 
  onOpenHelp,
  onOpenAuth,
  onLogout,
  courseCount = 5,
  centerCount = 4
}) {
  const { t, selectedLang } = useLanguage();

  const primaryServices = [
    { id: 'courses', labelKey: 'courses', defaultLabel: 'Recommended NSQF Packs', icon: BookOpen, badge: courseCount, color: 'text-emerald-800 bg-emerald-100' },
    { id: 'my_learning', labelKey: 'my_learning', defaultLabel: 'Personal Dashboard', icon: Briefcase, badge: 'Live', color: 'text-orange-800 bg-orange-100' },
    { id: 'subsidies', labelKey: 'subsidies', defaultLabel: 'PM-AJAY Subsidies', icon: Building2, badge: selectedLang === 'hi' ? 'अनुदान' : selectedLang === 'bn' ? 'ভর্তুকি' : 'Grants', color: 'text-amber-800 bg-amber-100' },
    { id: 'centers', labelKey: 'centers', defaultLabel: 'Training Centers', icon: MapPin, badge: centerCount, color: 'text-slate-800 bg-slate-100' },
  ];

  const tools = [
    { id: 'home', labelKey: 'home', defaultLabel: 'Overview Dashboard', icon: Home },
    { id: 'assistant', labelKey: 'assistant', defaultLabel: 'AI Voice Profiler', icon: Mic, badge: selectedLang === 'hi' ? 'वॉयस' : selectedLang === 'bn' ? 'ভয়েস' : 'Voice' },
    { id: 'profile', labelKey: 'profile', defaultLabel: 'Beneficiary Profile', icon: UserCheck },
  ];

  return (
    <aside className="w-68 bg-white/95 backdrop-blur-md border border-slate-200/80 flex flex-col justify-between py-5 px-4 shrink-0 hidden lg:flex rounded-3xl my-4 ml-4 shadow-sm">
      {/* Brand & Mission */}
      <div>
        <div 
          className="flex items-center space-x-3 px-2 mb-6 cursor-pointer group" 
          onClick={() => onSelectSection('home')}
        >
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/90 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden shrink-0">
            <img 
              src={mainLogo} 
              alt="Ajay Saathi Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-[17px] tracking-tight text-slate-900 leading-tight">
                Ajay Saathi
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <p className="text-[11px] text-orange-700 font-semibold tracking-tight truncate">
              PM-AJAY Voice AI Hub
            </p>
          </div>
        </div>

        {/* SECTION 1: KEY SCHEME DIRECTORIES */}
        <div className="mb-5">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 px-3 mb-2 tracking-wider flex items-center justify-between">
            <span>{t('schemeServices', 'Scheme Services')}</span>
            <span className="text-[9px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded font-bold">
              {t('directAccess', 'Direct Access')}
            </span>
          </div>
          <nav className="space-y-1.5">
            {primaryServices.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const label = t(item.labelKey, item.defaultLabel);
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-100/90 text-emerald-950 font-extrabold border border-emerald-300 shadow-xs ring-1 ring-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="truncate">{label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                      isActive ? 'bg-emerald-200 text-emerald-900' : item.color || 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SECTION 2: BENEFICIARY TOOLS & PROFILER */}
        <div className="mb-4">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 px-3 mb-2 tracking-wider">
            {t('workspace', 'AI Assistant & Workspace')}
          </div>
          <nav className="space-y-1.5">
            {tools.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const label = t(item.labelKey, item.defaultLabel);
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-bold border border-slate-300 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-800' : 'text-slate-400'}`} />
                    <span>{label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Auth Trigger */}
        <div className="mb-3">
          <button
            onClick={onLogout || onOpenAuth}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-rose-50 hover:text-rose-800 hover:border-rose-200 border border-slate-200 transition cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center space-x-2">
              <LogIn className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600" />
              <span>{t('logout', 'Switch User / Logout')}</span>
            </div>
            <span className="text-[9px] bg-slate-200 text-slate-700 group-hover:bg-rose-100 group-hover:text-rose-800 px-1.5 py-0.5 rounded font-extrabold">
              Exit
            </span>
          </button>
        </div>

        {/* Assessment Card Quick Action */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={onOpenReport}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition cursor-pointer shadow-xs group"
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>{t('assessmentDossier', 'Assessment Dossier')}</span>
            </div>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-orange-700 shadow-2xs font-semibold">
              PDF Card
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Session Info & Ministry Badge */}
      <div className="space-y-1.5 pt-3 border-t border-slate-100">
        <button
          onClick={onOpenHelp}
          className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100/70 transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>{t('helpGuidelines', 'Help & Guidelines')}</span>
        </button>

        <button
          onClick={onResetAll}
          className="w-full flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-orange-600 hover:bg-orange-50/60 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          <span>{t('resetSession', 'Reset Session')}</span>
        </button>

        {/* Ministry Insignia Badge with subtle tricolor top accent */}
        <div className="mt-3 p-2.5 rounded-2xl bg-[#f8faf9] border border-slate-200/80 text-[10px] text-slate-600 flex items-center space-x-2.5 relative overflow-hidden">
          <div className="w-1 absolute top-0 left-0 bottom-0 bg-gradient-to-b from-orange-500 via-white to-emerald-600" />
          <div className="w-6 h-6 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0 ml-1">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-slate-800 block">{t('govtOfIndia', 'Govt. of India')}</span>
            <span className="text-[10px] text-slate-500">{t('ministry', 'Min. of Social Justice & Empowerment')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
