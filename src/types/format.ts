export type FontFamily = '宋体' | '黑体' | 'Times New Roman' | 'Arial' | '微软雅黑';

export type FontSize = '小五' | '五号' | '小四' | '四号' | '小三' | '三号' | '小二' | '二号' | '小一' | '一号';

export type Alignment = 'left' | 'center' | 'right' | 'justify';

export type LineSpacing = 1.0 | 1.15 | 1.5 | 2.0;

export interface FontFormat {
  family: FontFamily;
  size: FontSize;
  bold?: boolean;
  italic?: boolean;
}

export interface ParagraphFormat {
  alignment: Alignment;
  lineSpacing?: LineSpacing;
  firstLineIndent?: number;
  spacingBefore?: number;
  spacingAfter?: number;
}

export interface SectionFormat {
  title: FontFormat & ParagraphFormat;
  content: FontFormat & ParagraphFormat;
}

export interface FormatConfig {
  title: FontFormat & ParagraphFormat;
  personalInfo: FontFormat & ParagraphFormat;
  abstractTitle: FontFormat & ParagraphFormat;
  abstractContent: FontFormat & ParagraphFormat;
  keywords: FontFormat & ParagraphFormat;
  introduction: SectionFormat;
  conclusion: SectionFormat;
  references: SectionFormat;
  contentChinese: FontFormat & ParagraphFormat;
  contentEnglish: FontFormat & ParagraphFormat;
  footnoteChinese: FontFormat;
  footnoteEnglish: FontFormat;
}

export const defaultFormatConfig: FormatConfig = {
  title: {
    family: '宋体',
    size: '三号',
    bold: true,
    alignment: 'center'
  },
  personalInfo: {
    family: '宋体',
    size: '五号',
    alignment: 'center'
  },
  abstractTitle: {
    family: '黑体',
    size: '四号',
    alignment: 'center'
  },
  abstractContent: {
    family: '宋体',
    size: '小四',
    alignment: 'justify'
  },
  keywords: {
    family: '黑体',
    size: '小四',
    bold: true,
    alignment: 'left'
  },
  introduction: {
    title: {
      family: '黑体',
      size: '小四',
      bold: true,
      alignment: 'left'
    },
    content: {
      family: '宋体',
      size: '小四',
      alignment: 'justify',
      lineSpacing: 1.5
    }
  },
  conclusion: {
    title: {
      family: '黑体',
      size: '小四',
      bold: true,
      alignment: 'left'
    },
    content: {
      family: '宋体',
      size: '小四',
      alignment: 'justify',
      lineSpacing: 1.5
    }
  },
  references: {
    title: {
      family: '黑体',
      size: '小四',
      bold: true,
      alignment: 'left'
    },
    content: {
      family: '宋体',
      size: '小四',
      alignment: 'left',
      lineSpacing: 1.5
    }
  },
  contentChinese: {
    family: '宋体',
    size: '小四',
    alignment: 'justify',
    lineSpacing: 1.5
  },
  contentEnglish: {
    family: 'Times New Roman',
    size: '小四',
    alignment: 'justify',
    lineSpacing: 1.5
  },
  footnoteChinese: {
    family: '宋体',
    size: '小五'
  },
  footnoteEnglish: {
    family: 'Times New Roman',
    size: '小五'
  }
};