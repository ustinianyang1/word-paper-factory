export interface PersonalInfoItem {
  id: string;
  label: string;
  value: string;
}

export interface PaperData {
  title: string;
  personalInfo: PersonalInfoItem[];
  abstract: string;
  keywords: string;
  introduction: string;
  content: string;
  conclusion: string;
  references: string;
}

export interface Footnote {
  id: number;
  content: string;
}

export interface PaperWithFootnotes extends PaperData {
  footnotes: Footnote[];
}