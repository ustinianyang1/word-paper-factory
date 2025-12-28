import React, { useState } from 'react';
import {
  Card,
  Form,
  Select,
  Switch,
  Button,
  Space,
  Collapse,
  Input,
  message,
  Modal
} from 'antd';
import { FormatConfig, FontFamily, FontSize, Alignment, LineSpacing } from '../types/format';
import { formatConfigManager } from '../core/formatConfig';

interface FormatSettingsProps {
  config: FormatConfig;
  onChange: (config: FormatConfig) => void;
}

export const FormatSettings: React.FC<FormatSettingsProps> = ({ config, onChange }) => {
  const [form] = Form.useForm();
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportedConfig, setExportedConfig] = useState('');
  const [importedConfig, setImportedConfig] = useState('');

  const handleValuesChange = (_: any, allValues: any) => {
    onChange(allValues);
  };

  const handleReset = () => {
    formatConfigManager.resetConfig();
    onChange(formatConfigManager.getConfig());
    message.success('已重置为默认格式');
  };

  const handleExport = () => {
    const configJson = formatConfigManager.exportConfig();
    setExportedConfig(configJson);
    setExportModalVisible(true);
  };

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportedConfig);
    message.success('已复制到剪贴板');
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportedConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'format-config.json';
    a.click();
    URL.revokeObjectURL(url);
    message.success('已下载配置文件');
  };

  const handleImport = () => {
    setImportedConfig('');
    setImportModalVisible(true);
  };

  const handleConfirmImport = () => {
    if (formatConfigManager.importConfig(importedConfig)) {
      onChange(formatConfigManager.getConfig());
      setImportModalVisible(false);
      message.success('配置导入成功');
    } else {
      message.error('配置导入失败，请检查格式');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (formatConfigManager.importConfig(content)) {
          onChange(formatConfigManager.getConfig());
          message.success('配置导入成功');
        } else {
          message.error('配置导入失败，请检查文件格式');
        }
      };
      reader.readAsText(file);
    }
  };

  const fontFamilyOptions: Array<{ label: string; value: FontFamily }> = [
    { label: '宋体', value: '宋体' },
    { label: '黑体', value: '黑体' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Arial', value: 'Arial' },
    { label: '微软雅黑', value: '微软雅黑' }
  ];

  const fontSizeOptions: Array<{ label: string; value: FontSize }> = [
    { label: '小五 (9pt)', value: '小五' },
    { label: '五号 (10.5pt)', value: '五号' },
    { label: '小四 (12pt)', value: '小四' },
    { label: '四号 (14pt)', value: '四号' },
    { label: '小三 (15pt)', value: '小三' },
    { label: '三号 (16pt)', value: '三号' },
    { label: '小二 (18pt)', value: '小二' },
    { label: '二号 (22pt)', value: '二号' },
    { label: '小一 (24pt)', value: '小一' },
    { label: '一号 (26pt)', value: '一号' }
  ];

  const alignmentOptions: Array<{ label: string; value: Alignment }> = [
    { label: '左对齐', value: 'left' },
    { label: '居中', value: 'center' },
    { label: '右对齐', value: 'right' },
    { label: '两端对齐', value: 'justify' }
  ];

  const lineSpacingOptions: Array<{ label: string; value: LineSpacing }> = [
    { label: '1.0倍', value: 1.0 },
    { label: '1.15倍', value: 1.15 },
    { label: '1.5倍', value: 1.5 },
    { label: '2.0倍', value: 2.0 }
  ];

  const items = [
    {
      key: 'title',
      label: '题目格式',
      children: [
        <Form.Item label={['title', 'family']} name={['title', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['title', 'size']} name={['title', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['title', 'bold']} name={['title', 'bold']} valuePropName="checked">
          <Switch checkedChildren="加粗" unCheckedChildren="常规" />
        </Form.Item>,
        <Form.Item label={['title', 'alignment']} name={['title', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    {
      key: 'personalInfo',
      label: '个人信息格式',
      children: [
        <Form.Item label={['personalInfo', 'family']} name={['personalInfo', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['personalInfo', 'size']} name={['personalInfo', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['personalInfo', 'alignment']} name={['personalInfo', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    {
      key: 'abstractTitle',
      label: '摘要标题格式',
      children: [
        <Form.Item label={['abstractTitle', 'family']} name={['abstractTitle', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['abstractTitle', 'size']} name={['abstractTitle', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['abstractTitle', 'alignment']} name={['abstractTitle', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    {
      key: 'abstractContent',
      label: '摘要内容格式',
      children: [
        <Form.Item label={['abstractContent', 'family']} name={['abstractContent', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['abstractContent', 'size']} name={['abstractContent', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['abstractContent', 'alignment']} name={['abstractContent', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    { key: 'keywordsTitle',
      label: '关键词标题格式',
      children: [
        <Form.Item label={['keywordsTitle', 'family']} name={['keywordsTitle', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['keywordsTitle', 'size']} name={['keywordsTitle', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['keywordsTitle', 'alignment']} name={['keywordsTitle', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    { key: 'keywordsContent',
      label: '关键词内容格式',
      children: [
        <Form.Item label={['keywordsContent', 'family']} name={['keywordsContent', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['keywordsContent', 'size']} name={['keywordsContent', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['keywordsContent', 'alignment']} name={['keywordsContent', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    { key: 'introductionTitle',
      label: '引言标题格式',
      children: [
        <Form.Item label={['introductionTitle', 'family']} name={['introductionTitle', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['introductionTitle', 'size']} name={['introductionTitle', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['introductionTitle', 'bold']} name={['introductionTitle', 'bold']} valuePropName="checked">
          <Switch checkedChildren="加粗" unCheckedChildren="常规" />
        </Form.Item>,
        <Form.Item label={['introductionTitle', 'alignment']} name={['introductionTitle', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    { key: 'introductionContent',
      label: '引言内容格式',
      children: [
        <Form.Item label={['introductionContent', 'family']} name={['introductionContent', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['introductionContent', 'size']} name={['introductionContent', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['introductionContent', 'alignment']} name={['introductionContent', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>,
        <Form.Item label={['introductionContent', 'lineSpacing']} name={['introductionContent', 'lineSpacing']}>
          <Select options={lineSpacingOptions} />
        </Form.Item>
      ]
    },
    { key: 'contentChinese',
      label: '正文格式（中文）',
      children: [
        <Form.Item label={['contentChinese', 'family']} name={['contentChinese', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['contentChinese', 'size']} name={['contentChinese', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['contentChinese', 'alignment']} name={['contentChinese', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>,
        <Form.Item label={['contentChinese', 'lineSpacing']} name={['contentChinese', 'lineSpacing']}>
          <Select options={lineSpacingOptions} />
        </Form.Item>
      ]
    },
    { key: 'contentEnglish',
      label: '正文格式（英文）',
      children: [
        <Form.Item label={['contentEnglish', 'family']} name={['contentEnglish', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['contentEnglish', 'size']} name={['contentEnglish', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['contentEnglish', 'alignment']} name={['contentEnglish', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>,
        <Form.Item label={['contentEnglish', 'lineSpacing']} name={['contentEnglish', 'lineSpacing']}>
          <Select options={lineSpacingOptions} />
        </Form.Item>
      ]
    },
    { key: 'conclusionTitle',
      label: '结论标题格式',
      children: [
        <Form.Item label={['conclusionTitle', 'family']} name={['conclusionTitle', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['conclusionTitle', 'size']} name={['conclusionTitle', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['conclusionTitle', 'bold']} name={['conclusionTitle', 'bold']} valuePropName="checked">
          <Switch checkedChildren="加粗" unCheckedChildren="常规" />
        </Form.Item>,
        <Form.Item label={['conclusionTitle', 'alignment']} name={['conclusionTitle', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    { key: 'conclusionContent',
      label: '结论内容格式',
      children: [
        <Form.Item label={['conclusionContent', 'family']} name={['conclusionContent', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['conclusionContent', 'size']} name={['conclusionContent', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['conclusionContent', 'alignment']} name={['conclusionContent', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>,
        <Form.Item label={['conclusionContent', 'lineSpacing']} name={['conclusionContent', 'lineSpacing']}>
          <Select options={lineSpacingOptions} />
        </Form.Item>
      ]
    },
    { key: 'referencesTitle',
      label: '参考文献标题格式',
      children: [
        <Form.Item label={['referencesTitle', 'family']} name={['referencesTitle', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['referencesTitle', 'size']} name={['referencesTitle', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['referencesTitle', 'bold']} name={['referencesTitle', 'bold']} valuePropName="checked">
          <Switch checkedChildren="加粗" unCheckedChildren="常规" />
        </Form.Item>,
        <Form.Item label={['referencesTitle', 'alignment']} name={['referencesTitle', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>
      ]
    },
    { key: 'referencesContent',
      label: '参考文献内容格式',
      children: [
        <Form.Item label={['referencesContent', 'family']} name={['referencesContent', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['referencesContent', 'size']} name={['referencesContent', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>,
        <Form.Item label={['referencesContent', 'alignment']} name={['referencesContent', 'alignment']}>
          <Select options={alignmentOptions} />
        </Form.Item>,
        <Form.Item label={['referencesContent', 'lineSpacing']} name={['referencesContent', 'lineSpacing']}>
          <Select options={lineSpacingOptions} />
        </Form.Item>
      ]
    },
    {
      key: 'footnoteChinese',
      label: '脚注格式（中文）',
      children: [
        <Form.Item label={['footnoteChinese', 'family']} name={['footnoteChinese', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['footnoteChinese', 'size']} name={['footnoteChinese', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>
      ]
    },
    {
      key: 'footnoteEnglish',
      label: '脚注格式（英文）',
      children: [
        <Form.Item label={['footnoteEnglish', 'family']} name={['footnoteEnglish', 'family']}>
          <Select options={fontFamilyOptions} />
        </Form.Item>,
        <Form.Item label={['footnoteEnglish', 'size']} name={['footnoteEnglish', 'size']}>
          <Select options={fontSizeOptions} />
        </Form.Item>
      ]
    }
  ];

  return (
    <Card
      title="格式设置"
      extra={
        <Space>
          <Button onClick={handleReset}>重置默认</Button>
          <Button onClick={handleExport}>导出配置</Button>
          <Button onClick={handleImport}>导入配置</Button>
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            id="import-file-input"
            onChange={handleFileImport}
          />
          <Button onClick={() => document.getElementById('import-file-input')?.click()}>
            从文件导入
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={config}
        onValuesChange={handleValuesChange}
      >
        <Collapse items={items} defaultActiveKey={['title']} />
      </Form>

      <Modal
        title="导出格式配置"
        open={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={[
          <Button key="copy" onClick={handleCopyExport}>
            复制到剪贴板
          </Button>,
          <Button key="download" type="primary" onClick={handleDownloadExport}>
            下载文件
          </Button>
        ]}
        width={600}
      >
        <Input.TextArea
          value={exportedConfig}
          readOnly
          rows={10}
          style={{ fontFamily: 'monospace' }}
        />
      </Modal>

      <Modal
        title="导入格式配置"
        open={importModalVisible}
        onOk={handleConfirmImport}
        onCancel={() => setImportModalVisible(false)}
        okText="导入"
        cancelText="取消"
      >
        <Input.TextArea
          value={importedConfig}
          onChange={(e) => setImportedConfig(e.target.value)}
          placeholder="请粘贴格式配置JSON"
          rows={10}
          style={{ fontFamily: 'monospace' }}
        />
      </Modal>
    </Card>
  );
};