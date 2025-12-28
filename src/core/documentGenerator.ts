import * as docx from 'docx';
import { PaperWithFootnotes, PersonalInfoItem } from '../types/paper';
import { FormatConfig, SectionFormat } from '../types/format';
import { getFontSizeInHalfPoints, detectLanguage } from '../utils/fontUtils';

export class DocumentGenerator {
  private data: PaperWithFootnotes;
  private config: FormatConfig;

  constructor(data: PaperWithFootnotes, config: FormatConfig) {
    this.data = data;
    this.config = config;
  }

  generate(): docx.Document {
    const { title, personalInfo, abstract, keywords, introduction, content, conclusion, references, footnotes } = this.data;

    const children: docx.Paragraph[] = [];

    children.push(this.createTitleParagraph(title));
    children.push(this.createPersonalInfoParagraph(personalInfo));
    
    if (abstract.trim()) {
      children.push(this.createAbstractTitleParagraph());
      children.push(this.createAbstractContentParagraph(abstract));
    }

    if (keywords.trim()) {
      children.push(this.createKeywordsParagraph(keywords));
    }

    if (introduction.trim()) {
      children.push(...this.createSectionParagraphs('引言', introduction, this.config.introduction));
    }
    
    if (content.trim()) {
      children.push(...this.createContentParagraphs(content, footnotes));
    }

    if (conclusion.trim()) {
      children.push(...this.createSectionParagraphs('结论', conclusion, this.config.conclusion));
    }

    if (references.trim()) {
      children.push(...this.createSectionParagraphs('参考文献', references, this.config.references, false));
    }

    const doc = new docx.Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: docx.convertMillimetersToTwip(25.4),
                right: docx.convertMillimetersToTwip(25.4),
                bottom: docx.convertMillimetersToTwip(25.4),
                left: docx.convertMillimetersToTwip(25.4)
              }
            }
          },
          children
        }
      ]
    });

    return doc;
  }

  private createParagraph(textOrTextRuns: string | Array<{ text: string; bold?: boolean }>, format: any, options?: {
    indent?: boolean;
    spacingBefore?: number;
    spacingAfter?: number;
  }): docx.Paragraph {
    const { indent = false, spacingBefore = 5, spacingAfter = 15 } = options || {};
    const fontSize = getFontSizeInHalfPoints(format.size);

    let textRuns: docx.TextRun[];
    if (typeof textOrTextRuns === 'string') {
      textRuns = [
        new docx.TextRun({
          text: textOrTextRuns,
          font: format.family,
          size: fontSize,
          bold: format.bold
        })
      ];
    } else {
      textRuns = textOrTextRuns.map(item => new docx.TextRun({
        text: item.text,
        font: format.family,
        size: fontSize,
        bold: item.bold || format.bold
      }));
    }

    return new docx.Paragraph({
      alignment: this.getAlignmentType(format.alignment),
      spacing: {
        line: 'lineSpacing' in format ? (format.lineSpacing ? 360 * format.lineSpacing : 360) : 360,
        before: docx.convertMillimetersToTwip(spacingBefore),
        after: docx.convertMillimetersToTwip(spacingAfter)
      },
      indent: indent ? { firstLine: docx.convertMillimetersToTwip(20) } : {},
      children: textRuns
    });
  }

  private createTitleParagraph(title: string): docx.Paragraph {
    return this.createParagraph(title, this.config.title, {
      spacingBefore: 10,
      spacingAfter: 10
    });
  }

  private createPersonalInfoParagraph(personalInfo: PersonalInfoItem[]): docx.Paragraph {
    const text = personalInfo.map(item => `${item.label}：${item.value}`).join('  ');
    return this.createParagraph(text, this.config.personalInfo, {
      spacingBefore: 5,
      spacingAfter: 15
    });
  }

  private createAbstractTitleParagraph(): docx.Paragraph {
    return this.createParagraph('摘  要', this.config.abstractTitle, {
      spacingBefore: 10,
      spacingAfter: 5
    });
  }

  private createAbstractContentParagraph(abstract: string): docx.Paragraph {
    return this.createParagraph(abstract, this.config.abstractContent, {
      indent: true,
      spacingBefore: 5,
      spacingAfter: 15
    });
  }

  private createKeywordsParagraph(keywords: string): docx.Paragraph {
    return this.createParagraph(
      [
        { text: '关键词：', bold: true },
        { text: keywords }
      ],
      this.config.keywords,
      {
        spacingBefore: 5,
        spacingAfter: 15
      }
    );
  }

  private createSectionParagraphs(title: string, content: string, format: SectionFormat, firstLineIndent = true): docx.Paragraph[] {
    const paragraphs: docx.Paragraph[] = [];

    // Create section title paragraph
    paragraphs.push(this.createParagraph(title, format.title, {
      spacingBefore: 10,
      spacingAfter: 5
    }));

    // Create content paragraphs
    const lines = content.split('\n');
    lines.forEach(line => {
      if (!line.trim()) {
        paragraphs.push(new docx.Paragraph({ text: '' }));
        return;
      }

      paragraphs.push(this.createParagraph(line, format.content, {
        indent: firstLineIndent,
        spacingBefore: 5,
        spacingAfter: 5
      }));
    });

    return paragraphs;
  }

  private createContentParagraphs(content: string, footnotes: PaperWithFootnotes['footnotes']): docx.Paragraph[] {
    const paragraphs: docx.Paragraph[] = [];
    const { contentChinese, contentEnglish } = this.config;

    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (!line.trim()) {
        paragraphs.push(new docx.Paragraph({ text: '' }));
        return;
      }

      const language = detectLanguage(line);
      const format = language === 'english' ? contentEnglish : contentChinese;
      const fontSize = getFontSizeInHalfPoints(format.size);

      const footnoteRefs = this.extractFootnoteReferences(line);
      const textRuns: any[] = [];

      if (footnoteRefs.length > 0) {
        let lastIndex = 0;
        footnoteRefs.forEach(ref => {
          const beforeText = line.substring(lastIndex, ref.start);
          if (beforeText) {
            textRuns.push(new docx.TextRun({
              text: beforeText,
              font: format.family,
              size: fontSize
            }));
          }

          const footnote = footnotes.find(f => f.id === ref.id);
          if (footnote && footnote.content) {
            textRuns.push(new docx.FootnoteReferenceRun(ref.id));
          } else {
            textRuns.push(new docx.TextRun({
              text: `[${ref.id}]`,
              font: format.family,
              size: fontSize,
            }));
          }

          lastIndex = ref.end;
        });

        const remainingText = line.substring(lastIndex);
        if (remainingText) {
          textRuns.push(new docx.TextRun({
            text: remainingText,
            font: format.family,
            size: fontSize
          }));
        }
      } else {
        textRuns.push(new docx.TextRun({
          text: line,
          font: format.family,
          size: fontSize
        }));
      }

      paragraphs.push(new docx.Paragraph({
        alignment: this.getAlignmentType(format.alignment),
        spacing: {
          line: format.lineSpacing ? 360 * format.lineSpacing : 360,
          before: docx.convertMillimetersToTwip(5),
          after: docx.convertMillimetersToTwip(5)
        },
        indent: {
          firstLine: docx.convertMillimetersToTwip(20)
        },
        children: textRuns
      }));
    });

    return paragraphs;
  }

  private extractFootnoteReferences(text: string): Array<{ id: number; start: number; end: number }> {
    const refs: Array<{ id: number; start: number; end: number }> = [];
    const regex = /\[(\d+)\]/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      refs.push({
        id: parseInt(match[1]),
        start: match.index,
        end: match.index + match[0].length
      });
    }

    return refs;
  }

  private getAlignmentType(alignment: string): "left" | "center" | "right" | "both" {
    // Use object lookup instead of switch for better performance
    const alignmentMap: Record<string, "left" | "center" | "right" | "both"> = {
      left: 'left',
      center: 'center',
      right: 'right',
      justify: 'both'
    };
    
    return alignmentMap[alignment] || 'left';
  }

  async generateBlob(): Promise<Blob> {
    const doc = this.generate();
    return await docx.Packer.toBlob(doc);
  }

  async generateBuffer(): Promise<Uint8Array> {
    const doc = this.generate();
    return await docx.Packer.toBuffer(doc);
  }

  getFileName(): string {
    const { title } = this.data;
    return `${title}.docx`;
  }
}