'use client';

import type { DayInfo } from '@/lib/calculator';
import { formatDate } from '@/lib/calculator';

type BothWithKidViewProps = {
  dayInfos: DayInfo[];
};

export default function BothWithKidView({ dayInfos }: BothWithKidViewProps) {
  const bothDays = dayInfos.filter((d) => d.status === 'both');
  const motherOnly = dayInfos.filter((d) => d.status === 'mother');
  const fatherOnly = dayInfos.filter((d) => d.status === 'father');

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-violet-50 p-4">
        <h3 className="mb-2 text-base font-semibold text-violet-800">
          👨‍👩‍👧 Dias em que ambos estão com o bebé
        </h3>
        <p className="mb-3 text-sm text-violet-700">
          {bothDays.length} dias — período em que pai e mãe gozam licença em simultâneo (primeiros 28 dias após o parto)
        </p>
        <p className="text-sm font-medium text-violet-800">
          {bothDays.length > 0
            ? `${formatDate(bothDays[0].date)} a ${formatDate(bothDays[bothDays.length - 1].date)}`
            : '—'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4">
          <h3 className="mb-2 text-base font-semibold text-pink-800">
            Só a mãe com o bebé
          </h3>
          <p className="text-2xl font-bold text-pink-600">{motherOnly.length}</p>
          <p className="text-sm text-pink-700">dias</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 text-base font-semibold text-blue-800">
            Só o pai com o bebé
          </h3>
          <p className="text-2xl font-bold text-blue-600">{fatherOnly.length}</p>
          <p className="text-sm text-blue-700">dias</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-800">
          Resumo dos 180 dias
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Mãe + Pai juntos</span>
            <span className="font-semibold text-violet-600">{bothDays.length} dias</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Apenas mãe</span>
            <span className="font-semibold text-pink-600">{motherOnly.length} dias</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Apenas pai</span>
            <span className="font-semibold text-blue-600">{fatherOnly.length} dias</span>
          </div>
          <div className="mt-2 border-t border-slate-200 pt-2 font-semibold">
            <div className="flex justify-between text-slate-800">
              <span>Total</span>
              <span>{dayInfos.length} dias</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
