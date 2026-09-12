import React, { useState, useEffect, useCallback } from 'react';
import VoiceInput from './VoiceInput';
import { useTranslation } from '../contexts/TranslationContext';
import { MapPin, Loader2, Navigation } from 'lucide-react';

export default function Registration({ phone, onRegistrationSuccess }) {
  const { t, selectedLang, isTranslating } = useTranslation();
  
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem(`registration_data_${phone}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch(e) {}
    }
    return {
      name: '',
      age: '',
      gender: '',
      disability: '',
      primary_skill: '',
      field_of_interest: '',
      description: '',
      pincode: '',
      district: '',
    };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(`registration_data_${phone}`, JSON.stringify(form));
  }, [form, phone]);

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const [locationLoading, setLocationLoading] = useState(false);

  const resolvePincode = useCallback(async (pin) => {
    if (!pin || pin.length !== 6) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/location/resolve-pincode?pincode=${pin}`);
      const data = await res.json();
      if (data.status === 'success' && data.district) {
        updateForm('district', data.district);
      }
    } catch (e) {
      console.error("Error resolving pincode:", e);
    }
  }, []);

  useEffect(() => {
    if (form.pincode && form.pincode.length === 6) {
      resolvePincode(form.pincode);
    }
  }, [form.pincode, resolvePincode]);

  const handleGetLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`http://localhost:8000/api/v1/location/reverse-geocode?lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        if (data.status === 'success' && data.pincode) {
          updateForm('pincode', data.pincode);
        } else {
          alert("Could not determine PIN code from location.");
        }
      } catch (error) {
        console.error("Location error:", error);
      } finally {
        setLocationLoading(false);
      }
    }, (err) => {
      alert("Unable to retrieve your location (Timed out or denied). Please enter PIN manually.");
      setLocationLoading(false);
    }, { timeout: 7000, enableHighAccuracy: false, maximumAge: 60000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone })
      });
      const data = await res.json();
      if (data.status === 'success' || res.ok) {
        if(onRegistrationSuccess) onRegistrationSuccess();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      // Fallback for mock demo
      setTimeout(() => { if(onRegistrationSuccess) onRegistrationSuccess(); }, 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 mb-8">
      <div className="clay-card bg-white p-6 md:p-8">
        <div className="mb-8 border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t("Complete Your Profile")}</h2>
            <p className="text-slate-500 text-sm max-w-lg">
              {t("Use the speaker icon to hear the prompt, and the mic icon to speak your answer. You can also type normally.")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <VoiceInput language={selectedLang} label={t("Full Name")} fieldName="name" value={form.name} onChangeText={(text) => updateForm('name', text)} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VoiceInput language={selectedLang} label={t("Age")} fieldName="age" value={form.age} onChangeText={(text) => updateForm('age', text)} />
            <VoiceInput language={selectedLang} label={t("Gender")} fieldName="gender" value={form.gender} onChangeText={(text) => updateForm('gender', text)} />
          </div>

          <div className="bg-[#f8faf9] p-4 rounded-xl border border-slate-200 mb-6 space-y-4">
            <div className="flex items-center space-x-2 text-slate-800 font-bold mb-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>{t("Location Information")}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t("PIN Code")}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    className="flex-1 w-full border border-gray-300 p-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none"
                    value={form.pincode}
                    onChange={(e) => updateForm('pincode', e.target.value)}
                    placeholder="Enter 6-digit PIN"
                  />
                  <button
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="flex items-center justify-center border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors p-3 px-4 font-bold text-sm h-[50px]"
                    title="Use GPS Location"
                  >
                    {locationLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Navigation className="w-5 h-5 mr-2" />}
                    {t("Auto Detect")}
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-900 mb-2">{t("District (Auto-filled)")}</label>
                <input
                  type="text"
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 p-3 text-slate-600 rounded-none cursor-not-allowed"
                  value={form.district || ''}
                  placeholder="Waiting for PIN Code..."
                />
              </div>
            </div>
          </div>

          <VoiceInput language={selectedLang} label={t("Disability Status")} fieldName="disability" value={form.disability} onChangeText={(text) => updateForm('disability', text)} placeholder={t("e.g. None")} />
          <VoiceInput language={selectedLang} label={t("Primary Skill you want to learn")} fieldName="primary_skill" value={form.primary_skill} onChangeText={(text) => updateForm('primary_skill', text)} />
          <VoiceInput language={selectedLang} label={t("More Fields of Interest")} fieldName="field_of_interest" value={form.field_of_interest} onChangeText={(text) => updateForm('field_of_interest', text)} />
          <VoiceInput 
            language={selectedLang}
            label={t("Describe more about interesting skills you want to learn")} 
            fieldName="description" 
            value={form.description} 
            onChangeText={(text) => updateForm('description', text)} 
            multiline 
          />

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading || isTranslating}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition shadow-sm uppercase tracking-wider text-sm disabled:bg-slate-300"
            >
              {loading ? t('Submitting...') : isTranslating ? t('Translating...') : t('Submit Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
