'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { User, Mail, Users, Calendar, Phone } from 'lucide-react';

export default function BookPage() {
  const params = useSearchParams();
  const dahabiyaId = params?.get('dahabiyaId') ?? null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      dahabiyaId: formData.get('dahabiyaId'),
      name: formData.get('name'),
      email: formData.get('email'),
      guests: parseInt(formData.get('guests') as string),
      date: formData.get('date'),
      phone: formData.get('phone'),
    };

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage('Booking saved successfully!');
      } else {
        setMessage(result.error || 'Failed to save booking.');
      }
    } catch {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pharaonic-container py-12 px-4">
      {/* Pharaonic Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='0.4'%3E%3Cpath d='M40 40l20-20v40l-20-20zm-20 0l20 20V20l-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Pharaonic Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-ocean-blue/30">
              {/* Egyptian Pharaoh Crown */}
              <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 30 Q8 20 12 15 Q20 8 20 8 Q20 8 28 15 Q32 20 32 30 Z"
                      fill="url(#book-crown-gradient)" stroke="#0080ff" strokeWidth="1.5"/>
                <circle cx="15" cy="18" r="1" fill="#3399ff"/>
                <circle cx="20" cy="15" r="1" fill="#3399ff"/>
                <circle cx="25" cy="18" r="1" fill="#3399ff"/>
                <circle cx="20" cy="8" r="1.5" fill="#3399ff"/>
                <defs>
                  <linearGradient id="book-crown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="50%" stopColor="#F0F0F0"/>
                    <stop offset="100%" stopColor="#E0E0E0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-text-primary mb-4 font-serif">
            𓊪𓈖𓇳 Royal Nile Booking 𓇳𓈖𓊪
          </h1>
          <p className="text-xl text-text-primary font-medium">
            Secure Your Passage Through the Waters of Eternity
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-8 p-6 bg-white to-emerald-500 text-text-primary rounded-2xl shadow-lg border-2 border-green-600">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">𓇳</span>
              <span className="font-bold text-lg">{message}</span>
              <span className="text-2xl">𓇳</span>
            </div>
          </div>
        )}

        {/* Pharaonic Obelisk Form Container */}
        <div className="relative">
          <div className="bg-white via-white to-deep-blue-200 rounded-t-full mx-8 pt-8 pb-12 shadow-2xl border-4 border-ocean-blue/30">
            {/* Obelisk Top */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white to-deep-blue-500 rotate-45 border-2 border-ocean-blue/30 shadow-lg"></div>

            {/* Hieroglyphic Decorations */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-4 left-4 text-6xl">𓂀</div>
              <div className="absolute top-4 right-4 text-6xl">𓃭</div>
              <div className="absolute top-20 left-8 text-4xl">𓊪</div>
              <div className="absolute top-20 right-8 text-4xl">𓈖</div>
              <div className="absolute bottom-20 left-4 text-4xl">𓋹</div>
              <div className="absolute bottom-20 right-4 text-4xl">𓌻</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-8 relative z-10">
              <input type="hidden" name="dahabiyaId" value={dahabiyaId || ''} />

              {/* Full Name */}
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-white to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-text-primary" />
                  </div>
                  <label className="text-lg font-bold text-text-primary font-serif">
                    𓂀 Royal Name 𓂀
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white/95 border-2 border-ocean-blue/30 rounded-xl text-text-primary font-medium focus:border-ocean-blue/30 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-inner"
                    placeholder="Enter your royal name..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-primary">𓊪</div>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-white to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-text-primary" />
                  </div>
                  <label className="text-lg font-bold text-text-primary font-serif">
                    𓈖 Royal Scroll Address 𓈖
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white/95 border-2 border-ocean-blue/30 rounded-xl text-text-primary font-medium focus:border-ocean-blue/30 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-inner"
                    placeholder="your.royal@email.com"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-primary">𓇳</div>
                </div>
              </div>

              {/* Number of Guests */}
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-white to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-text-primary" />
                  </div>
                  <label className="text-lg font-bold text-text-primary font-serif">
                    𓃭 Royal Entourage 𓃭
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="guests"
                    min="1"
                    required
                    className="w-full px-4 py-3 bg-white/95 border-2 border-ocean-blue/30 rounded-xl text-text-primary font-medium focus:border-ocean-blue/30 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-inner"
                    placeholder="Number of royal guests..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-primary">𓊽</div>
                </div>
              </div>

              {/* Date */}
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-white to-pink-600 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-text-primary" />
                  </div>
                  <label className="text-lg font-bold text-text-primary font-serif">
                    𓋹 Date 𓋹
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full px-4 py-3 bg-white/95 border-2 border-ocean-blue/30 rounded-xl text-text-primary font-medium focus:border-ocean-blue/30 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-primary">𓌻</div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="relative">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-white to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Phone className="w-5 h-5 text-text-primary" />
                  </div>
                  <label className="text-lg font-bold text-text-primary font-serif">
                    𓊪 Royal Communication 𓊪
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-3 bg-white/95 border-2 border-ocean-blue/30 rounded-xl text-text-primary font-medium focus:border-ocean-blue/30 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-inner"
                    placeholder="Your royal contact number..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-primary">𓈖</div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-white via-white to-deep-blue-600 hover:from-ocean-blue-700 hover:via-blue-600 hover:to-deep-blue-700 disabled:bg-white text-text-primary font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-2xl border-2 border-ocean-blue/30 text-lg font-serif disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center space-x-3">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Inscribing Your Royal Booking...</span>
                      </>
                    ) : (
                      <>
                        <span>𓇳</span>
                        <span>Secure Royal Passage</span>
                        <span>𓇳</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>

          {/* Obelisk Base */}
          <div className="bg-white to-deep-blue-400 mx-4 h-8 rounded-b-lg shadow-xl border-4 border-ocean-blue/30 border-t-0">
            <div className="flex justify-center items-center h-full space-x-4 text-text-primary">
              <span className="text-2xl">𓊪</span>
              <span className="font-bold font-serif">ROYAL BOOKING OBELISK</span>
              <span className="text-2xl">𓊪</span>
            </div>
          </div>

          {/* Decorative Base Platform */}
          <div className="bg-white to-deep-blue-600 mx-2 h-4 rounded-b-xl shadow-2xl border-4 border-ocean-blue/30 border-t-0"></div>

          {/* Ground Shadow */}
          <div className="bg-white mx-0 h-2 rounded-full blur-sm"></div>
        </div>

        {/* Floating Hieroglyphic Elements - Removed black symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
        </div>
      </div>
    </div>
  );
}