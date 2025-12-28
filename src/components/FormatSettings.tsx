import React, { useState, useMemo, useEffect } from 'react';
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
  Modal,
  InputNumber
} from 'antd';
import { FormatConfig, FontFamily, FontSize, Alignment, LineSpacing } from '../types/format';
import { formatConfigManager } from '../core/formatConfig';
import { validateConfigJSON, sanitizeText } from '../utils/security';

interface FormatSettingsProps {
  config: FormatConfig;
  onChange: (config: FormatConfig) => void;
}

// Helper function to create form items
const createFormItem = (key: string, label: string[], name: string[], component: React.ReactNode) => (
  <Form.Item key={key} label={label} name={name}>
    {component}
  </Form.Item>
);

// Helper function to create format section items
const createFormatSectionItems = (
  sectionPath: string[],
  displayLabel: string,
  fontFamilyOptions: Array<{ label: string; value: FontFamily }>,
  fontSizeOptions: Array<{ label: string; value: FontSize }>,
  alignmentOptions: Array<{ label: string; value: Alignment }>,
  lineSpacingOptions: Array<{ label: string; value: LineSpacing }>,
  hasBold = false,
  hasLineSpacing = false
) => {
  const items = [
    createFormItem(
      `${sectionPath.join('-')}-family`,
      [displayLabel, '字体'],
      [...sectionPath, 'family'],
      <Select options={fontFamilyOptions} />
    ),
    createFormItem(
      `${sectionPath.join('-')}-size`,
      [displayLabel, '字号'],
      [...sectionPath, 'size'],
      <Select options={fontSizeOptions} />
    )
  ];

  if (hasBold) {
    items.push(
      createFormItem(
        `${sectionPath.join('-')}-bold`,
        [displayLabel, '加粗'],
        [...sectionPath, 'bold'],
        <Switch checkedChildren="加粗" unCheckedChildren="常规" />
      )
    );
  }

  items.push(
    createFormItem(
      `${sectionPath.join('-')}-alignment`,
      [displayLabel, '对齐方式'],
      [...sectionPath, 'alignment'],
      <Select options={alignmentOptions} />
    )
  );

  if (hasLineSpacing) {
    items.push(
      createFormItem(
        `${sectionPath.join('-')}-lineSpacing`,
        [displayLabel, '行间距'],
        [...sectionPath, 'lineSpacing'],
        <Select options={lineSpacingOptions} />
      )
    );
  }

  return items;
};

export const FormatSettings: React.FC<FormatSettingsProps> = ({ config, onChange }) => {
  const [form] = Form.useForm();
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [exportedConfig, setExportedConfig] = useState('');
  const [importedConfig, setImportedConfig] = useState('');

  // Memoize the format options to prevent unnecessary re-renders
  const formatOptions = useMemo(() => ({
    fontFamily: [
      { label: '宋体', value: '宋体' },
      { label: '黑体', value: '黑体' },
      { label: 'Times New Roman', value: 'Times New Roman' },
      { label: 'Arial', value: 'Arial' },
      { label: '微软雅黑', value: '微软雅黑' }
    ] as Array<{ label: string; value: FontFamily }>,
    
    fontSize: [
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
    ] as Array<{ label: string; value: FontSize }>,
    
    alignment: [
      { label: '左对齐', value: 'left' },
      { label: '居中', value: 'center' },
      { label: '右对齐', value: 'right' },
      { label: '两端对齐', value: 'justify' }
    ] as Array<{ label: string; value: Alignment }>,
    
    lineSpacing: [
      { label: '1.0倍', value: 1.0 },
      { label: '1.15倍', value: 1.15 },
      { label: '1.5倍', value: 1.5 },
      { label: '2.0倍', value: 2.0 }
    ] as Array<{ label: string; value: LineSpacing }>
  }), []);

  // Memoize the items array to prevent unnecessary re-renders
  const items = useMemo(() => [
    {
      key: 'title',
      label: '题目格式',
      children: createFormatSectionItems(
        ['title'],
        '题目',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        true, // hasBold
        false // hasLineSpacing
      )
    },
    {
      key: 'personalInfo',
      label: '个人信息格式',
      children: createFormatSectionItems(
        ['personalInfo'],
        '个人信息',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        false // hasLineSpacing
      )
    },
    {
      key: 'abstractTitle',
      label: '摘要标题格式',
      children: createFormatSectionItems(
        ['abstractTitle'],
        '摘要标题',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        false // hasLineSpacing
      )
    },
    {
      key: 'abstractContent',
      label: '摘要内容格式',
      children: createFormatSectionItems(
        ['abstractContent'],
        '摘要内容',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        false // hasLineSpacing
      )
    },
    {
      key: 'keywords',
      label: '关键词格式',
      children: [
        ...createFormatSectionItems(
          ['keywords'],
          '关键词标题',
          formatOptions.fontFamily,
          formatOptions.fontSize,
          formatOptions.alignment,
          formatOptions.lineSpacing,
          true, // hasBold
          false // hasLineSpacing
        )
      ]
    },
    {
      key: 'introductionTitle',
      label: '引言标题格式',
      children: createFormatSectionItems(
        ['introduction', 'title'],
        '引言标题',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        true, // hasBold
        false // hasLineSpacing
      )
    },
    {
      key: 'introductionContent',
      label: '引言内容格式',
      children: createFormatSectionItems(
        ['introduction', 'content'],
        '引言内容',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        true // hasLineSpacing
      )
    },
    {
      key: 'contentChinese',
      label: '正文格式（中文）',
      children: createFormatSectionItems(
        ['contentChinese'],
        '正文中文',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        true // hasLineSpacing
      )
    },
    {
      key: 'contentEnglish',
      label: '正文格式（英文）',
      children: createFormatSectionItems(
        ['contentEnglish'],
        '正文英文',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        true // hasLineSpacing
      )
    },
    {
      key: 'conclusionTitle',
      label: '结论标题格式',
      children: createFormatSectionItems(
        ['conclusion', 'title'],
        '结论标题',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        true, // hasBold
        false // hasLineSpacing
      )
    },
    {
      key: 'conclusionContent',
      label: '结论内容格式',
      children: createFormatSectionItems(
        ['conclusion', 'content'],
        '结论内容',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        true // hasLineSpacing
      )
    },
    {
      key: 'referencesTitle',
      label: '参考文献标题格式',
      children: createFormatSectionItems(
        ['references', 'title'],
        '参考文献标题',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        true, // hasBold
        false // hasLineSpacing
      )
    },
    {
      key: 'referencesContent',
      label: '参考文献内容格式',
      children: createFormatSectionItems(
        ['references', 'content'],
        '参考文献内容',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        true // hasLineSpacing
      )
    },
    {
      key: 'footnoteChinese',
      label: '脚注格式（中文）',
      children: createFormatSectionItems(
        ['footnoteChinese'],
        '脚注中文',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        false // hasLineSpacing
      ).slice(0, 2) // Only family and size for footnotes
    },
    {
      key: 'footnoteEnglish',
      label: '脚注格式（英文）',
      children: createFormatSectionItems(
        ['footnoteEnglish'],
        '脚注英文',
        formatOptions.fontFamily,
        formatOptions.fontSize,
        formatOptions.alignment,
        formatOptions.lineSpacing,
        false, // hasBold
        false // hasLineSpacing
      ).slice(0, 2) // Only family and size for footnotes
    },
    {
      key: 'numberingIndents',
      label: '序号缩进设置',
      children: [
        <Form.Item
          key="numberingIndents-level1"
          label={['一级序号缩进', '（一、二、三、）']}
          name={['numberingIndents', 'level1']}
        >
          <InputNumber min={0} max={20} step={0.5} addonAfter="em" />
        </Form.Item>,
        <Form.Item
          key="numberingIndents-level2"
          label={['二级序号缩进', '（（一）（二）（三））']}
          name={['numberingIndents', 'level2']}
        >
          <InputNumber min={0} max={20} step={0.5} addonAfter="em" />
        </Form.Item>,
        <Form.Item
          key="numberingIndents-level3"
          label={['三级序号缩进', '（1. 2. 3.）']}
          name={['numberingIndents', 'level3']}
        >
          <InputNumber min={0} max={20} step={0.5} addonAfter="em" />
        </Form.Item>,
        <Form.Item
          key="numberingIndents-level4"
          label={['四级序号缩进', '（（1）（2）（3））']}
          name={['numberingIndents', 'level4']}
        >
          <InputNumber min={0} max={20} step={0.5} addonAfter="em" />
        </Form.Item>,
        <Form.Item
          key="numberingIndents-level5"
          label={['五级序号缩进', '（①②③）']}
          name={['numberingIndents', 'level5']}
        >
          <InputNumber min={0} max={20} step={0.5} addonAfter="em" />
        </Form.Item>
      ]
    }
  ], [formatOptions]);

  const handleValuesChange = (_: any, allValues: any) => {
    onChange(allValues);
  };

  const handleReset = () => {
    formatConfigManager.resetConfig();
    const newConfig = formatConfigManager.getConfig();
    onChange(newConfig);
    form.setFieldsValue(newConfig);
    message.success('已重置为默认格式');
  };

  // Sync form values when config prop changes
  useEffect(() => {
    form.setFieldsValue(config);
  }, [config]);

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
    // Sanitize input first
    const sanitizedConfig = sanitizeText(importedConfig, 10000);
    
    // Validate JSON format
    const validation = validateConfigJSON(sanitizedConfig);
    if (!validation.isValid) {
      message.error(`配置导入失败: ${validation.error}`);
      return;
    }
    
    if (formatConfigManager.importConfig(sanitizedConfig)) {
      onChange(formatConfigManager.getConfig());
      setImportModalVisible(false);
      message.success('配置导入成功');
    } else {
      message.error('配置导入失败，请检查格式');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const allowedTypes = ['application/json', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      message.error('只支持 JSON 文件');
      return;
    }
    
    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      message.error('文件大小不能超过 1MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        message.error('文件内容为空');
        return;
      }
      
      // Sanitize and validate
      const sanitizedContent = sanitizeText(content, 10000);
      const validation = validateConfigJSON(sanitizedContent);
      
      if (!validation.isValid) {
        message.error(`配置导入失败: ${validation.error}`);
        return;
      }
      
      if (formatConfigManager.importConfig(sanitizedContent)) {
        onChange(formatConfigManager.getConfig());
        message.success('配置导入成功');
      } else {
        message.error('配置导入失败，请检查文件格式');
      }
    };
    
    reader.onerror = () => {
      message.error('文件读取失败');
    };
    
    reader.readAsText(file);
  };

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