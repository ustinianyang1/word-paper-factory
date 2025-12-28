import React, { useCallback, useMemo } from 'react';
import { Input, Button, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Footnote } from '../types/paper';

interface FootnoteManagerProps {
  footnotes: Footnote[];
  onFootnotesChange: (footnotes: Footnote[]) => void;
}

export const FootnoteManager: React.FC<FootnoteManagerProps> = React.memo(({ footnotes, onFootnotesChange }) => {
  // Memoize the next ID calculation to avoid recalculating on every render
  const nextId = useMemo(() => {
    return footnotes.length > 0 ? Math.max(...footnotes.map(f => f.id)) + 1 : 1;
  }, [footnotes]);

  // Use useCallback to prevent recreating these functions on every render
  const handleAddFootnote = useCallback(() => {
    onFootnotesChange([...footnotes, { id: nextId, content: '' }]);
  }, [footnotes, onFootnotesChange, nextId]);

  const handleDeleteFootnote = useCallback((id: number) => {
    onFootnotesChange(footnotes.filter(f => f.id !== id));
  }, [footnotes, onFootnotesChange]);

  const handleFootnoteChange = useCallback((id: number, content: string) => {
    onFootnotesChange(footnotes.map(f => f.id === id ? { ...f, content } : f));
  }, [footnotes, onFootnotesChange]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} aria-label="脚注管理区域">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 id="footnote-manager-title">脚注管理</h4>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddFootnote}
          aria-label="添加新脚注"
          aria-describedby="footnote-manager-title"
        >
          添加脚注
        </Button>
      </div>
      
      <div role="list" aria-label="脚注列表">
        {footnotes.map((footnote) => (
          <div 
            key={footnote.id} 
            style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}
            role="listitem"
            aria-label={`脚注 ${footnote.id}`}
          >
            <span 
              style={{ marginTop: 5, fontWeight: 'bold' }}
              aria-label={`脚注编号 ${footnote.id}`}
            >
              [{footnote.id}]
            </span>
            <Input.TextArea
              value={footnote.content}
              onChange={(e) => handleFootnoteChange(footnote.id, e.target.value)}
              placeholder={`请输入脚注 ${footnote.id} 的内容`}
              rows={3}
              showCount
              aria-label={`脚注 ${footnote.id} 的内容`}
              aria-describedby={`footnote-${footnote.id}-help`}
            />
            <Popconfirm
              title="确定要删除这个脚注吗？"
              onConfirm={() => handleDeleteFootnote(footnote.id)}
              okText="确定"
              cancelText="取消"
              aria-label={`删除脚注 ${footnote.id} 确认对话框`}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                style={{ marginTop: 5 }}
                aria-label={`删除脚注 ${footnote.id}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDeleteFootnote(footnote.id);
                  }
                }}
              />
            </Popconfirm>
          </div>
        ))}
      </div>
    </Space>
  );
});
