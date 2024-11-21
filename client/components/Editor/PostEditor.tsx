import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { Chip, Box, Typography } from '@mui/material';
import { createPreview, savePost, updatePost, autoSavePost, createPost } from '@/services/posts';

// 动态导入 MD 编辑器以避免 SSR 问题
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface PostEditorProps {
  initialData?: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    readTime: string;
    seo: {
      metaTitle: string;
      metaDescription: string;
      keywords: string[];
    };
    slug?: string;
  };
  onSave?: (data: any) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({ initialData, onSave }) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [readTime, setReadTime] = useState(initialData?.readTime || '');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled' | 'archived'>('draft');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [seo, setSeo] = useState(initialData?.seo || {
    metaTitle: '',
    metaDescription: '',
    keywords: []
  });
  const [version, setVersion] = useState(1);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // 自动保存
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (content && initialData?.slug) {
        try {
          await autoSavePost(initialData.slug, content);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 30000); // 30秒自动保存一次

    return () => clearTimeout(autoSaveTimer);
  }, [content, initialData?.slug]);

  // 预览功能
  const handlePreview = async () => {
    try {
      const previewData = {
        title,
        content,
        category,
        tags,
        seo
      };
      const { previewId } = await createPreview(previewData);
      window.open(`/preview/${previewId}`, '_blank');
    } catch (error) {
      toast({
        title: '预览失败',
        description: '无法创建预览，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  // 保存文章
  const handleSave = async (saveStatus: 'draft' | 'published' | 'scheduled') => {
    try {
      const postData = {
        title,
        content,
        category,
        tags,
        status: saveStatus,
        seo,
        ...(saveStatus === 'scheduled' && { scheduledPublishDate: new Date(scheduledDate) })
      };

      if (initialData?.slug) {
        await updatePost(initialData.slug, postData);
      } else {
        await createPost(postData);
      }

      toast({
        title: '保存成功',
        description: `文章已${
          saveStatus === 'draft' ? '保存为草稿' : 
          saveStatus === 'scheduled' ? '设置为定时发布' : 
          '发布'
        }`,
      });

      if (onSave) {
        onSave(postData);
      }
    } catch (error) {
      toast({
        title: '保存失败',
        description: '无法保存文章，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            placeholder="文章标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold"
          />
          {lastSaved && (
            <span className="text-sm text-gray-500">
              上次保存: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <div className="w-1/3">
            <Label>分类</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">技术</SelectItem>
                <SelectItem value="life">生活</SelectItem>
                <SelectItem value="thoughts">随想</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-2/3">
            <Label>标签</Label>
            <Input
              placeholder="标签（用逗号分隔）"
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="edit">编辑</TabsTrigger>
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="seo">SEO设置</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <div className="space-y-4">
              <div>
                <Label>标题</Label>
                <Input
                  placeholder="文章标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>内容</Label>
                <MDEditor
                  value={content}
                  onChange={(value) => setContent(value || '')}
                  height={500}
                />
              </div>

              {readTime && (
                <Typography variant="body2" color="text.secondary">
                  预计阅读时间：{readTime}
                </Typography>
              )}

              <Box sx={{ mt: 2 }}>
                <Label>标签</Label>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => {
                        const newTags = [...tags];
                        newTags.splice(index, 1);
                        setTags(newTags);
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">草稿</SelectItem>
                      <SelectItem value="published">已发布</SelectItem>
                      <SelectItem value="scheduled">定时发布</SelectItem>
                      <SelectItem value="archived">已归档</SelectItem>
                    </SelectContent>
                  </Select>

                  {status === 'scheduled' && (
                    <Input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {lastSaved && (
                    <Typography variant="caption" color="text.secondary">
                      上次保存：{new Date(lastSaved).toLocaleString()}
                    </Typography>
                  )}
                  <Button onClick={() => handleSave(status)}>保存</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div data-color-mode="light" className="border rounded-md p-4">
              <MDPreview source={content} />
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <div className="space-y-4">
              <div>
                <Label>Meta 标题</Label>
                <Input
                  value={seo.metaTitle}
                  onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                  placeholder="SEO 标题"
                />
              </div>

              <div>
                <Label>Meta 描述</Label>
                <Input
                  value={seo.metaDescription}
                  onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                  placeholder="SEO 描述"
                />
              </div>

              <div>
                <Label>关键词</Label>
                <Input
                  value={seo.keywords.join(', ')}
                  onChange={(e) => setSeo({
                    ...seo,
                    keywords: e.target.value.split(',').map(k => k.trim())
                  })}
                  placeholder="关键词（用逗号分隔）"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview}>
              预览
            </Button>
            <span className="text-sm text-gray-500">
              版本: {version}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {status === 'scheduled' && (
              <Input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-auto"
              />
            )}
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="published">发布</SelectItem>
                <SelectItem value="scheduled">定时发布</SelectItem>
                <SelectItem value="archived">归档</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleSave(status)}>
              {status === 'draft' ? '保存草稿' : 
               status === 'scheduled' ? '设置定时发布' : 
               '发布'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
