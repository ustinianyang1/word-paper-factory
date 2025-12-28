import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { PaperData, Footnote } from '../types/paper';

const { Title, Paragraph, Text } = Typography;

interface PreviewProps {
  data: PaperData;
  footnotes: Footnote[];
}

export const Preview: React.FC<PreviewProps> = ({ data, footnotes }) => {
  const { title, personalInfo, abstract, keywords, introduction, content, conclusion, references } = data;

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

  return (
    <Card title="文档预览">
      <div style={{ padding: '20px', minHeight: '600px', background: '#fff' }}>
        <Title
          level={2}
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {title || '（题目）'}
        </Title>
        {personalInfo.length > 0 && personalInfo.filter(item => item != null).length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '30px', fontSize: '14px' }}>
            {personalInfo.filter(item => item != null).map((item, index) => (
              <React.Fragment key={item?.id || index}>
                <span>{item?.label || ''}：{item?.value || ''}</span>
                {index < personalInfo.length - 1 && <span> </span>}
              </React.Fragment>
            ))}
          </div>
        )}
        {abstract && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold' }}>
              摘  要
            </div>
            <div style={{ marginBottom: '20px', textIndent: '2em', lineHeight: '1.8' }}>
              {abstract}
            </div>
          </>
        )}
        {keywords && (
          <>
            <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              关键词
            </div>
            <div style={{ marginBottom: '30px', lineHeight: '1.8' }}>
              {keywords}
            </div>
          </>
        )}
        {introduction && (
          <>
            <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              引言
            </div>
            <div style={{ marginBottom: '20px', textIndent: '2em', lineHeight: '1.8' }}>
              {renderContentWithFootnotes(introduction)}
            </div>
          </>
        )}
        {content && (
          <>
            <Divider />
            <div style={{ lineHeight: '1.8' }}>
              {renderContentWithFootnotes(content)}
            </div>
          </>
        )}
        {conclusion && (
          <>
            <Divider />
            <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              结论
            </div>
            <div style={{ marginBottom: '20px', textIndent: '2em', lineHeight: '1.8' }}>
              {renderContentWithFootnotes(conclusion)}
            </div>
          </>
        )}
        {references && (
          <>
            <Divider />
            <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
              参考文献
            </div>
            <div style={{ marginBottom: '20px', lineHeight: '1.8' }}>
              {renderContentWithFootnotes(references)}
            </div>
          </>
        )}
        {footnotes.length > 0 && (
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
        )}
      </div>
    </Card>
  );
};