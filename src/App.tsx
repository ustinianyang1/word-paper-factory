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

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const { paperData, footnotes, formatConfig, updatePaperData, updateFootnotes, updateFormatConfig } = usePaperStore();

  const handleGenerate = async () => {
    const requiredFields: Array<{ key: keyof Omit<typeof paperData, 'personalInfo'>; label: string }> = [
      { key: 'title', label: '题目' },
    ];

    for (const field of requiredFields) {
      if (!paperData[field.key]) {
        message.error(`请填写 ${field.label}`);
        return;
      }
    }

    for (const item of paperData.personalInfo) {
      if (!item.label || !item.value) {
        message.error('请填写完整的个人信息项');
        return;
      }
    }

    const footnoteRefsInContent = paperData.content.match(/\[(\d+)\]/g)?.map(ref => parseInt(ref.slice(1, -1))) || [];
    const footnoteIds = footnotes.map(f => f.id);
    const missingFootnotes = footnoteRefsInContent.filter(id => !footnoteIds.includes(id));

    if (missingFootnotes.length > 0) {
      message.warning(`正文中引用的脚注 [${missingFootnotes.join(', ')}] 不存在，请检查`);
    }

    setGenerating(true);
    try {
      const paperWithFootnotes: PaperWithFootnotes = {
        ...paperData,
        footnotes
      };

      const generator = new DocumentGenerator(paperWithFootnotes, formatConfig);
      const blob = await generator.generateBlob();
      const fileName = generator.getFileName();

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
          <FileTextOutlined style={{ marginRight: 8 }} />
          Word文档自动生成器
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleGenerate}
          loading={generating}
          size="large"
        >
          生成并下载文档
        </Button>
      </Header>

      <Content style={{ padding: '24px' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'edit',
              label: '文档编辑',
              icon: <FileTextOutlined />,
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
                    <Preview data={paperData} footnotes={footnotes} />
                  </Col>
                </Row>
              )
            },
            {
              key: 'settings',
              label: '格式设置',
              icon: <SettingOutlined />,
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <FormatSettings config={formatConfig} onChange={handleFormatConfigChange} />
                  </Col>
                  <Col xs={24} lg={12}>
                    <Preview data={paperData} footnotes={footnotes} />
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