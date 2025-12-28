import React from 'react';
import { Input, Button, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Footnote } from '../types/paper';

interface FootnoteManagerProps {
  footnotes: Footnote[];
  onFootnotesChange: (footnotes: Footnote[]) => void;
}

export const FootnoteManager: React.FC<FootnoteManagerProps> = ({ footnotes, onFootnotesChange }) => {
  const handleAddFootnote = () => {
    const newId = footnotes.length > 0 ? Math.max(...footnotes.map(f => f.id)) + 1 : 1;
    onFootnotesChange([...footnotes, { id: newId, content: '' }]);
  };

  const handleDeleteFootnote = (id: number) => {
    onFootnotesChange(footnotes.filter(f => f.id !== id));
  };

  const handleFootnoteChange = (id: number, content: string) => {
    onFootnotesChange(footnotes.map(f => f.id === id ? { ...f, content } : f));
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>脚注管理</h4>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFootnote}>
          添加脚注
        </Button>
      </div>
      
      {footnotes.map((footnote) => (
        <div key={footnote.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ marginTop: 5, fontWeight: 'bold' }}>[{footnote.id}]</span>
          <Input.TextArea
            value={footnote.content}
            onChange={(e) => handleFootnoteChange(footnote.id, e.target.value)}
            placeholder={`请输入脚注 ${footnote.id} 的内容`}
            rows={3}
            showCount
          />
          <Popconfirm
            title="确定要删除这个脚注吗？"
            onConfirm={() => handleDeleteFootnote(footnote.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              style={{ marginTop: 5 }}
            />
          </Popconfirm>
        </div>
      ))}
    </Space>
  );
};
