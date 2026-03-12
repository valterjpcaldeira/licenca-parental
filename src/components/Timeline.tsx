'use client';

import type { InitialDaysOption, LeavePeriod } from '@/lib/calculator';
import { formatDate, getSummary } from '@/lib/calculator';

type TimelineProps = {
  periods: LeavePeriod[];
  initialDays: InitialDaysOption;
  withExtra: boolean;
  fatherExclusiveDays: number;
  motherSalary: number;
  fatherSalary: number;
};

function formatCurrency(value: number) {
  return value.toLocaleString('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  });
}

function getSubsidyRate(
  initialDays: InitialDaysOption,
  withExtra: boolean,
  fatherExclusiveDays: number,
  periodType: LeavePeriod['type'],
  isFather: boolean
): number {
  // Per gov.pt guia:
  // - 120 dias: 100%
  // - 150 sem partilha: 80%
  // - 150 (120+30) com partilha: 100%
  // - 180 (150+30) com partilha: 83% ou 90% se o pai gozar 60 dias seguidos ou dois períodos de 30 dias (sem contar o obrigatório)

  // Período obrigatório do pai (28+7) é sempre pago a 100%
  if (isFather && (periodType === 'father_mandatory' || periodType === 'father_optional')) {
    return 1;
  }

  if (!withExtra) {
    if (initialDays === 120) return 1;
    return 0.8;
  }

  if (initialDays === 120) {
    return 1;
  }

  // 150 + 30: 90% se pai gozar 60+ dias exclusivos (excl. obrigatório e excl. os 30 extra), senão 83%
  if (fatherExclusiveDays >= 60) return 0.9;
  return 0.83;
}

export default function Timeline({
  periods,
  initialDays,
  withExtra,
  fatherExclusiveDays,
  motherSalary,
  fatherSalary,
}: TimelineProps) {
  if (periods.length === 0) return null;

  const summary = getSummary(periods);
  const totalDays = periods.reduce((sum, p) => sum + p.days, 0);
  const firstDate = periods[0].startDate;
  const lastDate = periods[periods.length - 1].endDate;

  // Visual bar: each period as % of total
  const totalPeriodDays = periods.reduce((s, p) => s + p.days, 0);

  const motherBaseDaily = motherSalary > 0 ? motherSalary / 30 : 0;
  const fatherBaseDaily = fatherSalary > 0 ? fatherSalary / 30 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-pink-50 p-4">
          <div className="text-2xl font-bold text-pink-600">{summary.motherDays}</div>
          <div className="text-base font-medium text-pink-700">Dias mãe</div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="text-2xl font-bold text-blue-600">{summary.fatherDays}</div>
          <div className="text-base font-medium text-blue-700">Dias pai</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-4">
          <div className="text-2xl font-bold text-slate-700">{totalDays}</div>
          <div className="text-base font-medium text-slate-600">Total dias</div>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <div className="text-lg font-bold text-green-700">
            {summary.lastDay ? formatDate(summary.lastDay) : '-'}
          </div>
          <div className="text-base font-medium text-green-600">Último dia</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-800">Timeline visual</h3>
        <div className="flex h-12 overflow-hidden rounded-xl border border-slate-200">
          {periods.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 transition-all"
              style={{
                width: `${(p.days / totalPeriodDays) * 100}%`,
                backgroundColor: p.color,
              }}
              title={`${p.label}: ${p.days} dias`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {periods.map((p, i) => (
            <span
              key={i}
              className={`flex items-center gap-1.5 text-sm ${
                p.type.includes('mother') && !p.type.includes('father')
                  ? 'text-pink-700'
                  : p.type.includes('father') && !p.type.includes('mother')
                  ? 'text-blue-700'
                  : 'text-violet-700'
              }`}
            >
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              {p.type.includes('mother') ? 'Mãe' : 'Pai'}: {p.days}d
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-800">Detalhe por período</h3>
        <div className="space-y-2">
          {periods.map((period, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: period.color }}
                />
                <div>
                  <div className="text-base font-medium text-slate-800">{period.label}</div>
                  <div className="text-sm text-slate-600">
                    {formatDate(period.startDate)} → {formatDate(period.endDate)}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm sm:text-base">
                <div className="font-semibold text-slate-700">
                  {period.days} dias
                </div>
                <div className="mt-0.5 space-y-0.5 text-xs text-slate-600">
                  {period.type.includes('mother') && (() => {
                    const rate = getSubsidyRate(initialDays, withExtra, fatherExclusiveDays, period.type, false);
                    return (
                      <div>
                        Mãe:{' '}
                        {motherBaseDaily > 0 ? (
                          <>
                            <span className="font-semibold text-pink-700">
                              {formatCurrency(period.days * motherBaseDaily * rate)}
                            </span>
                            <span className="ml-1 text-slate-500">({Math.round(rate * 100)}%)</span>
                          </>
                        ) : (
                          <span className="text-slate-500">({Math.round(rate * 100)}%)</span>
                        )}
                      </div>
                    );
                  })()}
                  {period.type.includes('father') && (() => {
                    const rate = getSubsidyRate(initialDays, withExtra, fatherExclusiveDays, period.type, true);
                    return (
                      <div>
                        Pai:{' '}
                        {fatherBaseDaily > 0 ? (
                          <>
                            <span className="font-semibold text-blue-700">
                              {formatCurrency(period.days * fatherBaseDaily * rate)}
                            </span>
                            <span className="ml-1 text-slate-500">({Math.round(rate * 100)}%)</span>
                          </>
                        ) : (
                          <span className="text-slate-500">({Math.round(rate * 100)}%)</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
        <div className="text-sm font-medium opacity-90">
          A licença termina em {summary.lastDay ? formatDate(summary.lastDay) : ''} — aproximadamente{' '}
          {summary.lastDay
            ? Math.round(
                (summary.lastDay.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24) / 30
              )
            : 0}{' '}
          meses após o parto
        </div>
      </div>
    </div>
  );
}
