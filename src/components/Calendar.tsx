'use client';

import { useState } from 'react';

type CalendarProps = {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
};

export default function Calendar({ value, onChange, minDate, maxDate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    if (!isDisabled(day)) {
      onChange(newDate);
      setIsOpen(false);
    }
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const displayValue = value.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const days = [];
  for (let i = 0; i < startPadding; i++) {
    days.push(<div key={`pad-${i}`} className="min-h-12" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const disabled = isDisabled(day);
    const selected = isSameDay(value, date);
    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDayClick(day)}
        disabled={disabled}
        className={`
          min-h-12 min-w-12 rounded-lg text-base font-semibold transition-colors
          ${selected ? 'bg-green-600 text-white' : 'hover:bg-green-100 text-slate-800'}
          ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        `}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-12 w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-green-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
      >
        <span className="text-base font-medium text-slate-700">📅 Data prevista do parto</span>
        <span className="text-base font-semibold text-slate-900">{displayValue}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="min-h-12 min-w-12 rounded-lg p-2 text-slate-900 hover:bg-slate-100"
              >
                ←
              </button>
              <span className="font-semibold text-slate-900">
                {monthNames[month]} {year}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="min-h-12 min-w-12 rounded-lg p-2 text-slate-900 hover:bg-slate-100"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => (
                <div key={d} className="text-xs font-medium text-slate-700">
                  {d}
                </div>
              ))}
              {days}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
