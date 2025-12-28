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
    <Card title="内容编辑" style={{ marginBottom: 16 }} aria-label="内容编辑器">
      <Form
        form={form}
        layout="vertical"
        initialValues={data}
        onValuesChange={handleValuesChange}
        aria-label="论文内容表单"
      >
        <Form.Item
          label="摘要"
          name="abstract"
          aria-describedby="abstract-help"
        >
          <Input.TextArea
            placeholder="请输入摘要内容"
            rows={4}
            showCount
            maxLength={500}
            aria-describedby="abstract-help"
          />
        </Form.Item>

        <Form.Item
          label="关键词"
          name="keywords"
          aria-describedby="keywords-help"
        >
          <Input 
            placeholder="请输入关键词，用分号分隔" 
            aria-describedby="keywords-help"
          />
        </Form.Item>

        <Form.Item
          label="引言"
          name="introduction"
          aria-describedby="introduction-help"
        >
          <Input.TextArea
            placeholder="请输入引言内容"
            rows={6}
            showCount
            aria-describedby="introduction-help"
          />
        </Form.Item>

        <Form.Item
          label="正文内容"
          name="content"
          rules={[{ required: true, message: '请输入正文内容' }]}
          extra="使用 [1]、[2] 等格式标记脚注位置"
          aria-describedby="content-help"
          aria-required="true"
        >
          <Input.TextArea
            placeholder="请输入正文内容，支持多行输入"
            rows={12}
            showCount
            aria-required="true"
            aria-describedby="content-help"
          />
        </Form.Item>

        <Form.Item
          label="结论"
          name="conclusion"
          aria-describedby="conclusion-help"
        >
          <Input.TextArea
            placeholder="请输入结论内容"
            rows={6}
            showCount
            aria-describedby="conclusion-help"
          />
        </Form.Item>

        <Form.Item
          label="参考文献"
          name="references"
          aria-describedby="references-help"
        >
          <Input.TextArea
            placeholder="请输入参考文献，每条参考文献占一行"
            rows={8}
            showCount
            aria-describedby="references-help"
          />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 16 }} role="region" aria-label="脚注管理">
        <FootnoteManager footnotes={footnotes} onFootnotesChange={onFootnotesChange} />
      </div>
    </Card>
  );
};