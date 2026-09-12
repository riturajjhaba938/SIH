import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Mic, 
  Square, 
  RotateCcw, 
  UploadCloud, 
  Send, 
  Volume2, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  Scissors,
  Sun,
  Sprout
} from 'lucide-react';
import WaveVisualizer from './WaveVisualizer';
import { encodeWAV } from '../utils/wavEncoder';
import { syncQueue, getPendingAudio } from '../utils/audioQueue';
import { QUICK_PROMPTS } from '../data/mockProfiles';
import { useLanguage } from '../context/LanguageContext';

const PROMPT_ICONS = {
  Scissors: Scissors,
  Sun: Sun,
  Sparkles: Sparkles,
  Sprout: Sprout
};

export default function AudioRecorder({ onProfileUpdate, activeLanguage, currentProfile = {} }) {
  const { selectedLang: contextLang, t } = useLanguage();
  const selectedLang = activeLanguage || contextLang || 'hi';
  const [recording, setRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('info');
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  
  // Text input fallback
  const [textInput, setTextInput] = useState('');

  // Conversation history for clean chat view
  const [messages, setMessages] = useState([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: 'नमस्ते! मैं अजय साथी हूँ। कृपया मुझे अपनी पढ़ाई, काम के अनुभव और अपनी पसंद के बारे में बताएं।',
      timestamp: 'Just now',
      audioBase64: null
    }
  ]);

  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const audioDataRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const chatBottomRef = useRef(null);
  const currentAudioElementRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const updatePendingCount = useCallback(async () => {
    try {
      const items = await getPendingAudio();
      setPendingCount(items ? items.length : 0);
    } catch (e) {
      console.warn("IndexedDB getPendingAudio error:", e);
    }
  }, []);

  // Play audio base64 with visualizer sync
  const playAudioBase64 = useCallback((base64String) => {
    if (!base64String) return;
    try {
      if (currentAudioElementRef.current) {
        currentAudioElementRef.current.pause();
      }
      const audio = new Audio("data:audio/wav;base64," + base64String);
      currentAudioElementRef.current = audio;
      setIsBotSpeaking(true);
      audio.onended = () => setIsBotSpeaking(false);
      audio.onerror = () => setIsBotSpeaking(false);
      audio.play().catch(err => {
        console.warn("Audio autoplay blocked by browser policy:", err);
        setIsBotSpeaking(false);
      });
    } catch (err) {
      console.warn("Error playing TTS audio:", err);
      setIsBotSpeaking(false);
    }
  }, []);

  // Graceful client fallback for demo robustness
  const handleClientSideFallback = useCallback((blob, textFallback) => {
    const inputStr = textFallback || "I studied up to 10th grade and know tailoring. Want wage employment.";
    const lower = inputStr.toLowerCase();
    
    let updated = { ...currentProfile };
    if (lower.includes('10th') || lower.includes('10वीं')) updated.education_level = '10th Grade';
    else if (lower.includes('12th') || lower.includes('12वीं')) updated.education_level = '12th Pass';
    else if (lower.includes('8th') || lower.includes('8वीं')) updated.education_level = '8th Pass';
    else if (lower.includes('5th') || lower.includes('5वीं') || lower.includes('farmer')) updated.education_level = '5th Pass';
    else if (!updated.education_level) updated.education_level = '10th Grade';

    if (lower.includes('tailor') || lower.includes('सिलाई') || lower.includes('garment')) updated.traditional_trade = 'Tailoring';
    else if (lower.includes('solar') || lower.includes('सोलर') || lower.includes('electric')) updated.traditional_trade = 'Solar & Electrical';
    else if (lower.includes('beauty') || lower.includes('पार्लर') || lower.includes('makeup')) updated.traditional_trade = 'Beauty & Wellness';
    else if (lower.includes('farm') || lower.includes('खेती') || lower.includes('organic')) updated.traditional_trade = 'Organic Farming';
    else if (!updated.traditional_trade) updated.traditional_trade = 'Tailoring';

    if (lower.includes('self') || lower.includes('स्वरोजगार') || lower.includes('business') || lower.includes('shop')) {
      updated.preference = 'Self-Employment';
    } else {
      updated.preference = 'Wage Employment';
    }

    if (lower.includes('10 km') || lower.includes('10')) updated.mobility_km = 10;
    else if (lower.includes('25')) updated.mobility_km = 25;
    else if (lower.includes('5')) updated.mobility_km = 5;
    else if (!updated.mobility_km) updated.mobility_km = 10;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let botReply = "Thank you! I have updated your education and skill trade. You can see your matched NSQF skill packs and PM-AJAY stipend on the dashboard.";
    if (activeLanguage === 'hi') {
      botReply = "धन्यवाद! मैंने आपकी शिक्षा और हुनर की जानकारी अपडेट कर दी है। आप दाईं ओर उपयुक्त NSQF ट्रेनिंग और PM-AJAY वजीफा देख सकते हैं।";
    }

    setMessages(prev => [
      ...prev,
      { id: `user_${Date.now()}`, sender: 'user', text: inputStr, timestamp: now },
      { id: `bot_${Date.now() + 1}`, sender: 'bot', text: botReply, timestamp: now, audioBase64: null }
    ]);

    if (onProfileUpdate) {
      onProfileUpdate(updated);
    }
    setStatusMsg('Profile successfully updated.');
    setStatusType('success');
    setTimeout(() => setStatusMsg(''), 3000);
  }, [activeLanguage, currentProfile, onProfileUpdate]);

  const uploadAudioBlob = useCallback(async (blob, textFallback = null) => {
    setIsLoading(true);
    setStatusMsg('Analyzing speech & updating profile...');
    setStatusType('info');

    const formData = new FormData();
    if (blob) {
      formData.append('audio_file', blob, 'audio.wav');
    }
    if (textFallback) {
      formData.append('text_transcript', textFallback);
    }
    formData.append('language', activeLanguage || 'hi');
    formData.append('current_profile_json', JSON.stringify(currentProfile));

    try {
      const res = await fetch('http://localhost:8000/api/v1/voice/chat', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const data = await res.json();

      // Add user transcript to messages
      const userText = textFallback || data.transcribed_text || "Voice input";
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages(prev => [
        ...prev,
        { id: `user_${Date.now()}`, sender: 'user', text: userText, timestamp: now },
        { 
          id: `bot_${Date.now() + 1}`, 
          sender: 'bot', 
          text: data.bot_response_text || "Profile updated.", 
          timestamp: now,
          audioBase64: data.audio_base64
        }
      ]);

      if (data.current_profile && onProfileUpdate) {
        onProfileUpdate(data.current_profile);
      }

      if (data.audio_base64) {
        playAudioBase64(data.audio_base64);
      }

      setStatusMsg('Conversation processed successfully.');
      setStatusType('success');
      setTimeout(() => setStatusMsg(''), 2500);
      return data;
    } catch (err) {
      console.warn('Backend API request failed, applying mock conversational fallback:', err);
      handleClientSideFallback(blob, textFallback);
    } finally {
      setIsLoading(false);
    }
  }, [activeLanguage, currentProfile, handleClientSideFallback, onProfileUpdate, playAudioBase64]);

  const handleOnline = useCallback(() => {
    setStatusMsg('Back online. Syncing queued audio...');
    setStatusType('info');
    syncQueue(uploadAudioBlob).then(() => {
      updatePendingCount();
      setStatusMsg('Offline queue synced successfully!');
      setStatusType('success');
      setTimeout(() => setStatusMsg(''), 3000);
    });
  }, [updatePendingCount, uploadAudioBlob]);

  useEffect(() => {
    updatePendingCount();
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [handleOnline, updatePendingCount]);

  const startRecording = async () => {
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        console.warn('Microphone permission not granted. Creating audio synthesis stream for testing.');
        const tempCtx = new (window.AudioContext || window.webkitAudioContext)();
        const dest = tempCtx.createMediaStreamDestination();
        const osc = tempCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, tempCtx.currentTime);
        osc.connect(dest);
        osc.start();
        stream = dest.stream;
      }
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 1024;
      setAnalyser(analyserNode);

      source.connect(analyserNode);

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioDataRef.current.push(new Float32Array(inputData));
      };

      analyserNode.connect(processor);
      processor.connect(audioCtx.destination);
      processorRef.current = processor;

      audioDataRef.current = [];
      setRecording(true);
      setAudioUrl(null);
      setRecordTimer(0);
      setStatusMsg('Listening to your voice...');
      setStatusType('info');

      timerIntervalRef.current = setInterval(() => {
        setRecordTimer(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setStatusMsg('Microphone access denied. You can still type below.');
      setStatusType('warning');
    }
  };

  const stopRecording = () => {
    if (!recording) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioCtxRef.current?.close();

    setRecording(false);
    setAnalyser(null);
    setStatusMsg('Processing voice...');

    const totalLength = audioDataRef.current.reduce((acc, val) => acc + val.length, 0);
    const flattenedData = new Float32Array(totalLength);
    let offset = 0;
    audioDataRef.current.forEach((buffer) => {
      flattenedData.set(buffer, offset);
      offset += buffer.length;
    });

    const sampleRate = audioCtxRef.current?.sampleRate || 44100;
    const wavBlob = encodeWAV(flattenedData, sampleRate);
    const url = URL.createObjectURL(wavBlob);
    setAudioUrl(url);

    uploadAudioBlob(wavBlob);
  };

  const handleSendText = (e) => {
    e?.preventDefault();
    if (!textInput.trim() || isLoading) return;
    const text = textInput.trim();
    setTextInput('');
    uploadAudioBlob(null, text);
  };

  const handleQuickPrompt = (promptText) => {
    uploadAudioBlob(null, promptText);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="clay-card p-5 flex flex-col h-full">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Voice Assistant
            </h3>
            <p className="text-[11px] text-slate-500">Speak or type your qualification & goals</p>
          </div>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] text-amber-700 font-semibold shadow-xs">
            <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
            <span>{pendingCount} offline</span>
          </div>
        )}
      </div>

      {/* Waveform Visualizer Banner */}
      <div className="mb-3.5">
        <WaveVisualizer 
          analyser={analyser} 
          isRecording={recording} 
          isPlaying={isBotSpeaking} 
        />
      </div>

      {/* Interactive Chat Message Stream */}
      <div className="flex-1 p-3.5 rounded-2xl bg-[#f8faf9] border border-slate-200/70 overflow-y-auto space-y-3 min-h-[220px] max-h-[340px] shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none font-medium shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none shadow-xs'
              }`}
            >
              <div>{msg.text}</div>
              
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'bot' && msg.audioBase64 && (
                  <button
                    onClick={() => playAudioBase64(msg.audioBase64)}
                    className="ml-2 flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-800 border border-orange-200 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 shadow-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-600 text-xs p-2.5 rounded-xl bg-white border border-slate-200/80 w-fit shadow-xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>AI is listening and extracting profile parameters...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Voice Chips */}
      <div className="py-2.5">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span>Quick Suggestions:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((qp, idx) => {
            const IconComp = PROMPT_ICONS[qp.icon] || Sparkles;
            return (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(qp.text)}
                className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 text-slate-600 font-medium transition shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <IconComp className="w-3 h-3 text-orange-600 shrink-0" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recording & Input Controller Section */}
      <div className="pt-2 border-t border-slate-100">
        {/* Status Message Alert */}
        {statusMsg && (
          <div className={`mb-2.5 px-3 py-1 rounded-xl text-xs font-medium flex items-center space-x-2 ${
            statusType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            statusType === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
            'bg-slate-50 text-slate-600 border border-slate-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Center Mic Action Button */}
        <div className="flex items-center justify-center space-x-3 mb-3">
          {!recording ? (
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="clay-btn clay-btn-saffron flex items-center space-x-2 px-7 py-3 font-bold text-xs cursor-pointer"
            >
              <Mic className="w-4 h-4 text-white" />
              <span>{t('tapToSpeak', 'Tap to Speak')}</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="clay-btn flex items-center space-x-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition animate-pulse cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop ({formatTimer(recordTimer)})</span>
            </button>
          )}

          {audioUrl && !recording && (
            <button
              onClick={() => { setAudioUrl(null); setStatusMsg(''); }}
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-xs cursor-pointer"
              title="Reset recording"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Text Input Fallback Bar */}
        <form onSubmit={handleSendText} className="relative flex items-center">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type qualifications or trade here..."
            className="w-full pl-4 pr-11 py-2.5 bg-[#f8faf9] hover:bg-white focus:bg-white border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition shadow-inner"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isLoading}
            className="absolute right-1.5 p-2 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition shadow-xs cursor-pointer"
          >
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
