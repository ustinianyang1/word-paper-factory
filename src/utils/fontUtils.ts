import { FontSize } from '../types/format';

export const fontSizeToHalfPoints: Record<FontSize, number> = {
  '小五': 18,
  '五号': 21,
  '小四': 24,
  '四号': 28,
  '小三': 30,
  '三号': 32,
  '小二': 36,
  '二号': 44,
  '小一': 48,
  '一号': 52
};

export const fontSizeToPoints: Record<FontSize, number> = {
  '小五': 9,
  '五号': 10.5,
  '小四': 12,
  '四号': 14,
  '小三': 15,
  '三号': 16,
  '小二': 18,
  '二号': 22,
  '小一': 24,
  '一号': 26
};

export function getFontSizeInHalfPoints(size: FontSize): number {
  return fontSizeToHalfPoints[size];
}

export function getFontSizeInPoints(size: FontSize): number {
  return fontSizeToPoints[size];
}

export function isChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

export function containsEnglish(text: string): boolean {
  return /[a-zA-Z]/.test(text);
}

export function detectLanguage(text: string): 'chinese' | 'english' | 'mixed' {
  const hasChinese = isChinese(text);
  const hasEnglish = containsEnglish(text);
  
  if (hasChinese && hasEnglish) return 'mixed';
  if (hasChinese) return 'chinese';
  if (hasEnglish) return 'english';
  return 'chinese';
}