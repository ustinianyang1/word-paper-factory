import React from 'react';
import { Form, Input, Card } from 'antd';
import { PaperData, Footnote } from '../types/paper';
import { FootnoteManager } from './FootnoteManager';

interface ContentEditorProps {
  data: PaperData;
  footnotes: Footnote[];
  onDataChange: (data: PaperData) => void;
  onFootnotesChange: (footnotes: Footnote[]) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  data,
  footnotes,
  onDataChange,
  onFootnotesChange
}) => {
  const [form] = Form.useForm();

  const handleValuesChange = (_: Partial<PaperData>, allValues: PaperData) => {
    onDataChange(allValues);
  };

  return (
    <Card title="内容编辑" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={data}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          label="摘要"
          name="abstract"
        >
          <Input.TextArea
            placeholder="请输入摘要内容"
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="关键词"
          name="keywords"
        >
          <Input placeholder="请输入关键词，用分号分隔" />
        </Form.Item>

        <Form.Item
          label="引言"
          name="introduction"
        >
          <Input.TextArea
            placeholder="请输入引言内容"
            rows={6}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="正文内容"
          name="content"
          rules={[{ required: true, message: '请输入正文内容' }]}
          extra="使用 [1]、[2] 等格式标记脚注位置"
        >
          <Input.TextArea
            placeholder="请输入正文内容，支持多行输入"
            rows={12}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="结论"
          name="conclusion"
        >
          <Input.TextArea
            placeholder="请输入结论内容"
            rows={6}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="参考文献"
          name="references"
        >
          <Input.TextArea
            placeholder="请输入参考文献，每条参考文献占一行"
            rows={8}
            showCount
          />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 16 }}>
        <FootnoteManager footnotes={footnotes} onFootnotesChange={onFootnotesChange} />
      </div>
    </Card>
  );
};