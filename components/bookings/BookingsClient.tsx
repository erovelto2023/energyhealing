'use client';

import React, { useState, useRef } from 'react';
import { Heart, ShieldCheck, Sparkles, ArrowDown, Calendar } from 'lucide-react';
import BookingForm from '@/components/bookings/BookingForm';
import CustomBookingCalendar from '@/components/bookings/CustomBookingCalendar';

export default function BookingsClient() {
    const calendarRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

    const handleSelectDate = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(undefined);
    };

    const handleSelectTime = (time: string) => {
        setSelectedTime(time);

        // Scroll to form automatically for a smooth flow
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    const handleReset = () => {
        setSelectedDate(undefined);
        setSelectedTime(undefined);
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/serene_healing_background_1768420154686.png"
                        alt="Serene Healing Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
                </div>

                <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-widest mb-8 text-shadow-sm">
                        <Sparkles size={16} /> Transformational Healing
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 tracking-tight font-serif">
                        Book Your <span className="text-emerald-600 italic">Session</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Personalized energetic alignment designed to release chronic tension and restore your body's natural resonance.
                    </p>

                    <button
                        onClick={() => calendarRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="mt-12 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-xl mx-auto animate-bounce hover:text-emerald-600 transition-colors"
                    >
                        <ArrowDown size={24} />
                    </button>
                </div>
            </div>

            {/* Custom Calendar Section */}
            <section ref={calendarRef} className="py-24 bg-white scroll-mt-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">1. Choose Your Time</h2>
                        <p className="text-slate-500 font-light max-w-2xl mx-auto mb-2">
                            Select your preferred date and time slot below. Kathleen is based in PST.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Always shown in PST
                        </div>
                    </div>

                    <CustomBookingCalendar
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSelectDate={handleSelectDate}
                        onSelectTime={handleSelectTime}
                    />
                </div>
            </section>

            {/* Form Section */}
            <section ref={formRef} className="py-24 bg-slate-50 border-t border-slate-100 scroll-mt-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                            Step 2: Details
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Confirm Your Info</h2>
                        <p className="text-slate-500 font-light">
                            Please provide your contact information to finalize the booking.
                        </p>
                    </div>

                    <BookingForm
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSuccess={handleReset}
                    />
                </div>
            </section>

            {/* Trust Banner */}
            <section className="py-20 bg-white border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shadow-sm">
                                <Heart size={18} className="text-emerald-500" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-900 leading-none mb-1">Compassionate Care</p>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Holistic Roots</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shadow-sm">
                                <ShieldCheck size={18} className="text-emerald-500" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-900 leading-none mb-1">Confidential & Secure</p>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">Secure Practices</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shadow-sm">
                                <Calendar size={18} className="text-emerald-500" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-slate-900 leading-none mb-1">Easy Scheduling</p>
                                <p className="text-[10px] uppercase tracking-widest text-slate-400">PST Timezone Basis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Disclaimer Section */}
            <section className="py-20 max-w-4xl mx-auto px-6 text-center">
                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-slate-300">
                    <h4 className="text-white font-bold mb-4 flex items-center justify-center gap-2">
                        <ShieldCheck className="text-emerald-400" /> Professional Disclaimer
                    </h4>
                    <p className="text-sm leading-relaxed font-light">
                        Energy healing is a complementary therapy and does not replace professional medical or psychological advice, diagnosis, or treatment. Kathleen Heals does not practice medicine or prescribe medications.
                    </p>
                </div>
            </section>
        </div>
    );
}
