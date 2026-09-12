import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';



const LANG_CODES = {
  hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', mr: 'mr-IN', 
  ta: 'ta-IN', ur: 'ur-IN', gu: 'gu-IN', kn: 'kn-IN', 
  or: 'or-IN', ml: 'ml-IN', pa: 'pa-IN', as: 'as-IN', en: 'en-US'
};

export default function VoiceInput({ label, value, onChangeText, fieldName, placeholder, multiline, language = 'hi' }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState(null); // null | 'ok' | 'invalid'
  const recognitionRef = useRef(null);

  const speakPrompt = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: label, language })
      });
      const data = await res.json();
      if (data.status === 'success' && data.audio_base64) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio_base64}`);
        audio.play();
      } else {
        console.error("TTS failed:", data.message);
      }
    } catch (err) {
      console.error('Error fetching TTS:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async (e) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('audio_file', audioBlob, 'recording.webm');
        formData.append('field_name', label);
        formData.append('language', language);

        try {
          const res = await fetch('http://localhost:8000/api/v1/voice/transcribe-field', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          
          if (data.valid === false) {
            // Backend flagged this as noise/unprocessable — don't write to form
            console.warn('[VoiceInput] Invalid transcription (noise/silence). Raw:', data.raw);
            setVoiceStatus('invalid');
            setTimeout(() => setVoiceStatus(null), 3000);
          } else if (data.text) {
            if (multiline) {
              onChangeText(value ? `${value} ${data.text}` : data.text);
            } else {
              onChangeText(data.text);
            }
            setVoiceStatus('ok');
            setTimeout(() => setVoiceStatus(null), 2000);
          }
        } catch (err) {
          console.error("Transcription error:", err);
          setVoiceStatus('invalid');
          setTimeout(() => setVoiceStatus(null), 3000);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to use voice input.");
    }
  };

  const stopRecording = (e) => {
    e.preventDefault();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
      <div className="flex items-start gap-3">
        {multiline ? (
          <textarea
            className="flex-1 w-full border border-gray-300 p-3 min-h-[120px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none resize-y"
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder || `Enter ${label}`}
          />
        ) : (
          <input
            type="text"
            className="flex-1 w-full border border-gray-300 p-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder || `Enter ${label}`}
          />
        )}
        
        <div className="flex gap-2 shrink-0">
          <button
            onClick={speakPrompt}
            className="w-12 h-12 flex items-center justify-center border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Read out loud"
          >
            <Volume2 className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-12 h-12 flex items-center justify-center border transition-colors ${
              isRecording 
                ? 'border-red-500 bg-red-50 hover:bg-red-100 text-red-600' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
            title={isRecording ? "Stop recording" : "Start recording"}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      {/* Voice feedback status */}
      {voiceStatus === 'invalid' && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <MicOff className="w-3 h-3" /> Could not understand audio — please try again or type your answer.
        </p>
      )}
      {voiceStatus === 'ok' && (
        <p className="text-xs text-emerald-600 mt-1">✓ Voice captured successfully</p>
      )}
    </div>
  );
}
