'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiSave, FiRefreshCw, FiTag, FiFileText, FiEdit3, FiImage, FiX, FiFeather, FiBrain } from 'react-icons/fi';
import ImageUploader from '@/components/ImageUploader';
import { useApi } from '@/hooks/useApi';
import { usePostStore } from '@/store';
import { blogAPI } from '@/services/api';
import type { Post } from '@/services/api';
import { notificationService } from '@/services/notification';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

// 表单验证schema
const postSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(100, '标题最长100个字符'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z.string().min(1, '摘要不能为空'),
  date: z.string(),
  tags: z.array(z.string()),
  readTime: z.string(),
  slug: z.string().min(1, 'URL slug不能为空'),
  status: z.enum(['draft', 'published', 'scheduled']),
  scheduledPublishDate: z.string().optional(),
  author: z.object({
    name: z.string(),
    avatar: z.string(),
    bio: z.string(),
  }),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  params: {
    action: string;
    slug?: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function PostEditor({ params, searchParams }: PostEditorProps) {
  const router = useRouter();
  const { setCurrentPost } = usePostStore();
  const isEdit = params.action === 'edit';

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      date: new Date().toISOString(),
      tags: [],
      readTime: '',
      slug: '',
      status: 'draft',
      scheduledPublishDate: undefined,
      author: {
        name: '',
        avatar: '',
        bio: '',
      },
    },
  });

  const {
    loading: saveLoading,
    execute: savePost,
  } = useApi<Post, [PostFormData]>(
    isEdit ? 
      async (data: Partial<PostFormData>) => blogAPI.updatePost(params.slug!, data) :
      async (data: Omit<PostFormData, '_id'>) => blogAPI.createPost(data),
    {
      showNotification: true,
      onSuccess: () => {
        router.push('/admin/posts');
      },
    }
  );

  const {
    loading: fetchLoading,
    execute: fetchPost,
  } = useApi(
    async (slug: string) => blogAPI.getPost(slug),
    {
      onSuccess: (data) => {
        // 使用setValue更新表单数据
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as keyof PostFormData, value);
        });
        setCurrentPost(data);
      },
      onError: () => {
        notificationService.showError('Failed to load post');
        router.push('/admin/posts');
      },
    }
  );

  useEffect(() => {
    if (isEdit && params.slug) {
      fetchPost(params.slug);
    }
  }, [isEdit, params.slug]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await savePost(data);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  });

  const handleImageUpload = async (file: File) => {
    try {
      const result = await blogAPI.uploadImage(file);
      const imageMarkdown = `![${file.name}](${result.url})`;
      setValue('content', watch('content') + '\n' + imageMarkdown);
    } catch (error) {
      notificationService.showError('Failed to upload image');
    }
  };

  const handleAIGenerate = async (type: 'summary' | 'title' | 'tags' | 'improve') => {
    try {
      let result;
      switch (type) {
        case 'summary':
          result = await blogAPI.generateSummary(watch('content'));
          setValue('excerpt', result);
          break;
        case 'title':
          result = await blogAPI.optimizeTitle(watch('content'));
          setValue('title', result);
          break;
        case 'tags':
          result = await blogAPI.generateTags(watch('content'));
          setValue('tags', result);
          break;
        case 'improve':
          result = await blogAPI.improveContent(watch('content'));
          setValue('content', result);
          break;
      }
      notificationService.showSuccess('AI生成成功');
    } catch (error) {
      console.error('AI生成失败:', error);
      notificationService.showError('AI生成失败');
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <FiRefreshCw className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Edit Post' : 'Create New Post'}
          </h1>
          <button
            type="submit"
            disabled={saveLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saveLoading ? (
              <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <FiSave className="w-5 h-5 mr-2" />
            )}
            Save
          </button>
        </div>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <div>
              <input
                {...field}
                type="text"
                placeholder="Post Title"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          )}
        />

        <div className="flex space-x-4">
          <Controller
            name="tags"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex-1">
                <input
                  type="text"
                  value={value.join(', ')}
                  onChange={(e) => onChange(e.target.value.split(',').map(tag => tag.trim()))}
                  placeholder="Tags (comma separated)"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <div>
                <select
                  {...field}
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {watch('status') === 'scheduled' && (
          <Controller
            name="scheduledPublishDate"
            control={control}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  type="datetime-local"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.scheduledPublishDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheduledPublishDate.message}</p>
                )}
              </div>
            )}
          />
        )}

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <div>
              <MDEditor
                {...field}
                preview="edit"
                className="min-h-[500px]"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          )}
        />

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => handleAIGenerate('summary')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiBrain className="w-4 h-4 mr-2" />
            生成摘要
          </button>
          <button
            type="button"
            onClick={() => handleAIGenerate('title')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit3 className="w-4 h-4 mr-2" />
            优化标题
          </button>
          <button
            type="button"
            onClick={() => handleAIGenerate('tags')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiTag className="w-4 h-4 mr-2" />
            生成标签
          </button>
          <button
            type="button"
            onClick={() => handleAIGenerate('improve')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiFeather className="w-4 h-4 mr-2" />
            改进内容
          </button>
          <ImageUploader onUpload={handleImageUpload}>
            {({ openUploader }) => (
              <button
                type="button"
                onClick={openUploader}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiImage className="w-5 h-5 mr-2" />
                选择图片
              </button>
            )}
          </ImageUploader>
        </div>

        <Controller
          name="excerpt"
          control={control}
          render={({ field }) => (
            <div>
              <textarea
                {...field}
                placeholder="Post Excerpt"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>
          )}
        />
      </form>
    </div>
  );
}
