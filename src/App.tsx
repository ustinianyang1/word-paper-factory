import React, { useState } from 'react';
import { Layout, Button, message, Tabs, Space, Row, Col } from 'antd';
import { DownloadOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import { PaperForm } from './components/PaperForm';
import { ContentEditor } from './components/ContentEditor';
import { FormatSettings } from './components/FormatSettings';
import { Preview } from './components/Preview';
import { usePaperStore } from './store/paperStore';
import { DocumentGenerator } from './core/documentGenerator';
import { PaperWithFootnotes } from './types/paper';
import { 
  sanitizeText, 
  validateFootnoteReferences, 
  validatePersonalInfo,
  LIMITS,
  sanitizeFileName 
} from './utils/security';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const { paperData, footnotes, formatConfig, updatePaperData, updateFootnotes, updateFormatConfig } = usePaperStore();

  const handleGenerate = async () => {
    // Validate required fields
    if (!paperData.title || paperData.title.trim() === '') {
      message.error('请填写题目');
      return;
    }
    
    // Sanitize title
    const sanitizedTitle = sanitizeText(paperData.title, LIMITS.TITLE_MAX_LENGTH);
    if (sanitizedTitle !== paperData.title) {
      message.warning('标题已自动调整');
    }
    
    // Validate personal info
    const personalInfoValidation = validatePersonalInfo(paperData.personalInfo);
    if (!personalInfoValidation.isValid) {
      message.error(personalInfoValidation.errors.join('; '));
      return;
    }
    
    // Validate footnote references
    const footnoteValidation = validateFootnoteReferences(paperData.content, footnotes);
    if (!footnoteValidation.isValid && footnoteValidation.invalidRefs.length > 0) {
      message.warning(`正文中引用的脚注 [${footnoteValidation.invalidRefs.join(', ')}] 不存在，请检查`);
    }
    
    // Validate content length
    if (paperData.content.length > LIMITS.CONTENT_MAX_LENGTH) {
      message.error(`正文内容过长，最多支持 ${LIMITS.CONTENT_MAX_LENGTH} 个字符`);
      return;
    }
    
    setGenerating(true);
    try {
      // Create sanitized paper data
      const sanitizedPaperData: PaperWithFootnotes = {
        title: sanitizedTitle,
        personalInfo: paperData.personalInfo.map(item => ({
          id: item.id,
          label: sanitizeText(item.label || '', LIMITS.PERSONAL_INFO_LABEL_MAX_LENGTH),
          value: sanitizeText(item.value || '', LIMITS.PERSONAL_INFO_VALUE_MAX_LENGTH)
        })),
        abstract: sanitizeText(paperData.abstract || '', LIMITS.ABSTRACT_MAX_LENGTH),
        keywords: sanitizeText(paperData.keywords || '', LIMITS.KEYWORDS_MAX_LENGTH),
        introduction: sanitizeText(paperData.introduction || '', LIMITS.CONTENT_MAX_LENGTH),
        content: sanitizeText(paperData.content, LIMITS.CONTENT_MAX_LENGTH),
        conclusion: sanitizeText(paperData.conclusion || '', LIMITS.CONTENT_MAX_LENGTH),
        references: sanitizeText(paperData.references || '', LIMITS.CONTENT_MAX_LENGTH),
        footnotes: footnotes.map(f => ({
          id: f.id,
          content: sanitizeText(f.content || '', LIMITS.FOOTNOTE_MAX_LENGTH)
        }))
      };

      const generator = new DocumentGenerator(sanitizedPaperData, formatConfig);
      const blob = await generator.generateBlob();
      
      // Sanitize filename
      const fileName = sanitizeFileName(sanitizedTitle) + '.docx';

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      message.success('文档生成成功！');
    } catch (error) {
      console.error('生成文档失败:', error);
      message.error('生成文档失败，请检查浏览器控制台获取详细信息');
    } finally {
      setGenerating(false);
    }
  };

  const handleFormatConfigChange = (config: typeof formatConfig) => {
    updateFormatConfig(config);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
          <FileTextOutlined style={{ marginRight: 8 }} aria-label="文档图标" />
          <span aria-label="应用程序标题">Word文档自动生成器</span>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleGenerate}
          loading={generating}
          size="large"
          aria-label="生成并下载文档"
        >
          生成并下载文档
        </Button>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          aria-label="主要功能选项卡"
          items={[
            {
              key: 'edit',
              label: (
                <span>
                  <FileTextOutlined aria-label="编辑图标" />
                  文档编辑
                </span>
              ),
              icon: <FileTextOutlined aria-hidden="true" />,
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <PaperForm />
                      <ContentEditor
                        data={paperData}
                        footnotes={footnotes}
                        onDataChange={updatePaperData}
                        onFootnotesChange={updateFootnotes}
                      />
                    </Space>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Preview data={paperData} footnotes={footnotes} formatConfig={formatConfig} />
                  </Col>
                </Row>
              )
            },
            {
              key: 'settings',
              label: (
                <span>
                  <SettingOutlined aria-label="设置图标" />
                  格式设置
                </span>
              ),
              icon: <SettingOutlined aria-hidden="true" />,
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <FormatSettings config={formatConfig} onChange={handleFormatConfigChange} />
                  </Col>
                  <Col xs={24} lg={12}>
                    <Preview data={paperData} footnotes={footnotes} formatConfig={formatConfig} />
                  </Col>
                </Row>
              )
            }
          ]}
        />
      </Content>
    </Layout>
  );
};

export default App;