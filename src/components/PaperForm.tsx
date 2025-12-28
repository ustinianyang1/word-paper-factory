import React, { useEffect } from 'react';
import { Form, Input, Card, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePaperStore } from '../store/paperStore';
import { sanitizeText, LIMITS } from '../utils/security';

export const PaperForm: React.FC = () => {
  const [form] = Form.useForm();
  const { paperData, updatePaperData, addPersonalInfoItem, deletePersonalInfoItem } = usePaperStore();

  useEffect(() => {
    form.setFieldsValue(paperData);
  }, [paperData, form]);

  const handleValuesChange = (_: any, allValues: any) => {
    // Sanitize all text inputs
    const sanitizedValues = {
      ...allValues,
      title: sanitizeText(allValues.title || '', LIMITS.TITLE_MAX_LENGTH),
      abstract: sanitizeText(allValues.abstract || '', LIMITS.ABSTRACT_MAX_LENGTH),
      keywords: sanitizeText(allValues.keywords || '', LIMITS.KEYWORDS_MAX_LENGTH),
      introduction: sanitizeText(allValues.introduction || '', LIMITS.CONTENT_MAX_LENGTH),
      content: sanitizeText(allValues.content || '', LIMITS.CONTENT_MAX_LENGTH),
      conclusion: sanitizeText(allValues.conclusion || '', LIMITS.CONTENT_MAX_LENGTH),
      references: sanitizeText(allValues.references || '', LIMITS.CONTENT_MAX_LENGTH),
      personalInfo: (allValues.personalInfo || []).map((item: any) => ({
        ...item,
        label: sanitizeText(item?.label || '', LIMITS.PERSONAL_INFO_LABEL_MAX_LENGTH),
        value: sanitizeText(item?.value || '', LIMITS.PERSONAL_INFO_VALUE_MAX_LENGTH)
      }))
    };
    
    updatePaperData(sanitizedValues);
  };

  return (
    <Card title="文档信息" style={{ marginBottom: 16 }} aria-label="文档信息表单">
      <Form
        form={form}
        layout="vertical"
        initialValues={paperData}
        onValuesChange={handleValuesChange}
        autoComplete="off"
        aria-label="论文信息表单"
      >
        <Form.Item
          label="题目"
          name="title"
          rules={[{ required: true, message: '请输入题目' }]}
          aria-describedby="title-help"
        >
          <Input 
            placeholder="请输入论文题目" 
            aria-required="true"
            aria-describedby="title-help"
          />
        </Form.Item>

        <Form.List name="personalInfo" aria-label="个人信息列表">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space 
                  key={key} 
                  style={{ display: 'flex', marginBottom: 8 }} 
                  align="baseline"
                  role="group"
                  aria-label={`个人信息项 ${name + 1}`}
                >
                  <Form.Item
                    key={`${key}-label`}
                    {...restField}
                    name={[name, 'label']}
                    rules={[{ required: true, message: '请输入标签' }]}
                    aria-label={`个人信息项 ${name + 1} 标签`}
                    aria-required="true"
                  >
                    <Input placeholder="标签 (例如: 姓名)" />
                  </Form.Item>
                  <Form.Item
                    key={`${key}-value`}
                    {...restField}
                    name={[name, 'value']}
                    rules={[{ required: true, message: '请输入内容' }]}
                    aria-label={`个人信息项 ${name + 1} 内容`}
                    aria-required="true"
                  >
                    <Input placeholder="内容" />
                  </Form.Item>
                  <DeleteOutlined 
                    onClick={() => {
                      const currentValues = form.getFieldValue('personalInfo');
                      if (currentValues && Array.isArray(currentValues) && currentValues[name] && currentValues[name]?.id) {
                        deletePersonalInfoItem(currentValues[name].id);
                      }
                      remove(name);
                    }}
                    aria-label={`删除个人信息项 ${name + 1}`}
                    style={{ cursor: 'pointer' }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const currentValues = form.getFieldValue('personalInfo');
                        if (currentValues && Array.isArray(currentValues) && currentValues[name] && currentValues[name]?.id) {
                          deletePersonalInfoItem(currentValues[name].id);
                        }
                        remove(name);
                      }
                    }}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => {
                    addPersonalInfoItem();
                    add();
                  }} 
                  block 
                  icon={<PlusOutlined />}
                  aria-label="添加个人信息项"
                >
                  添加个人信息项
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Card>
  );
};