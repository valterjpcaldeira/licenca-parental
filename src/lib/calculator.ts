/**
 * Portuguese Parental Leave Calculator
 * Based on gov.pt: Licença Parental Inicial (120 ou 150 dias + 30 extra opcionais)
 * https://www.gov.pt/guias/ter-uma-crianca/licenca-parental
 */

export type LeavePeriod = {
  type:
    | 'mother_mandatory'
    | 'mother_exclusive'
    | 'father_mandatory'
    | 'father_optional'
    | 'father_exclusive'
    | 'mother_shared'
    | 'father_shared';
  label: string;
  days: number;
  startDate: Date;
  endDate: Date;
  color: string;
};

export type InitialDaysOption = 120 | 150;

export type ScheduleConfig = {
  birthDate: Date;
  initialDays: InitialDaysOption; // 120 or 150
  withExtra: boolean; // 30 days partilhada
  hasTwins?: boolean; // nascimento múltiplo (gémeos) - 30 dias extra
  motherExclusiveDays: number;
  fatherExclusiveDays: number;
  sharedMotherDays: number; // 0-30 if withExtra
  sharedFatherDays: number;
  whoTakesFirst: 'mother' | 'father';
};

// Constants from Portuguese law (gov.pt guia licença parental)
export const RULES = {
  MOTHER_MANDATORY: 42,
  FATHER_MANDATORY: 28, // 7 imediatos + 21 durante os 42 da mãe
  FATHER_OPTIONAL: 7, // opcionais, também durante os 42 da mãe
  EXTRA_DAYS: 30, // licença partilhada
  // Option 120: 42 + 78 a partilhar
  OPTION_120: 120,
  POOL_120: 78, // 120 - 42
  // Option 150: 42 + 108 a partilhar
  OPTION_150: 150,
  POOL_150: 108, // 150 - 42
  // Defaults for 120 (e.g. mãe 78, pai 0)
  DEFAULT_120_MOTHER: 78,
  DEFAULT_120_FATHER: 0,
  // Defaults for 150 (e.g. mãe 78, pai 30)
  DEFAULT_150_MOTHER: 78,
  DEFAULT_150_FATHER: 30,
  SHARED_TOTAL: 30,
  SHARED_DEFAULT_MOTHER: 15,
  SHARED_DEFAULT_FATHER: 15,
  // Gémeos: +30 dias por cada bebé além do primeiro.
  // Aqui modelamos apenas gémeos (1 bebé extra) => +30 dias.
  TWINS_EXTRA_PER_ADDITIONAL_CHILD: 30,
} as const;

export function getExclusivePool(initialDays: InitialDaysOption): number {
  return initialDays === 120 ? RULES.POOL_120 : RULES.POOL_150;
}

export function getTotalDays(
  initialDays: InitialDaysOption,
  withExtra: boolean,
  hasTwins?: boolean
): number {
  const base = initialDays + (withExtra ? RULES.EXTRA_DAYS : 0); // 120, 150, 150 (120+30), 180 (150+30)
  const twinsExtra = hasTwins ? RULES.TWINS_EXTRA_PER_ADDITIONAL_CHILD : 0;
  return base + twinsExtra;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function calculateSchedule(config: ScheduleConfig): LeavePeriod[] {
  const periods: LeavePeriod[] = [];
  let currentDate = new Date(config.birthDate);
  const hasTwins = !!config.hasTwins;

  // 1. Mother mandatory (42 days)
  const motherMandatoryEnd = addDays(currentDate, RULES.MOTHER_MANDATORY);
  periods.push({
    type: 'mother_mandatory',
    label: 'Licença obrigatória mãe (42 dias)',
    days: RULES.MOTHER_MANDATORY,
    startDate: new Date(currentDate),
    endDate: new Date(motherMandatoryEnd),
    color: '#ec4899',
  });
  currentDate = motherMandatoryEnd;

  // Father mandatory 28 days (within first 42)
  const fatherMandatoryEnd = addDays(config.birthDate, RULES.FATHER_MANDATORY);
  periods.push({
    type: 'father_mandatory',
    label: 'Licença obrigatória pai (28 dias)',
    days: RULES.FATHER_MANDATORY,
    startDate: new Date(config.birthDate),
    endDate: new Date(fatherMandatoryEnd),
    color: '#60a5fa',
  });

  // Father optional +7 days (assumimos que são gozados de seguida, ainda dentro dos 42 dias)
  const fatherOptionalEnd = addDays(fatherMandatoryEnd, RULES.FATHER_OPTIONAL);
  if (fatherOptionalEnd <= motherMandatoryEnd) {
    periods.push({
      type: 'father_optional',
      label: 'Licença opcional pai (+7 dias)',
      days: RULES.FATHER_OPTIONAL,
      startDate: new Date(fatherMandatoryEnd),
      endDate: new Date(fatherOptionalEnd),
      color: '#3b82f6',
    });
  }

  // 2. Mother exclusive + Father exclusive (order depends on whoTakesFirst)
  const motherExclusive = config.motherExclusiveDays;
  const fatherExclusive = config.fatherExclusiveDays;

  if (motherExclusive + fatherExclusive === 0) {
    // Skip exclusive blocks if both 0 (e.g. 120 with all for mother in "exclusive" already)
  } else   if (config.whoTakesFirst === 'mother') {
    if (motherExclusive > 0) {
      const motherExclusiveEnd = addDays(currentDate, motherExclusive);
      periods.push({
        type: 'mother_exclusive',
        label: `Licença exclusiva mãe (${motherExclusive} dias)`,
        days: motherExclusive,
        startDate: new Date(currentDate),
        endDate: new Date(motherExclusiveEnd),
        color: '#f472b6',
      });
      currentDate = motherExclusiveEnd;
    }
    if (fatherExclusive > 0) {
      const fatherExclusiveEnd = addDays(currentDate, fatherExclusive);
      periods.push({
        type: 'father_exclusive',
        label: `Licença exclusiva pai (${fatherExclusive} dias)`,
        days: fatherExclusive,
        startDate: new Date(currentDate),
        endDate: new Date(fatherExclusiveEnd),
        color: '#3b82f6',
      });
      currentDate = fatherExclusiveEnd;
    }
  } else {
    if (fatherExclusive > 0) {
      const fatherExclusiveEnd = addDays(currentDate, fatherExclusive);
      periods.push({
        type: 'father_exclusive',
        label: `Licença exclusiva pai (${fatherExclusive} dias)`,
        days: fatherExclusive,
        startDate: new Date(currentDate),
        endDate: new Date(fatherExclusiveEnd),
        color: '#3b82f6',
      });
      currentDate = fatherExclusiveEnd;
    }
    if (motherExclusive > 0) {
      const motherExclusiveEnd = addDays(currentDate, motherExclusive);
      periods.push({
        type: 'mother_exclusive',
        label: `Licença exclusiva mãe (${motherExclusive} dias)`,
        days: motherExclusive,
        startDate: new Date(currentDate),
        endDate: new Date(motherExclusiveEnd),
        color: '#f472b6',
      });
      currentDate = motherExclusiveEnd;
    }
  }

  // 3. Shared period (30 days extra) — only if withExtra
  const sharedMother = config.withExtra ? config.sharedMotherDays : 0;
  const sharedFather = config.withExtra ? config.sharedFatherDays : 0;

  if (sharedMother > 0) {
    const motherSharedEnd = addDays(currentDate, sharedMother);
    periods.push({
      type: 'mother_shared',
      label: `Licença partilhada mãe (${sharedMother} dias)`,
      days: sharedMother,
      startDate: new Date(currentDate),
      endDate: new Date(motherSharedEnd),
      color: '#f9a8d4',
    });
    currentDate = motherSharedEnd;
  }

  if (sharedFather > 0) {
    const fatherSharedEnd = addDays(currentDate, sharedFather);
    periods.push({
      type: 'father_shared',
      label: `Licença partilhada pai (${sharedFather} dias)`,
      days: sharedFather,
      startDate: new Date(currentDate),
      endDate: new Date(fatherSharedEnd),
      color: '#60a5fa',
    });
    currentDate = fatherSharedEnd;
  }

  // 4. Gémeos: dias adicionais (modelados como partilhados, metade para cada)
  if (hasTwins) {
    const totalTwinsExtra = RULES.TWINS_EXTRA_PER_ADDITIONAL_CHILD;
    const twinsMother = Math.floor(totalTwinsExtra / 2);
    const twinsFather = totalTwinsExtra - twinsMother;

    if (twinsMother > 0) {
      const motherTwinsEnd = addDays(currentDate, twinsMother);
      periods.push({
        type: 'mother_shared',
        label: `Dias adicionais por gémeos (mãe, ${twinsMother} dias)`,
        days: twinsMother,
        startDate: new Date(currentDate),
        endDate: new Date(motherTwinsEnd),
        color: '#f9a8d4',
      });
      currentDate = motherTwinsEnd;
    }

    if (twinsFather > 0) {
      const fatherTwinsEnd = addDays(currentDate, twinsFather);
      periods.push({
        type: 'father_shared',
        label: `Dias adicionais por gémeos (pai, ${twinsFather} dias)`,
        days: twinsFather,
        startDate: new Date(currentDate),
        endDate: new Date(fatherTwinsEnd),
        color: '#60a5fa',
      });
    }
  }

  return periods;
}

export function getSummary(periods: LeavePeriod[]) {
  const motherDays = periods
    .filter((p) => p.type.includes('mother'))
    .reduce((sum, p) => sum + p.days, 0);
  const fatherDays = periods
    .filter((p) => p.type.includes('father'))
    .reduce((sum, p) => sum + p.days, 0);
  const totalDays = periods.reduce((sum, p) => sum + p.days, 0);

  return {
    motherDays,
    fatherDays,
    totalDays,
    lastDay: periods.length > 0 ? periods[periods.length - 1].endDate : null,
  };
}

export type DayStatus = 'mother' | 'father' | 'both';

export type DayInfo = {
  date: Date;
  mother: boolean;
  father: boolean;
  status: DayStatus;
  label: string;
};

/** Get day-by-day status. Father's 28 mandatory days overlap with mother's first 42. */
export function getDayByDayStatus(periods: LeavePeriod[], birthDate: Date): DayInfo[] {
  const days: DayInfo[] = [];
  const lastPeriod = periods[periods.length - 1];
  if (!lastPeriod) return days;

  // endDate is exclusive (first day after last leave day)
  const endDate = new Date(lastPeriod.endDate);
  endDate.setHours(0, 0, 0, 0);
  const current = new Date(birthDate);
  current.setHours(0, 0, 0, 0);

  while (current < endDate) {
    let mother = false;
    let father = false;

    for (const p of periods) {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      if (current >= start && current < end) {
        if (p.type.includes('mother')) mother = true;
        if (p.type.includes('father')) father = true;
      }
    }

    const status: DayStatus = mother && father ? 'both' : mother ? 'mother' : father ? 'father' : 'mother';
    const label = mother && father ? 'Mãe + Pai' : mother ? 'Mãe' : father ? 'Pai' : '—';

    if (mother || father) {
      days.push({
        date: new Date(current),
        mother,
        father,
        status,
        label,
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return days;
}
