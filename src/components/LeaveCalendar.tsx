'use client';

import { useState, useEffect } from 'react';
import type { DayInfo } from '@/lib/calculator';
import { formatDate } from '@/lib/calculator';

type LeaveCalendarProps = {
  dayInfos: DayInfo[];
  birthDate: Date;
};

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function LeaveCalendar({ dayInfos, birthDate }: LeaveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(birthDate);

  useEffect(() => {
    setCurrentMonth(new Date(birthDate));
  }, [birthDate]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const dayInfoMap = new Map<string, DayInfo>();
  for (const d of dayInfos) {
    const key = d.date.toDateString();
    dayInfoMap.set(key, d);
  }

  const getDayStatus = (day: number): DayInfo | null => {
    const d = new Date(year, month, day);
    return dayInfoMap.get(d.toDateString()) ?? null;
  };

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const days: React.ReactNode[] = [];
  for (let i = 0; i < startPadding; i++) {
    days.push(<div key={`pad-${i}`} className="aspect-square min-h-[2.5rem]" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const info = getDayStatus(day);
    const date = new Date(year, month, day);
    const isBirth = date.toDateString() === birthDate.toDateString();

    let bg = 'bg-slate-100';
    let border = '';
    let title = '';
    if (info) {
      if (info.status === 'both') {
        bg = 'bg-violet-500';
        title = `Mãe + Pai com o bebé`;
      } else if (info.status === 'mother') {
        bg = 'bg-pink-400';
        title = `Mãe com o bebé`;
      } else {
        bg = 'bg-blue-400';
        title = `Pai com o bebé`;
      }
      title += ` — ${formatDate(info.date)}`;
    }
    if (isBirth) border = 'ring-2 ring-amber-400 ring-offset-1';

    days.push(
      <div
        key={day}
        title={title || (isBirth ? 'Data do parto' : '')}
        className={`
          aspect-square flex min-h-[2.5rem] items-center justify-center rounded-lg text-sm font-medium
          ${bg} ${border}
          ${info ? 'text-white shadow-sm' : 'text-slate-500'}
          ${isBirth && !info ? 'ring-2 ring-amber-400 ring-offset-1' : ''}
        `}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="rounded-lg px-3 py-2 text-lg font-medium text-slate-600 hover:bg-slate-100"
        >
          ←
        </button>
        <span className="text-lg font-semibold text-slate-800">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg px-3 py-2 text-lg font-medium text-slate-600 hover:bg-slate-100"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => (
          <div key={d} className="py-1 text-xs font-semibold text-slate-600">
            {d}
          </div>
        ))}
        {days}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2 text-pink-700">
          <span className="h-4 w-4 rounded bg-pink-500" />
          Mãe com o bebé
        </span>
        <span className="flex items-center gap-2 text-blue-700">
          <span className="h-4 w-4 rounded bg-blue-500" />
          Pai com o bebé
        </span>
        <span className="flex items-center gap-2 text-violet-700">
          <span className="h-4 w-4 rounded bg-violet-500" />
          Mãe + Pai com o bebé
        </span>
      </div>
    </div>
  );
}
