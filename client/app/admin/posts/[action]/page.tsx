'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FiSave, FiRefreshCw, FiTag, FiFileText, FiEdit3, FiImage, FiX } from 'react-icons/fi';
import ImageUploader from '@/components/ImageUploader';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

const markdownConfig = {
  components: {
    img: ({ src, alt }) => (
      <img 
        src={src} 
        alt={alt} 
        style={{ maxWidth: '100%', height: 'auto' }}
        crossOrigin="anonymous"
      />
    ),
  }
};

export default function PostEditor({ params }) {
  const router = useRouter();
  const isEdit = params.action === 'edit';
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [post, setPost] = useState({
    title: '',
    content: '',
    tags: [],
    excerpt: '',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/posts/${params.slug}`);
          const data = await response.json();
          setPost(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching post:', error);
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [isEdit, params.slug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/posts/${params.slug}` : '/api/posts';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        router.push('/admin/posts');
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEnhance = async () => {
    setEnhancing(true);
    try {
      const response = await fetch('/api/openai/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: post.content,
          instruction: 'enhance and expand this technical article, adding more details and examples where appropriate',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPost({ ...post, content: data.enhancedContent });
      }
    } catch (error) {
      console.error('Error enhancing content:', error);
    } finally {
      setEnhancing(false);
    }
  };

  const handleGenerateTitles = async () => {
    try {
      const response = await fetch('/api/openai/suggest-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: post.content }),
      });

      const data = await response.json();
      if (data.success) {
        setSuggestedTitles(data.titles);
        setShowTitleSuggestions(true);
      }
    } catch (error) {
      console.error('Error generating titles:', error);
    }
  };

  const handleGenerateTags = async () => {
    try {
      const response = await fetch('/api/openai/suggest-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: post.content }),
      });

      const data = await response.json();
      if (data.success) {
        setPost({ ...post, tags: data.tags });
      }
    } catch (error) {
      console.error('Error generating tags:', error);
    }
  };

  const handleGenerateExcerpt = async () => {
    try {
      const response = await fetch('/api/openai/generate-excerpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: post.content }),
      });

      const data = await response.json();
      if (data.success) {
        setPost({ ...post, excerpt: data.excerpt });
      }
    } catch (error) {
      console.error('Error generating excerpt:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6 relative">
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              placeholder="文章标题"
              className="flex-1 px-4 py-2 text-xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerateTitles}
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
              title="生成标题建议"
            >
              <FiEdit3 className="h-5 w-5" />
            </button>
          </div>
          
          {showTitleSuggestions && suggestedTitles.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 p-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">建议的标题：</h4>
              {suggestedTitles.map((title, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setPost({ ...post, title });
                    setShowTitleSuggestions(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  {title}
                </button>
              ))}
              <button
                onClick={() => setShowTitleSuggestions(false)}
                className="mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                关闭
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={post.tags.join(', ')}
              onChange={(e) => setPost({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              placeholder="标签（用逗号分隔）"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerateTags}
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
              title="生成标签建议"
            >
              <FiTag className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <textarea
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              placeholder="文章摘要（可选）"
              rows={3}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerateExcerpt}
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600"
              title="生成摘要"
            >
              <FiFileText className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div data-color-mode="light">
            <MDEditor
              value={post.content}
              onChange={(value) => setPost({ ...post, content: value || '' })}
              previewOptions={markdownConfig}
              height={500}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={handleEnhance}
              disabled={enhancing || !post.content}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <FiRefreshCw className={`mr-2 ${enhancing ? 'animate-spin' : ''}`} />
              {enhancing ? 'AI增强中...' : '使用AI增强内容'}
            </button>

            <button
              onClick={() => setShowImageUploader(!showImageUploader)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiImage className="mr-2" />
              插入图片
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !post.title || !post.content}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {saving ? '保存中...' : '保存文章'}
          </button>
        </div>
      </div>

      {showImageUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">上传图片</h3>
              <button
                onClick={() => setShowImageUploader(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </button>
            </div>
            <ImageUploader
              onImageUpload={(imageUrl) => {
                // 移除开头的 /api，保留 /images 路径
                const cleanImageUrl = imageUrl.replace(/^\/api\/images/, '/images');
                const imageMarkdown = `![图片](${cleanImageUrl})\n`;
                const editor = document.querySelector('[role="textbox"]');
                if (editor) {
                  const cursorPosition = editor.selectionStart || 0;
                  const content = post.content || '';
                  const newContent = 
                    content.slice(0, cursorPosition) + 
                    imageMarkdown + 
                    content.slice(cursorPosition);
                  setPost({
                    ...post,
                    content: newContent
                  });
                } else {
                  setPost({
                    ...post,
                    content: (post.content || '') + imageMarkdown
                  });
                }
                setShowImageUploader(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
