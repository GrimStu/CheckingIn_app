import { Profile } from '../data/types';

export function greeting(now: Date = new Date()): string {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatHourMinute(hour: number, minute: number): string {
  const period = hour >= 12 ? 'pm' : 'am';
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  const mm = minute.toString().padStart(2, '0');
  return `${h12}:${mm} ${period}`;
}

// Returns e.g. "today 1:00 pm" or "tomorrow 8:30 am", for the next enabled reminder.
export function nextReminderText(profile: Profile, now: Date = new Date()): string | null {
  const enabled = profile.reminders.filter((r) => r.enabled);
  if (enabled.length === 0) return null;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let best: { hour: number; minute: number; tomorrow: boolean } | null = null;

  for (const r of enabled) {
    const mins = r.hour * 60 + r.minute;
    const tomorrow = mins <= nowMinutes;
    const delta = tomorrow ? mins + 24 * 60 - nowMinutes : mins - nowMinutes;
    if (!best || delta < (best.tomorrow ? best.hour * 60 + best.minute + 24 * 60 - nowMinutes : best.hour * 60 + best.minute - nowMinutes)) {
      best = { hour: r.hour, minute: r.minute, tomorrow };
    }
  }

  if (!best) return null;
  return `${best.tomorrow ? 'tomorrow' : 'today'} ${formatHourMinute(best.hour, best.minute)}`;
}

export function dayHeading(ts: number): string {
  const d = new Date(ts);
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  return `${weekday}, ${day} ${month}`;
}

export function timeOfDay(ts: number): string {
  const d = new Date(ts);
  return formatHourMinute(d.getHours(), d.getMinutes());
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export { formatHourMinute };
