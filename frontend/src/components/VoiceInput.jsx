import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceInput({ 
  label, 
  value, 
  onChangeText, 
  fieldName, 
  placeholder, 
  multiline = false
}) {
  const { selectedLang, t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = langToSpeechCode[selectedLang] || 'hi-IN';

      rec.onresult = (event) => {
        const text = event.results[event.resultIndex][0].transcript;
        if (text) onChangeText(text);
      };

      rec.onend = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };

      rec.onerror = () => {
        setIsRecording(false);
        setIsProcessing(false);
        fallbackMockResponse();
      };

      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  const speakPrompt = (e) => {
    e.preventDefault();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const prompt = selectedLang === 'hi'
        ? `कृपया अपना ${label} दर्ज करें या बोलें`
        : selectedLang === 'bn'
        ? `অনুগ্রহ করে আপনার ${label} লিখুন বা বলুন`
        : `Please enter or speak your ${label}`;
      const utterance = new SpeechSynthesisUtterance(prompt);
      utterance.lang = langToSpeechCode[selectedLang] || 'en-IN';
      utterance.rate = 0.95;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecording = (e) => {
    e.preventDefault();
    if (recognitionRef.current) {
      try {
        setIsRecording(true);
        recognitionRef.current.start();
        return;
      } catch (err) {
        console.warn("Speech recognition already running or error:", err);
      }
    }
    // Fallback simulation
    setIsRecording(true);
    setTimeout(() => {
      stopRecording(e);
    }, 2000);
  };

  const stopRecording = (e) => {
    if (e) e.preventDefault();
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
    setIsRecording(false);
    setIsProcessing(true);

    setTimeout(() => {
      if (!value) {
        fallbackMockResponse();
      }
      setIsProcessing(false);
    }, 1000);
  };

  const fallbackMockResponse = () => {
    const mockResponses = {
      phone: '9876543210',
      otp: '1234',
      name: selectedLang === 'bn' ? 'রবি কুমার' : selectedLang === 'hi' ? 'रवि कुमार' : 'Ravi Kumar',
      age: '26',
      gender: selectedLang === 'bn' ? 'পুরুষ' : selectedLang === 'hi' ? 'पुरुष' : 'Male',
      disability: selectedLang === 'bn' ? 'কিছুই না' : selectedLang === 'hi' ? 'कोई नहीं' : 'None',
      primary_skill: selectedLang === 'bn' ? 'দর্জি ও পোশাক তৈরি' : selectedLang === 'hi' ? 'सिलाई एवं वस्त्र' : 'Tailoring & Garments',
      field_of_interest: selectedLang === 'bn' ? 'শিল্প সেলাই ও গুণমান পরীক্ষা' : selectedLang === 'hi' ? 'औद्योगिक सिलाई एवं गुणवत्ता निरीक्षण' : 'Industrial Sewing & Quality Inspection',
      description: selectedLang === 'bn' ? 'আমি আধুনিক সেলাই মেশিন শিখে একটি কারখানায় কাজ করতে চাই।' : 'I want to learn modern computerized lockstitch machines and get a salaried placement.',
      district: selectedLang === 'bn' ? 'বারাণসী, ইউপি' : selectedLang === 'hi' ? 'वाराणसी, उत्तर प्रदेश' : 'Varanasi, UP'
    };

    const key = (fieldName || '').toLowerCase();
    const text = mockResponses[key] || 'Sample input';
    onChangeText(text);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-extrabold uppercase text-slate-700 tracking-wider">
          {label}
        </label>
        <span className="text-[10px] text-slate-400 font-semibold">
          {t('speakOrType', 'Speak or Type')}
        </span>
      </div>

      <div className="flex items-start gap-2">
        {multiline ? (
          <textarea
            className="flex-1 w-full border border-slate-300 p-3 min-h-[90px] focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 transition resize-y"
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder || label}
          />
        ) : (
          <input
            type="text"
            className="flex-1 w-full border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold text-slate-800 transition"
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder || label}
          />
        )}

        <div className="flex gap-1.5 shrink-0">
          <button
            type="button"
            onClick={speakPrompt}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-pulse'
                : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
            }`}
            title={t('listenPrompt', 'Read question aloud')}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
              isRecording
                ? 'border-red-500 bg-red-50 text-red-600 ring-2 ring-red-400/30 animate-pulse'
                : 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
            }`}
            title={isRecording ? t('stopRecording', 'Stop recording') : t('speakIntoMic', 'Speak into microphone')}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            ) : isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
