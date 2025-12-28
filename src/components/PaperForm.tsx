import React, { useEffect } from 'react';
import { Form, Input, Card, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePaperStore } from '../store/paperStore';

export const PaperForm: React.FC = () => {
  const [form] = Form.useForm();
  const { paperData, updatePaperData, addPersonalInfoItem, deletePersonalInfoItem } = usePaperStore();

  useEffect(() => {
    form.setFieldsValue(paperData);
  }, [paperData, form]);

  const handleValuesChange = (_: any, allValues: any) => {
    updatePaperData(allValues);
  };

  return (
    <Card title="文档信息" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={paperData}
        onValuesChange={handleValuesChange}
        autoComplete="off"
      >
        <Form.Item
          label="题目"
          name="title"
          rules={[{ required: true, message: '请输入题目' }]}
        >
          <Input placeholder="请输入论文题目" />
        </Form.Item>

        <Form.List name="personalInfo">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'label']}
                    rules={[{ required: true, message: '请输入标签' }]}
                  >
                    <Input placeholder="标签 (例如: 姓名)" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    rules={[{ required: true, message: '请输入内容' }]}
                  >
                    <Input placeholder="内容" />
                  </Form.Item>
                  <DeleteOutlined onClick={() => {
                    const currentValues = form.getFieldValue('personalInfo');
                    if (currentValues && Array.isArray(currentValues) && currentValues[name] && currentValues[name]?.id) {
                      deletePersonalInfoItem(currentValues[name].id);
                    }
                    remove(name);
                  }} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => {
                  addPersonalInfoItem();
                  add();
                }} block icon={<PlusOutlined />}>
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