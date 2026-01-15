'use client';

import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, startOfToday } from 'date-fns';
import { Clock, Calendar as CalendarIcon, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

// Enhanced Clean Styles for DayPicker
const dayPickerStyles = `
  .rdp {
    --rdp-cell-size: 52px;
    --rdp-accent-color: #059669;
    --rdp-background-color: #f0fdf4;
    --rdp-accent-color-dark: #065f46;
    margin: 0;
  }
  
  .rdp-months { justify-content: center; }
  
  .rdp-month_caption {
    margin-bottom: 2rem;
    padding: 0 1rem;
    color: #0f172a;
    font-weight: 800;
    font-size: 1.125rem;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .rdp-nav {
    display: flex;
    gap: 0.5rem;
  }

  .rdp-nav_button {
    width: 32px !important;
    height: 32px !important;
    border-radius: 10px !important;
    border: 1px solid #f1f5f9 !important;
    background: white !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.2s !important;
  }

  .rdp-nav_button:hover {
    background: #f8fafc !important;
    border-color: #e2e8f0 !important;
  }

  .rdp-head_cell {
    color: #94a3b8;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-bottom: 1rem;
  }

  .rdp-day {
    color: #475569;
    font-weight: 500;
    font-size: 0.875rem;
    border-radius: 14px !important;
    transition: all 0.2s;
  }

  .rdp-day_selected {
    background-color: var(--rdp-accent-color) !important;
    color: white !important;
    font-weight: 700 !important;
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
  }

  .rdp-day:hover:not(.rdp-day_selected):not(.rdp-day_disabled) {
    background-color: var(--rdp-background-color) !important;
    color: var(--rdp-accent-color-dark) !important;
  }

  .rdp-day_today {
    color: var(--rdp-accent-color);
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .rdp-day_disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  /* Desktop specific adjustments */
  @media (min-width: 1024px) {
    .rdp { --rdp-cell-size: 48px; }
  }
`;

interface CustomBookingCalendarProps {
    selectedDate: Date | undefined;
    selectedTime: string | undefined;
    onSelectDate: (date: Date | undefined) => void;
    onSelectTime: (time: string) => void;
}

export default function CustomBookingCalendar({
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime
}: CustomBookingCalendarProps) {
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    const handleDateSelect = (date: Date | undefined) => {
        onSelectDate(date);
    };

    const handleTimeSelect = (time: string) => {
        onSelectTime(time);
    };

    const today = startOfToday();

    return (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <style>{dayPickerStyles}</style>

            <div className="flex flex-col lg:flex-row min-h-[600px]">
                {/* Calendar Side */}
                <div className="flex-1 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-50">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                            Step One
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">Select a Date</h3>
                        <p className="text-sm text-slate-400 font-light">Choose a day that works for your session.</p>
                    </div>

                    <div className="flex justify-center">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={{ before: today }}
                            showOutsideDays
                            components={{
                                Chevron: ({ ...props }) => props.orientation === 'left' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />,
                            }}
                        />
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-100 rounded-full"></div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today</span>
                        </div>
                    </div>
                </div>

                {/* Time Picker Side */}
                <div className="flex-1 p-8 lg:p-12 bg-slate-50/30">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            Step Two
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">Available Slots</h3>
                        <p className="text-sm text-slate-400 font-light">Listing in Pacific Standard Time (PST).</p>
                    </div>

                    {!selectedDate ? (
                        <div className="h-full max-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-100 p-8">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                                <CalendarIcon size={32} className="text-slate-200" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Pick a date to see available times</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <CalendarIcon size={20} />
                                    </div>
                                    <span className="font-bold text-slate-900">{format(selectedDate, 'EEEE, MMMM do')}</span>
                                </div>
                                <Globe size={18} className="text-slate-300" />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className={`py-4 px-2 rounded-2xl border text-sm font-bold transition-all relative group ${selectedTime === time
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200'
                                            : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-500 hover:text-emerald-700 hover:shadow-lg hover:shadow-emerald-100/50'
                                            }`}
                                    >
                                        {time}
                                        <span className={`block text-[10px] mt-0.5 opacity-60 ${selectedTime === time ? 'text-emerald-400' : 'text-slate-400'}`}>PST</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 text-emerald-600 mb-3">
                                    <div className="p-1.5 bg-emerald-50 rounded-lg">
                                        <Globe size={14} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Timezone Notice</span>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-light">
                                    The schedule above is locked to **PST**. Please account for any difference if you are booking from another region.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
