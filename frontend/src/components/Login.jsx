import React, { useState } from 'react';
import VoiceInput from './VoiceInput';

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [error, setError] = useState('');

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }
    
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStep('OTP');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      // Fallback for mock demo
      setStep('OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await res.json();
      if (data.status === 'success') {
        onLoginSuccess(phone);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      // Fallback for mock demo
      if (otp === '1234') onLoginSuccess(phone);
      else setError('Invalid OTP. Try 1234.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-slate-200 bg-white shadow-md rounded-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl heading-editorial mb-3">PM-AJAY</h1>
        <p className="text-gray-500 uppercase tracking-widest text-sm">Voice Registration</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {step === 'PHONE' ? (
        <form onSubmit={handleRequestOtp}>
          <VoiceInput
            label="Phone Number"
            fieldName="phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your 10-digit number"
          />
          <button 
            type="submit"
            className="w-full bg-[#138808] text-white font-semibold py-4 hover:opacity-90 transition-opacity uppercase tracking-wider text-sm mt-4"
          >
            Get OTP
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <VoiceInput
            label="OTP (One Time Password)"
            fieldName="otp"
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 4-digit OTP (Try 1234)"
          />
          <button 
            type="submit"
            className="w-full bg-[#138808] text-white font-semibold py-4 hover:opacity-90 transition-opacity uppercase tracking-wider text-sm mt-4 rounded-xl"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
}
