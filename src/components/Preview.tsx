import React, { useMemo } from 'react';
import { Card, Typography, Divider } from 'antd';
import { PaperData, Footnote } from '../types/paper';
import { FormatConfig } from '../types/format';

const { Title, Paragraph, Text } = Typography;

interface PreviewProps {
  data: PaperData;
  footnotes: Footnote[];
  formatConfig?: FormatConfig;
}

export const Preview: React.FC<PreviewProps> = ({ data, footnotes, formatConfig }) => {
  // Memoize filtered personal info to avoid repeated filtering
  const filteredPersonalInfo = useMemo(() => 
    data.personalInfo.filter(item => item != null), 
    [data.personalInfo]
  );

  // Content rendering function (not memoized to ensure it updates with format changes)
  const renderContentWithFootnotes = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (!line.trim()) {
        return <div key={index} style={{ height: '1em' }} />;
      }
      const parts = line.split(/(\[(\d+)\])/g);
      return (
        <Paragraph key={index} style={{ marginBottom: 8, textIndent: '2em' }}>
          {parts.map((part, i) => {
            const footnoteMatch = part.match(/\[(\d+)\]/);
            if (footnoteMatch) {
              return (
                <Text key={i} style={{ 
                  fontSize: '0.8em', 
                  verticalAlign: 'super',
                  color: '#1890ff',
                  cursor: 'pointer'
                }}>
                  {part}
                </Text>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </Paragraph>
      );
    });
  };

  // Helper function to get font size from config
  const getFontSize = (size: string): string => {
    const sizeMap: Record<string, string> = {
      '小五': '9pt',
      '五号': '10.5pt',
      '小四': '12pt',
      '四号': '14pt',
      '小三': '15pt',
      '三号': '16pt',
      '小二': '18pt',
      '二号': '22pt',
      '小一': '24pt',
      '一号': '26pt'
    };
    return sizeMap[size] || '12pt';
  };

  // Memoize sections to avoid re-rendering when content hasn't changed
  const abstractSection = useMemo(() => {
    if (!data.abstract) return null;
    return (
      <>
        <div style={{ 
          textAlign: formatConfig?.abstractTitle?.alignment === 'center' ? 'center' : 'left',
          marginBottom: '10px', 
          fontSize: getFontSize(formatConfig?.abstractTitle?.size || '小四'), 
          fontWeight: formatConfig?.abstractTitle?.bold ? 'bold' : 'normal',
          fontFamily: formatConfig?.abstractTitle?.family || '宋体'
        }}>
          摘  要
        </div>
        <div style={{ 
          marginBottom: '20px', 
          textIndent: '2em', 
          lineHeight: formatConfig?.abstractContent?.lineSpacing ? formatConfig.abstractContent.lineSpacing : 1.8,
          fontSize: getFontSize(formatConfig?.abstractContent?.size || '小四'),
          fontFamily: formatConfig?.abstractContent?.family || '宋体'
        }}>
          {data.abstract}
        </div>
      </>
    );
  }, [data.abstract, formatConfig?.abstractTitle, formatConfig?.abstractContent]);

  const keywordsSection = useMemo(() => {
    if (!data.keywords) return null;
    const config = formatConfig?.keywords;
    return (
      <div style={{ 
        marginBottom: '30px', 
        lineHeight: config?.lineSpacing ? config.lineSpacing : 1.8,
        fontSize: getFontSize(config?.size || '小四'),
        fontFamily: config?.family || '宋体'
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '8px' }}>
          关键词：
        </span>
        <span>{data.keywords}</span>
      </div>
    );
  }, [data.keywords, formatConfig?.keywords]);

  const introductionSection = useMemo(() => {
    if (!data.introduction) return null;
    const config = formatConfig?.introduction;
    return (
      <>
        <div style={{ 
          marginBottom: '10px', 
          fontSize: getFontSize(config?.title?.size || '小四'), 
          fontWeight: config?.title?.bold ? 'bold' : 'normal',
          fontFamily: config?.title?.family || '宋体'
        }}>
          引言
        </div>
        <div style={{ 
          marginBottom: '20px', 
          textIndent: '2em', 
          lineHeight: config?.content?.lineSpacing ? config.content.lineSpacing : 1.8,
          fontSize: getFontSize(config?.content?.size || '小四'),
          fontFamily: config?.content?.family || '宋体'
        }}>
          {renderContentWithFootnotes(data.introduction)}
        </div>
      </>
    );
  }, [data.introduction, formatConfig?.introduction]);

  const contentSection = useMemo(() => {
    if (!data.content) return null;
    const config = formatConfig?.contentChinese;
    return (
      <>
        <Divider />
        <div style={{ 
          lineHeight: config?.lineSpacing ? config.lineSpacing : 1.8,
          fontSize: getFontSize(config?.size || '小四'),
          fontFamily: config?.family || '宋体'
        }}>
          {renderContentWithFootnotes(data.content)}
        </div>
      </>
    );
  }, [data.content, formatConfig?.contentChinese]);

  const conclusionSection = useMemo(() => {
    if (!data.conclusion) return null;
    const config = formatConfig?.conclusion;
    return (
      <>
        <Divider />
        <div style={{ 
          marginBottom: '10px', 
          fontSize: getFontSize(config?.title?.size || '小四'), 
          fontWeight: config?.title?.bold ? 'bold' : 'normal',
          fontFamily: config?.title?.family || '宋体'
        }}>
          结论
        </div>
        <div style={{ 
          marginBottom: '20px', 
          textIndent: '2em', 
          lineHeight: config?.content?.lineSpacing ? config.content.lineSpacing : 1.8,
          fontSize: getFontSize(config?.content?.size || '小四'),
          fontFamily: config?.content?.family || '宋体'
        }}>
          {renderContentWithFootnotes(data.conclusion)}
        </div>
      </>
    );
  }, [data.conclusion, formatConfig?.conclusion]);

  const referencesSection = useMemo(() => {
    if (!data.references) return null;
    const config = formatConfig?.references;
    return (
      <>
        <Divider />
        <div style={{ 
          marginBottom: '10px', 
          fontSize: getFontSize(config?.title?.size || '小四'), 
          fontWeight: config?.title?.bold ? 'bold' : 'normal',
          fontFamily: config?.title?.family || '宋体'
        }}>
          参考文献
        </div>
        <div style={{ 
          marginBottom: '20px', 
          lineHeight: config?.content?.lineSpacing ? config.content.lineSpacing : 1.8,
          fontSize: getFontSize(config?.content?.size || '小四'),
          fontFamily: config?.content?.family || '宋体'
        }}>
          {renderContentWithFootnotes(data.references)}
        </div>
      </>
    );
  }, [data.references, formatConfig?.references]);

  const footnotesSection = useMemo(() => {
    if (footnotes.length === 0) return null;
    return (
      <>
        <Divider />
        <div style={{ marginTop: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          脚注
        </div>
        {footnotes.map((footnote) => (
          <div key={footnote.id} style={{ marginBottom: '8px', fontSize: '12px' }}>
            <Text strong>[{footnote.id}]</Text> {footnote.content || '（脚注内容）'}
          </div>
        ))}
      </>
    );
  }, [footnotes]);

  return (
    <Card title="文档预览">
      <div style={{ 
        padding: '20px', 
        minHeight: 'auto',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        background: '#fff' 
      }}>
        <Title
          level={2}
          style={{
            textAlign: formatConfig?.title?.alignment === 'center' ? 'center' : 'left',
            marginBottom: '20px',
            fontSize: getFontSize(formatConfig?.title?.size || '小四'),
            fontWeight: formatConfig?.title?.bold ? 'bold' : 'normal',
            fontFamily: formatConfig?.title?.family || '宋体'
          }}
        >
          {data.title || '（题目）'}
        </Title>
        {filteredPersonalInfo.length > 0 && (
          <div style={{ 
            textAlign: formatConfig?.personalInfo?.alignment === 'center' ? 'center' : 'left',
            marginBottom: '30px', 
            fontSize: getFontSize(formatConfig?.personalInfo?.size || '小四'),
            fontFamily: formatConfig?.personalInfo?.family || '宋体'
          }}>
            {filteredPersonalInfo.map((item, index) => (
              <React.Fragment key={item?.id || index}>
                <span>{item?.label || ''}：{item?.value || ''}</span>
                {index < filteredPersonalInfo.length - 1 && <span> </span>}
              </React.Fragment>
            ))}
          </div>
        )}
        {abstractSection}
        {keywordsSection}
        {introductionSection}
        {contentSection}
        {conclusionSection}
        {referencesSection}
        {footnotesSection}
      </div>
    </Card>
  );
};