import React, { useState } from 'react';
import VoiceInput from './VoiceInput';

export default function Registration({ phone, onRegistrationSuccess }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    disability: '',
    primary_skill: '',
    field_of_interest: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
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
        onRegistrationSuccess();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      // Fallback for mock demo
      setTimeout(() => onRegistrationSuccess(), 1000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 mb-20 p-8 md:p-12 border border-slate-200 bg-white shadow-md rounded-2xl">
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h2 className="text-4xl heading-editorial mb-4 text-center">Complete Your Profile</h2>
        <p className="text-gray-600 text-center max-w-lg mx-auto">
          Use the speaker icon to hear the prompt, and the mic icon to speak your answer. You can also type normally.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <VoiceInput label="Full Name" fieldName="name" value={form.name} onChangeText={(t) => updateForm('name', t)} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VoiceInput label="Age" fieldName="age" value={form.age} onChangeText={(t) => updateForm('age', t)} />
          <VoiceInput label="Gender" fieldName="gender" value={form.gender} onChangeText={(t) => updateForm('gender', t)} />
        </div>

        <VoiceInput label="Disability Status" fieldName="disability" value={form.disability} onChangeText={(t) => updateForm('disability', t)} placeholder="e.g. None" />
        <VoiceInput label="Primary Skill you want to learn" fieldName="primary_skill" value={form.primary_skill} onChangeText={(t) => updateForm('primary_skill', t)} />
        <VoiceInput label="More Fields of Interest" fieldName="field_of_interest" value={form.field_of_interest} onChangeText={(t) => updateForm('field_of_interest', t)} />
        <VoiceInput 
          label="Describe more about interesting skills you want to learn" 
          fieldName="description" 
          value={form.description} 
          onChangeText={(t) => updateForm('description', t)} 
          multiline 
        />

        <div className="pt-8 mt-8 border-t border-gray-200">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#138808] text-white font-semibold py-4 hover:opacity-90 transition-opacity uppercase tracking-wider text-sm disabled:bg-gray-400 rounded-xl"
          >
            {loading ? 'Submitting...' : 'Submit Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
