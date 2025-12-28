export enum NumberingLevel {
  NONE = 0,
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5
}

export interface NumberingPattern {
  level: NumberingLevel;
  text: string;
  indent: number;
}

export interface NumberingIndents {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
}

export function detectNumberingLevel(line: string): NumberingLevel {
  const trimmedLine = line.trim();
  
  if (!trimmedLine) {
    return NumberingLevel.NONE;
  }

  const level1Pattern = /^([一二三四五六七八九十]+)、/;
  const level2Pattern = /^（([一二三四五六七八九十]+)）/;
  const level3Pattern = /^(\d+)\./;
  const level4Pattern = /^（(\d+)）/;
  const level5Pattern = /^[①②③④⑤⑥⑦⑧⑨⑩]/;

  if (level5Pattern.test(trimmedLine)) {
    return NumberingLevel.LEVEL_5;
  }

  if (level4Pattern.test(trimmedLine)) {
    return NumberingLevel.LEVEL_4;
  }

  if (level3Pattern.test(trimmedLine)) {
    return NumberingLevel.LEVEL_3;
  }

  if (level2Pattern.test(trimmedLine)) {
    return NumberingLevel.LEVEL_2;
  }

  if (level1Pattern.test(trimmedLine)) {
    return NumberingLevel.LEVEL_1;
  }

  return NumberingLevel.NONE;
}

export function getIndentForLevel(level: NumberingLevel, customIndents?: NumberingIndents): number {
  if (customIndents) {
    const indentMap: Record<NumberingLevel, number> = {
      [NumberingLevel.NONE]: 2,
      [NumberingLevel.LEVEL_1]: customIndents.level1,
      [NumberingLevel.LEVEL_2]: customIndents.level2,
      [NumberingLevel.LEVEL_3]: customIndents.level3,
      [NumberingLevel.LEVEL_4]: customIndents.level4,
      [NumberingLevel.LEVEL_5]: customIndents.level5
    };
    return indentMap[level];
  }

  const indentMap: Record<NumberingLevel, number> = {
    [NumberingLevel.NONE]: 2,
    [NumberingLevel.LEVEL_1]: 0,
    [NumberingLevel.LEVEL_2]: 2,
    [NumberingLevel.LEVEL_3]: 4,
    [NumberingLevel.LEVEL_4]: 6,
    [NumberingLevel.LEVEL_5]: 8
  };
  return indentMap[level];
}

export function parseLineWithNumbering(line: string, customIndents?: NumberingIndents): NumberingPattern {
  const level = detectNumberingLevel(line);
  const indent = getIndentForLevel(level, customIndents);
  
  return {
    level,
    text: line,
    indent
  };
}

export function parseContentWithNumbering(content: string, customIndents?: NumberingIndents): NumberingPattern[] {
  const lines = content.split('\n');
  return lines.map(line => parseLineWithNumbering(line, customIndents));
}

export function removeNumberingPrefix(line: string): string {
  const trimmedLine = line.trim();
  
  const patterns = [
    /^[①②③④⑤⑥⑦⑧⑨⑩]/,
    /^（(\d+)）/,
    /^(\d+)\./,
    /^（([一二三四五六七八九十]+)）/,
    /^([一二三四五六七八九十]+)、/
  ];

  for (const pattern of patterns) {
    if (pattern.test(trimmedLine)) {
      return trimmedLine.replace(pattern, '').trim();
    }
  }

  return line;
}
