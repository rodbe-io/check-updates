export const STATUS = {
  UPDATED: 'UPDATED',
} as const;

const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;

export const DAY_IN_MS = 24 * HOUR_IN_MS;
export const WEEK_IN_MS = 7 * DAY_IN_MS;
const MONTH_IN_MS = 30 * DAY_IN_MS;

export const QUATER_IN_MS = 3 * MONTH_IN_MS;
