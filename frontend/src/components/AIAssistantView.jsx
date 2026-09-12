import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  HeartHandshake, 
  User, 
  Bot, 
  HelpCircle,
  Play,
  Square
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const QUESTIONS = [
  {
    id: 'name_phone',
    step: 1,
    title: {
      en: 'Beneficiary Name & Contact',
      hi: 'लाभार्थी का नाम और संपर्क',
      bn: 'সুবিধাভোগীর নাম ও যোগাযোগ'
    },
    prompts: {
      en: 'Hello! What is your full name and mobile number?',
      hi: 'नमस्ते! आपका शुभ नाम क्या है और आपका मोबाइल नंबर क्या है?',
      bn: 'নমস্কার! আপনার পুরো নাম এবং মোবাইল নম্বর কী?',
      te: 'నమస్కారం! మీ పూర్తి పేరు మరియు మొబైల్ నంబర్ ఏమిటి?',
      ta: 'வணக்கம்! உங்கள் முழு பெயர் மற்றும் கைபேசி எண் என்ன?',
      mr: 'नमस्ते! आपले पूर्ण नाव आणि मोबाईल नंबर काय आहे?',
      gu: 'નમસ્તે! તમારું પૂરું નામ અને મોબાઇલ નંબર શું છે?',
      kn: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಏನು?'
    },
    field: 'name',
    quickOptions: {
      en: [
        { label: 'Ravi Kumar', value: 'Ravi Kumar' },
        { label: 'Sunita Devi', value: 'Sunita Devi' },
        { label: 'Anita Kumari', value: 'Anita Kumari' },
        { label: 'Mohan Lal', value: 'Mohan Lal' }
      ],
      hi: [
        { label: 'रवि कुमार', value: 'Ravi Kumar' },
        { label: 'सुनीता देवी', value: 'Sunita Devi' },
        { label: 'अनिता कुमारी', value: 'Anita Kumari' },
        { label: 'मोहन लाल', value: 'Mohan Lal' }
      ],
      bn: [
        { label: 'রবি কুমার', value: 'Ravi Kumar' },
        { label: 'সুনীতা দেবী', value: 'Sunita Devi' },
        { label: 'অনিতা কুমারী', value: 'Anita Kumari' },
        { label: 'মোহন লাল', value: 'Mohan Lal' }
      ]
    }
  },
  {
    id: 'location',
    step: 2,
    title: {
      en: 'District & Location',
      hi: 'जिला और स्थान',
      bn: 'জেলা ও অবস্থান'
    },
    prompts: {
      en: 'Which district and state do you live in? How far can you travel for training?',
      hi: 'आप किस जिले और राज्य में रहते हैं? आप प्रशिक्षण के लिए कितनी दूरी तक जा सकते हैं?',
      bn: 'আপনি কোন জেলা ও রাজ্যে বাস করেন? প্রশিক্ষণের জন্য আপনি কতদূর ভ্রমণ করতে পারেন?',
      te: 'మీరు ఏ జిల్లా మరియు రాష్ట్రంలో నివసిస్తున్నారు? శిక్షణ కోసం మీరు ఎంత దూరం ప్రయాణించగలరు?',
      ta: 'நீங்கள் எந்த மாவட்டம் மற்றும் மாநிலத்தில் வசிக்கிறீர்கள்? பயிற்சிக்காக நீங்கள் எவ்வளவு தூரம் பயணிக்க முடியும்?',
      mr: 'तुम्ही कोणत्या जिल्ह्यात आणि राज्यात राहता? प्रशिक्षणासाठी तुम्ही किती लांब प्रवास करू शकता?',
      gu: 'તમે કયા જિલ્લા અને રાજ્યમાં રહો છો? તાલીમ માટે તમે કેટલા અંતર સુધી મુસાફરી કરી શકો છો?',
      kn: 'ನೀವು ಯಾವ ಜಿಲ್ಲೆ ಮತ್ತು ರಾಜ್ಯದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ? ತರಬೇತಿಗಾಗಿ ನೀವು ಎಷ್ಟು ದೂರ ಪ್ರಯಾಣಿಸಬಹುದು?'
    },
    field: 'district',
    quickOptions: {
      en: [
        { label: 'Varanasi, UP (10 km)', value: 'Varanasi, UP', mobility: 10 },
        { label: 'Ranchi, Jharkhand (25 km)', value: 'Ranchi, Jharkhand', mobility: 25 },
        { label: 'Patna, Bihar (5 km)', value: 'Patna, Bihar', mobility: 5 },
        { label: 'Bhopal, MP (15 km)', value: 'Bhopal, MP', mobility: 15 }
      ],
      hi: [
        { label: 'वाराणसी, उप्र (10 किमी)', value: 'Varanasi, UP', mobility: 10 },
        { label: 'राँची, झारखंड (25 किमी)', value: 'Ranchi, Jharkhand', mobility: 25 },
        { label: 'पटना, बिहार (5 किमी)', value: 'Patna, Bihar', mobility: 5 },
        { label: 'भोपाल, मप्र (15 किमी)', value: 'Bhopal, MP', mobility: 15 }
      ],
      bn: [
        { label: 'বারাণসী, ইউপি (১০ কিমি)', value: 'Varanasi, UP', mobility: 10 },
        { label: 'রাঁচি, ঝাড়খণ্ড (২৫ কিমি)', value: 'Ranchi, Jharkhand', mobility: 25 },
        { label: 'পাটনা, বিহার (৫ কিমি)', value: 'Patna, Bihar', mobility: 5 },
        { label: 'ভোপাল, এমপি (১৫ কিমি)', value: 'Bhopal, MP', mobility: 15 }
      ]
    }
  },
  {
    id: 'education',
    step: 3,
    title: {
      en: 'Highest Education Level',
      hi: 'उच्चतम शिक्षा स्तर',
      bn: 'সর্বোচ্চ শিক্ষাগত যোগ্যতা'
    },
    prompts: {
      en: 'What is your highest level of formal education?',
      hi: 'आपकी उच्चतम शिक्षा क्या है?',
      bn: 'আপনার সর্বোচ্চ শিক্ষাগত যোগ্যতা কী?',
      te: 'మీ అత్యున్నత విద్యార్హత ఏమిటి?',
      ta: 'உங்கள் உயர்ந்த கல்வித் தகுதி என்ன?',
      mr: 'तुमचे सर्वोच्च शिक्षण काय आहे?',
      gu: 'તમારું સર્વોચ્ચ શિક્ષણ શું છે?',
      kn: 'ನಿಮ್ಮ ಅತ್ಯುನ್ನತ ಶಿಕ್ಷಣ ಯಾವುದು?'
    },
    field: 'education_level',
    quickOptions: {
      en: [
        { label: '5th Pass', value: '5th Pass' },
        { label: '8th Pass', value: '8th Pass' },
        { label: '10th Grade', value: '10th Grade' },
        { label: '12th Pass', value: '12th Pass' },
        { label: 'ITI / Diploma', value: 'ITI / Diploma' },
        { label: 'Graduate', value: 'Graduate' }
      ],
      hi: [
        { label: '5वीं पास', value: '5th Pass' },
        { label: '8वीं पास', value: '8th Pass' },
        { label: '10वीं पास', value: '10th Grade' },
        { label: '12वीं पास', value: '12th Pass' },
        { label: 'आईटीआई / डिप्लोमा', value: 'ITI / Diploma' },
        { label: 'स्नातक', value: 'Graduate' }
      ],
      bn: [
        { label: '৫ম শ্রেণী পাস', value: '5th Pass' },
        { label: '৮ম শ্রেণী পাস', value: '8th Pass' },
        { label: '১০ম শ্রেণী পাস', value: '10th Grade' },
        { label: '১২শ শ্রেণী পাস', value: '12th Pass' },
        { label: 'আইটিআই / ডিপ্লোমা', value: 'ITI / Diploma' },
        { label: 'স্নাতক', value: 'Graduate' }
      ]
    }
  },
  {
    id: 'current_skills',
    step: 4,
    title: {
      en: 'Current Skills & Trade Experience',
      hi: 'वर्तमान कौशल और अनुभव',
      bn: 'বর্তমান দক্ষতা ও অভিজ্ঞতা'
    },
    prompts: {
      en: 'What is your current trade or traditional craft experience?',
      hi: 'आप वर्तमान में क्या काम करते हैं या कौन सा हुनर जानते हैं?',
      bn: 'আপনি বর্তমানে কী কাজ করেন বা কোন ঐতিহ্যগত দক্ষতা জানেন?',
      te: 'మీ ప్రస్తుత వృత్తి లేదా నైపుణ్యం ఏమిటి?',
      ta: 'உங்கள் தற்போதைய தொழில் அல்லது பாரம்பரிய கைவினை அனுபவம் என்ன?',
      mr: 'तुमचा सध्याचा व्यवसाय किंवा पारंपारिक कला कोणती आहे?',
      gu: 'તમારો વર્તમાન વ્યવસાય અથવા પરંપરાગત કૌશલ્ય શું છે?',
      kn: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವೃತ್ತಿ ಅಥವಾ ಸಾಂಪ್ರದಾಯಿಕ ಕರಕುಶಲ ಅನುಭವ ಯಾವುದು?'
    },
    field: 'traditional_trade',
    quickOptions: {
      en: [
        { label: 'Tailoring & Stitching', value: 'Tailoring & Garments' },
        { label: 'Basic Electrical & Wiring', value: 'Solar & Electrical' },
        { label: 'Beauty & Parlour Care', value: 'Beauty & Wellness' },
        { label: 'Traditional Farming', value: 'Organic Farming' },
        { label: 'Two-Wheeler Repair', value: 'Electric Vehicle (EV)' }
      ],
      hi: [
        { label: 'सिलाई एवं कढ़ाई', value: 'Tailoring & Garments' },
        { label: 'बिजली व वायरिंग', value: 'Solar & Electrical' },
        { label: 'ब्यूटी पार्लर', value: 'Beauty & Wellness' },
        { label: 'पारंपरिक खेती', value: 'Organic Farming' },
        { label: 'गाड़ी रिपेयरिंग', value: 'Electric Vehicle (EV)' }
      ],
      bn: [
        { label: 'দর্জি ও সেলাই কাজ', value: 'Tailoring & Garments' },
        { label: 'বৈদ্যুতিক ও ওয়্যারিং', value: 'Solar & Electrical' },
        { label: 'বিউটি পার্লার', value: 'Beauty & Wellness' },
        { label: 'ঐতিহ্যবাহী চাষাবাদ', value: 'Organic Farming' },
        { label: 'দ্বিচক্র যান মেরামত', value: 'Electric Vehicle (EV)' }
      ]
    }
  },
  {
    id: 'interests',
    step: 5,
    title: {
      en: 'Interests & Training Goals',
      hi: 'रुचि और प्रशिक्षण लक्ष्य',
      bn: 'আগ্রহ ও প্রশিক্ষণ লক্ষ্য'
    },
    prompts: {
      en: 'Which modern skill or technical domain are you interested in learning?',
      hi: 'आप आगे कौन सा नया कौशल सीखना चाहते हैं जिसमें आपको रुचि है?',
      bn: 'আপনি ভবিষ্যতে কোন নতুন প্রযুক্তিগত দক্ষতা শিখতে আগ্রহী?',
      te: 'మీరు ఏ ఆధునిక నైపుణ్యాన్ని నేర్చుకోవడానికి ఆసక్తి చూపుతున్నారు?',
      ta: 'எந்த நவீன திறனைக் கற்றுக்கொள்ள நீங்கள் ஆர்வமாக உள்ளீர்கள்?',
      mr: 'तुम्हाला कोणते आधुनिक कौशल्य शिकण्यात रस आहे?',
      gu: 'તમને કયું આધુનિક કૌશલ્ય શીખવામાં રસ છે?',
      kn: 'ನೀವು ಯಾವ ಆಧುನಿಕ ಕೌಶಲ್ಯವನ್ನು ಕಲಿಯಲು ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಿ?'
    },
    field: 'interests',
    quickOptions: {
      en: [
        { label: 'Industrial Sewing & Quality Check', value: 'Industrial Sewing & Quality Inspection' },
        { label: 'Solar Panel Installation & PV', value: 'Solar Panel Technician' },
        { label: 'Electric Vehicle (EV) Maintenance', value: 'EV Two-Wheeler Servicing' },
        { label: 'Professional Cosmetology & Makeup', value: 'Beauty & Cosmetology' },
        { label: 'Organic Bio-Fertilizers & Green Farming', value: 'Organic Farming & Bio-Inputs' }
      ],
      hi: [
        { label: 'औद्योगिक सिलाई एवं गुणवत्ता जांच', value: 'Industrial Sewing & Quality Inspection' },
        { label: 'सोलर पैनल इंस्टॉलेशन', value: 'Solar Panel Technician' },
        { label: 'इलेक्ट्रिक वाहन (EV) सर्विसिंग', value: 'EV Two-Wheeler Servicing' },
        { label: 'प्रोफेशनल कॉस्मेटोलॉजी एवं मेकअप', value: 'Beauty & Cosmetology' },
        { label: 'जैविक खाद एवं प्राकृतिक खेती', value: 'Organic Farming & Bio-Inputs' }
      ],
      bn: [
        { label: 'শিল্প সেলাই ও মান নিয়ন্ত্রণ', value: 'Industrial Sewing & Quality Inspection' },
        { label: 'সোলার প্যানেল ইনস্টলেশন', value: 'Solar Panel Technician' },
        { label: 'ইলেকট্রিক ভেহিকল (EV) সার্ভিসিং', value: 'EV Two-Wheeler Servicing' },
        { label: 'পেশাদার কসমেটোলজি ও রূপচর্চা', value: 'Beauty & Cosmetology' },
        { label: 'জৈব সার ও পরিবেশবান্ধব কৃষি', value: 'Organic Farming & Bio-Inputs' }
      ]
    }
  },
  {
    id: 'preference',
    step: 6,
    title: {
      en: 'Career Preference',
      hi: 'करियर प्राथमिकता',
      bn: 'ক্যারিয়ার অগ্রাধিকার'
    },
    prompts: {
      en: 'What is your preference after training? A salaried job or starting your own business?',
      hi: 'प्रशिक्षण के बाद आपकी क्या प्राथमिकता है? कंपनी में पक्की नौकरी या अपना खुद का व्यवसाय?',
      bn: 'প্রশিক্ষণের পরে আপনার অগ্রাধিকার কী? একটি বেতনের চাকরি নাকি নিজস্ব ব্যবসা?',
      te: 'శిక్షణ తర్వాత మీ ప్రాధాన్యత ఏమిటి? ఉద్యోగమా లేదా సొంత వ్యాపారమా?',
      ta: 'பயிற்சிக்குப் பிறகு உங்கள் விருப்பம் என்ன? சம்பள வேலையா அல்லது சொந்த தொழிலா?',
      mr: 'प्रशिक्षणानंतर तुमची पसंती काय आहे? नोकरी की स्वतःचा व्यवसाय?',
      gu: 'તાલીમ પછી તમારી પસંદગી શું છે? પગારવાળી નોકરી કે પોતાનો વ્યવસાય?',
      kn: 'ತರಬೇತಿಯ ನಂತರ ನಿಮ್ಮ ಆದ್ಯತೆ ಏನು? ಸಂಬಳದ ಕೆಲಸ ಅಥವಾ ಸ್ವಂತ ವ್ಯಾಪಾರ?'
    },
    field: 'preference',
    quickOptions: {
      en: [
        { label: 'Salaried Job Placement', value: 'Wage Employment (Job)' },
        { label: 'Self-Employment / Micro-enterprise', value: 'Self-Employment (Micro-enterprise)' }
      ],
      hi: [
        { label: 'कंपनी में पक्की नौकरी', value: 'Wage Employment (Job)' },
        { label: 'खुद का व्यवसाय / स्वरोजगार', value: 'Self-Employment (Micro-enterprise)' }
      ],
      bn: [
        { label: 'বেতনের চাকরি', value: 'Wage Employment (Job)' },
        { label: 'স্বকর্মসংস্থান / ক্ষুদ্র উদ্যোগ', value: 'Self-Employment (Micro-enterprise)' }
      ]
    }
  }
];

export default function AIAssistantView({ 
  profile, 
  onUpdateProfile, 
  onProceedToRecommendations 
}) {
  const { selectedLang, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([]);
  const [tempProfile, setTempProfile] = useState({ ...profile });

  const recognitionRef = useRef(null);

  const langToSpeechCode = {
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    en: 'en-IN'
  };

  const currentQ = QUESTIONS[currentStep - 1] || QUESTIONS[0];
  const progressPercent = Math.round((currentStep / QUESTIONS.length) * 100);

  const getPromptText = (q) => {
    return q.prompts[selectedLang] || q.prompts['en'] || q.prompts['hi'];
  };

  const getTitleText = (q) => {
    return q.title[selectedLang] || q.title['en'] || q.title['hi'];
  };

  const getOptions = (q) => {
    return q.quickOptions[selectedLang] || q.quickOptions['en'] || q.quickOptions['hi'] || [];
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = langToSpeechCode[selectedLang] || 'en-IN';

      rec.onresult = (event) => {
        const text = event.results[event.resultIndex][0].transcript;
        setTranscript(text);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  // Read out prompt when step changes
  useEffect(() => {
    speakPrompt();
  }, [currentStep, selectedLang]);

  const speakPrompt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = getPromptText(currentQ);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langToSpeechCode[selectedLang] || 'en-IN';
      utterance.rate = 0.95;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript) {
        handleSaveAnswer(transcript);
      }
    } else {
      setTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.warn("Speech recognition error:", e);
        }
      } else {
        setIsRecording(true);
        setTimeout(() => {
          const sample = getOptions(currentQ)[0]?.label || "Sample";
          setTranscript(sample);
          setIsRecording(false);
          handleSaveAnswer(sample);
        }, 2000);
      }
    }
  };

  const handleSaveAnswer = (value, extraData = {}) => {
    const updated = {
      ...tempProfile,
      [currentQ.field]: value,
      ...extraData
    };
    setTempProfile(updated);
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    setConversation(prev => [
      ...prev,
      { sender: 'bot', text: getPromptText(currentQ) },
      { sender: 'user', text: value }
    ]);

    setTranscript('');

    if (currentStep < QUESTIONS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setConversation([]);
    setTranscript('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="clay-card p-6 border-emerald-300/80 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-600/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-white">
                  {t('aiTitle', 'Ajay Saathi AI Voice Assistant')}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  {t('liveAgent', 'Live Conversational Agent')}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {t('aiSub', 'Conversational skilling assessment designed for PM-AJAY beneficiaries. Answer in your language to discover tailored NSQF courses and DBT benefits.')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end md:self-center">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 flex items-center space-x-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('startOver', 'Start Over')}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-emerald-300">
              {t('question', 'Question')} {currentStep} {t('of', 'of')} {QUESTIONS.length}: {getTitleText(currentQ)}
            </span>
            <span className="font-extrabold text-white">{progressPercent}% {t('profileReady', 'Profile Ready')}</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question & Voice Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Active AI Question Box */}
        <div className="lg:col-span-7 clay-card p-6 sm:p-8 space-y-6 bg-white border-slate-200">
          {/* Question Audio Card - STRICTLY SINGLE LANGUAGE */}
          <div className="p-5 rounded-3xl bg-[#f0fdf4] border border-[#bbf7d0] relative">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                    {t('ajayAsks', 'Ajay Saathi Asks:')}
                  </span>
                  <p className="text-base font-extrabold text-emerald-950 mt-1 leading-snug">
                    {getPromptText(currentQ)}
                  </p>
                </div>
              </div>

              {/* Speak Question Button */}
              <button
                onClick={speakPrompt}
                className={`p-3 rounded-2xl transition-colors shrink-0 cursor-pointer ${
                  isSpeaking 
                    ? 'bg-emerald-600 text-white animate-pulse' 
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
                title={t('listenPrompt', 'Read question aloud')}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Voice Input Trigger Area */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
            <p className="text-xs text-slate-300 mb-4 font-medium">
              {isRecording 
                ? t('listeningNow', 'Listening to your voice... Speak your answer')
                : t('tapToSpeakPrompt', 'Tap microphone to speak your answer')
              }
            </p>

            <button
              onClick={handleToggleVoice}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white scale-110 ring-8 ring-red-500/30 animate-pulse'
                  : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white hover:scale-105 ring-4 ring-emerald-400/20'
              }`}
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            {transcript && (
              <div className="mt-4 p-3 bg-white/10 rounded-2xl text-xs text-emerald-200 border border-white/10 max-w-md w-full">
                <span className="font-bold text-white block mb-0.5">Recognized:</span>
                "{transcript}"
              </div>
            )}
          </div>

          {/* Quick Clickable Answer Chips (STRICTLY SINGLE LANGUAGE) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('orTapToSelect', 'Or tap to select one-click answer:')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {getOptions(currentQ).map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSaveAnswer(opt.value, opt.mobility ? { mobility_km: opt.mobility } : {})}
                  className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/70 transition text-left text-xs font-bold text-slate-800 hover:text-emerald-950 flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="truncate">{opt.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
            >
              ← {t('previousQ', 'Previous Question')}
            </button>

            {currentStep < QUESTIONS.length ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{t('nextQ', 'Next Question')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onProceedToRecommendations}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition flex items-center space-x-2 cursor-pointer animate-bounce"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('viewMyRecs', 'View My NSQF Skill Recommendations')} →</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Profile State */}
        <div className="lg:col-span-5 space-y-4">
          <div className="clay-card p-6 bg-[#fbfdfb] border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-700" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {t('liveProfileTitle', 'Beneficiary Live Profile')}
                </h3>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                {t('pmajayDossier', 'PM-AJAY Dossier')}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('fullName', 'Full Name')}:</span>
                <span className="font-bold text-slate-800">{tempProfile.name || 'Ravi Kumar'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('district', 'District')}:</span>
                <span className="font-bold text-slate-800">{tempProfile.district || 'Varanasi, UP'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('education', 'Highest Education')}:</span>
                <span className="font-bold text-slate-800">{tempProfile.education_level || '10th Grade'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('primarySkill', 'Primary Skill')}:</span>
                <span className="font-bold text-slate-800">{tempProfile.traditional_trade || 'Tailoring & Garments'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">{t('fieldOfInterest', 'Field of Interest')}:</span>
                <span className="font-bold text-slate-800">{tempProfile.interests || 'Industrial Sewing'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">{t('careerGoal', 'Career Goal')}:</span>
                <span className="font-bold text-emerald-800">{tempProfile.preference || 'Wage Employment'}</span>
              </div>
            </div>

            <button
              onClick={onProceedToRecommendations}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('exploreCentersCourses', 'Explore NSQF Courses & Centers')}</span>
            </button>
          </div>

          {/* Scheme Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-amber-900">
                {t('freeTrainingGuaranteeTitle', 'PM-AJAY 100% Free Training Guarantee')}
              </div>
              <p className="text-amber-800/90 mt-0.5">
                {t('freeTrainingGuaranteeDesc', 'All NSQF courses include monthly DBT stipend directly to your bank account, free professional toolkits, and placement assistance.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
