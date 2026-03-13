'use client';

import { useState, useMemo } from 'react';
import Calendar from '@/components/Calendar';
import Timeline from '@/components/Timeline';
import RulesSection from '@/components/RulesSection';
import BothWithKidView from '@/components/BothWithKidView';
import LeaveCalendar from '@/components/LeaveCalendar';
import {
  calculateSchedule,
  getDayByDayStatus,
  getExclusivePool,
  getTotalDays,
  RULES,
  type InitialDaysOption,
} from '@/lib/calculator';

const defaultBirthDate = new Date();
defaultBirthDate.setMonth(defaultBirthDate.getMonth() + 1);

export default function Home() {
  const [birthDate, setBirthDate] = useState(defaultBirthDate);
  const [initialDays, setInitialDays] = useState<InitialDaysOption>(150);
  const [withExtra, setWithExtra] = useState(true);
  const [whoTakesFirst, setWhoTakesFirst] = useState<'mother' | 'father'>('mother');
  const [motherSalary, setMotherSalary] = useState<number>(1500);
  const [fatherSalary, setFatherSalary] = useState<number>(1500);
  const [motherExclusiveDays, setMotherExclusiveDays] = useState<number>(RULES.DEFAULT_150_MOTHER);
  const [fatherExclusiveDays, setFatherExclusiveDays] = useState<number>(RULES.DEFAULT_150_FATHER);
  const [sharedMotherDays, setSharedMotherDays] = useState<number>(RULES.SHARED_DEFAULT_MOTHER);
  const [sharedFatherDays, setSharedFatherDays] = useState<number>(RULES.SHARED_DEFAULT_FATHER);

  const exclusivePool = getExclusivePool(initialDays);
  const totalDaysLabel = getTotalDays(initialDays, withExtra);

  const periods = useMemo(
    () =>
      calculateSchedule({
        birthDate,
        initialDays,
        withExtra,
        motherExclusiveDays,
        fatherExclusiveDays,
        sharedMotherDays,
        sharedFatherDays,
        whoTakesFirst,
      }),
    [
      birthDate,
      initialDays,
      withExtra,
      motherExclusiveDays,
      fatherExclusiveDays,
      sharedMotherDays,
      sharedFatherDays,
      whoTakesFirst,
    ]
  );

  const dayInfos = useMemo(() => getDayByDayStatus(periods, birthDate), [periods, birthDate]);

  const [resultView, setResultView] = useState<'summary' | 'full'>('summary');

  const totalShared = sharedMotherDays + sharedFatherDays;
  const sharedValid = totalShared === 30;
  const canUseExtra = motherExclusiveDays >= 30 && fatherExclusiveDays >= 30;

  const handleInitialDaysChange = (value: InitialDaysOption) => {
    setInitialDays(value);
    if (value === 120) {
      setMotherExclusiveDays(RULES.DEFAULT_120_MOTHER);
      setFatherExclusiveDays(RULES.DEFAULT_120_FATHER);
    } else {
      setMotherExclusiveDays(RULES.DEFAULT_150_MOTHER);
      setFatherExclusiveDays(RULES.DEFAULT_150_FATHER);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">
            Licença Parental
          </h1>
          <p className="text-lg text-slate-600">
            Simule e planeie a sua licença parental em Portugal
          </p>
        </header>

        <div className="space-y-8">
          <RulesSection />

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-slate-800">
              📅 Simulador
            </h2>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-base font-semibold text-slate-800">
                  Data prevista do parto
                </label>
                <Calendar value={birthDate} onChange={setBirthDate} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800">
                    Remuneração bruta mensal da mãe (€)
                  </label>
                  <input
                    type="text" inputMode="decimal"
                    value={motherSalary}
                    onChange={(e) => setMotherSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full min-h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-800">
                    Remuneração bruta mensal do pai (€)
                  </label>
                  <input
                    type="text" inputMode="decimal"
                    value={fatherSalary}
                    onChange={(e) => setFatherSalary(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full min-h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <label className="mb-3 block text-base font-semibold text-slate-800">
                  Opção de licença parental inicial (lei)
                </label>
                <p className="mb-3 text-sm text-slate-600">
                  120 dias = 100% subsídio. 150 dias = 80% sem partilha; com partilha 83% ou 90%.
                </p>
                <div className="flex flex-wrap gap-4">
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg py-2 pr-2">
                    <input
                      type="radio"
                      name="initialDays"
                      checked={initialDays === 120}
                      onChange={() => handleInitialDaysChange(120)}
                      className="h-5 w-5 shrink-0 text-green-600"
                    />
                    <span className="text-base font-medium text-slate-800">120 dias (~4 meses)</span>
                  </label>
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg py-2 pr-2">
                    <input
                      type="radio"
                      name="initialDays"
                      checked={initialDays === 150}
                      onChange={() => handleInitialDaysChange(150)}
                      className="h-5 w-5 shrink-0 text-green-600"
                    />
                    <span className="text-base font-medium text-slate-800">150 dias (~5 meses)</span>
                  </label>
                </div>
              </div>

              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <label className="mb-2 flex min-h-12 cursor-pointer items-start gap-3 py-1">
                  <input
                    type="checkbox"
                    checked={withExtra}
                    disabled={!canUseExtra}
                    onChange={(e) => {
                      if (!canUseExtra) return;
                      setWithExtra(e.target.checked);
                      if (!e.target.checked) {
                        setSharedMotherDays(0);
                        setSharedFatherDays(0);
                      } else {
                        setSharedMotherDays(RULES.SHARED_DEFAULT_MOTHER);
                        setSharedFatherDays(RULES.SHARED_DEFAULT_FATHER);
                      }
                    }}
                    className="mt-1.5 h-5 w-5 shrink-0 rounded text-green-600"
                  />
                  <span className="text-base font-semibold text-slate-800">
                    Quero beneficiar dos 30 dias extra (licença partilhada)
                  </span>
                </label>
                <p className="ml-8 text-sm text-slate-600">
                  {initialDays === 120 ? '120+30=150 dias totais' : '150+30=180 dias totais'}. Cada um tem de gozar pelo menos 30 dias seguidos ou 2×15 dias em exclusivo.
                </p>
                {!canUseExtra && (
                  <p className="ml-8 mt-1 text-sm font-medium text-amber-600">
                    Para ter os 30 dias extra, mãe e pai têm de ter pelo menos 30 dias exclusivos cada.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-base font-semibold text-slate-800">
                  Quem goza primeiro após os 42 dias obrigatórios da mãe?
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg py-2">
                    <input
                      type="radio"
                      name="whoFirst"
                      checked={whoTakesFirst === 'mother'}
                      onChange={() => setWhoTakesFirst('mother')}
                      className="h-5 w-5 shrink-0 text-pink-500"
                    />
                    <span className="text-base font-medium text-pink-700">Mãe</span>
                  </label>
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg py-2">
                    <input
                      type="radio"
                      name="whoFirst"
                      checked={whoTakesFirst === 'father'}
                      onChange={() => setWhoTakesFirst('father')}
                      className="h-5 w-5 shrink-0 text-blue-500"
                    />
                    <span className="text-base font-medium text-blue-700">Pai</span>
                  </label>
                </div>
              </div>

              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <p className="mb-4 text-sm font-medium text-slate-700">
                  Dos {initialDays} dias iniciais: 42 obrigatórios da mãe + {exclusivePool} dias a partilhar entre mãe e pai.
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label className="mb-2 min-h-[2.75rem] text-base font-semibold leading-tight text-slate-800">
                      Dias exclusivos da mãe (após os 42 obrigatórios)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={motherExclusiveDays}
                      onChange={(e) => {
                        const v = Math.min(
                          exclusivePool,
                          Math.max(0, parseInt(e.target.value) || 0)
                        );
                        const newMother = v;
                        const newFather = exclusivePool - v;
                        setMotherExclusiveDays(newMother);
                        setFatherExclusiveDays(newFather);
                        if (withExtra && (newMother < 30 || newFather < 30)) {
                          setWithExtra(false);
                          setSharedMotherDays(0);
                          setSharedFatherDays(0);
                        }
                      }}
                      className="w-full min-h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                    <p className="mt-1 text-sm text-slate-600">
                      Lei: 0–{exclusivePool} dias
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-2 min-h-[2.75rem] text-base font-semibold leading-tight text-slate-800">
                      Dias exclusivos do pai
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={fatherExclusiveDays}
                      onChange={(e) => {
                        const v = Math.min(
                          exclusivePool,
                          Math.max(0, parseInt(e.target.value) || 0)
                        );
                        const newFather = v;
                        const newMother = exclusivePool - v;
                        setFatherExclusiveDays(newFather);
                        setMotherExclusiveDays(newMother);
                        if (withExtra && (newMother < 30 || newFather < 30)) {
                          setWithExtra(false);
                          setSharedMotherDays(0);
                          setSharedFatherDays(0);
                        }
                      }}
                      className="w-full min-h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="mt-1 text-sm text-slate-600">
                      Lei: 0–{exclusivePool} dias
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Total: {motherExclusiveDays + fatherExclusiveDays} dias (deve ser {exclusivePool})
                </p>
              </div>

              {withExtra && (
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                <label className="mb-2 block text-base font-semibold text-slate-800">
                  Licença partilhada (30 dias extra) — lei: dividir entre mãe e pai
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                    <span className="text-base font-medium text-pink-700">Mãe:</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={sharedMotherDays}
                      onChange={(e) => {
                        const v = Math.min(30, Math.max(0, parseInt(e.target.value) || 0));
                        setSharedMotherDays(v);
                        setSharedFatherDays(RULES.SHARED_TOTAL - v);
                      }}
                      className="min-h-12 min-w-16 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-base font-semibold text-slate-800 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200 sm:min-w-20"
                    />
                    <span className="text-base text-slate-600">dias</span>
                  </div>
                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                    <span className="text-base font-medium text-blue-700">Pai:</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={sharedFatherDays}
                      onChange={(e) => {
                        const v = Math.min(30, Math.max(0, parseInt(e.target.value) || 0));
                        setSharedFatherDays(v);
                        setSharedMotherDays(RULES.SHARED_TOTAL - v);
                      }}
                      className="min-h-12 min-w-16 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-center text-base font-semibold text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:min-w-20"
                    />
                    <span className="text-base text-slate-600">dias</span>
                  </div>
                  {!sharedValid && (
                    <span className="text-base font-medium text-amber-600">
                      ⚠️ Total deve ser 30 dias
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Total: {sharedMotherDays + sharedFatherDays} dias (deve ser 30)
                </p>
              </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  📊 Resultado
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {initialDays} dias iniciais{withExtra ? ' + 30 partilhados' : ''} = {totalDaysLabel} dias totais
                </p>
              </div>
              <div className="flex rounded-lg border-2 border-slate-200 p-1">
                <button
                  type="button"
                  onClick={() => setResultView('summary')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    resultView === 'summary'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Resumo
                </button>
                <button
                  type="button"
                  onClick={() => setResultView('full')}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    resultView === 'full'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Vista completa
                </button>
              </div>
            </div>
            {resultView === 'summary' ? (
              <Timeline
                periods={periods}
                initialDays={initialDays}
                withExtra={withExtra}
                fatherExclusiveDays={fatherExclusiveDays}
                motherSalary={motherSalary}
                fatherSalary={fatherSalary}
              />
            ) : (
              <div className="space-y-8">
                <BothWithKidView dayInfos={dayInfos} />
                <Timeline
                  periods={periods}
                  initialDays={initialDays}
                  withExtra={withExtra}
                  fatherExclusiveDays={fatherExclusiveDays}
                  motherSalary={motherSalary}
                  fatherSalary={fatherSalary}
                />
              </div>
            )}
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-slate-800">
                📅 Calendário
              </h3>
              <LeaveCalendar dayInfos={dayInfos} birthDate={birthDate} />
            </div>
          </section>
        </div>

        <footer className="mt-16 text-center text-sm text-slate-500">
          Informação baseada na legislação portuguesa. Consulte a{' '}
          <a
            href="https://www.seg-social.pt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Segurança Social
          </a>{' '}
          para confirmação.
        </footer>
      </div>
    </main>
  );
}
