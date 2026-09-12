import React, { useState, useRef, useEffect } from 'react';
import { 
  Languages, 
  ChevronDown, 
  Mic, 
  Bell, 
  Search,
  Award,
  User,
  Zap,
  Sparkles,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, DEMO_PERSONAS } from '../data/mockProfiles';
import mainLogo from '../assets/2-logo.png';

const PERSONA_ICONS = {
  User: User,
  Zap: Zap,
  Sparkles: Sparkles,
  Sprout: Sprout
};

export default function Navbar({ 
  selectedLang, 
  onSelectLang, 
  onLoadPersona, 
  isOnline, 
  currentProfile,
  onSearchSubmit
}) {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const langMenuRef = useRef(null);
  const personaMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
      if (personaMenuRef.current && !personaMenuRef.current.contains(event.target)) {
        setShowPersonaMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5">
        {/* Tricolor subtle Indian flag top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-amber-200 to-emerald-600" />

        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile / Tablet Logo View */}
          <div className="flex items-center space-x-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-2xs overflow-hidden shrink-0">
              <img 
                src={mainLogo} 
                alt="Ajay Saathi Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 leading-none">
                Ajay Saathi
              </span>
              <span className="text-[10px] text-orange-700 font-semibold">
                PM-AJAY Voice AI
              </span>
            </div>
          </div>

          {/* Center Search / Prompt Bar with saffron & emerald focus */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden sm:block">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-emerald-700">
                <Mic className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything... (e.g. 10th pass tailoring, PM-AJAY stipend, training centers)"
                className="w-full pl-10 pr-10 py-2 bg-[#f8faf9] hover:bg-white focus:bg-white border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Right Controls Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => { setShowLangMenu(!showLangMenu); setShowPersonaMenu(false); }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-xs cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentLangObj.name.split(' ')[0]}</span>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded">
                  {currentLangObj.short}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 max-h-60 overflow-y-auto">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 tracking-wider">
                    Language / भाषा
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLang(lang.code);
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

            {/* Offline Sync / Notification Bell */}
            <div className="relative">
              <div 
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs cursor-pointer hover:bg-slate-50"
                title={isOnline ? "System Online" : "System Offline"}
              >
                <Bell className="w-4 h-4" />
                <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              </div>
            </div>

            {/* User Persona Chip */}
            <div className="relative" ref={personaMenuRef}>
              <button
                onClick={() => { setShowPersonaMenu(!showPersonaMenu); setShowLangMenu(false); }}
                className="flex items-center space-x-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {currentProfile?.name || 'Ramesh Kumar'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {currentProfile?.district || 'Varanasi, UP'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2.5 py-1 tracking-wider">
                    Select Test Persona
                  </div>
                  {DEMO_PERSONAS.map((persona) => {
                    const PersonaIcon = PERSONA_ICONS[persona.iconName] || User;
                    return (
                      <button
                        key={persona.id}
                        onClick={() => {
                          onLoadPersona(persona);
                          setShowPersonaMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-emerald-50/60 transition flex items-start space-x-2.5 text-xs cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0 mt-0.5">
                          <PersonaIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-800">{persona.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {persona.profile.traditional_trade} • {persona.district}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-700" />
              <span>How PM-AJAY Voice AI Works</span>
            </h3>
            
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="p-3.5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs">1</span>
                <div>
                  <strong className="text-slate-900">Speak Naturally in Your Language</strong>
                  <p className="text-xs text-slate-600 mt-0.5">Press the microphone button and talk about your education, current trade, and work preference in Hindi, English, or regional languages.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fff7ed] border border-[#fed7aa] flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center text-xs">2</span>
                <div>
                  <strong className="text-slate-900">Slot-Filling AI & Skill Gap Assessment</strong>
                  <p className="text-xs text-slate-600 mt-0.5">The conversational agent extracts parameters (trade, education, mobility) and asks follow-up questions for missing details.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#f8faf9] border border-slate-200 flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs">3</span>
                <div>
                  <strong className="text-slate-900">NSQF Course Recommendations & Stipends</strong>
                  <p className="text-xs text-slate-600 mt-0.5">Matched NSQF-aligned courses, local training hubs, stipends (₹1,500/mo), and toolkits are displayed in the dashboard.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
