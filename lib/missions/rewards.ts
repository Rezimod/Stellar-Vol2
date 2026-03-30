export function generateRewardCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SKW-${code}`;
}

export function getRewardExpiryDate(days = 90): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function getNewLevel(xp: number): number {
  if (xp >= 2000) return 6;
  if (xp >= 1000) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}
