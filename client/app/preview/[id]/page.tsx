import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getPreview } from '@/services/posts';
import '@uiw/react-markdown-preview/markdown.css';

const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface PreviewPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  try {
    const preview = await getPreview(params.id);
    return {
      title: `预览: ${preview.title}`,
      description: preview.seo?.metaDescription,
      keywords: preview.seo?.keywords,
    };
  } catch (error) {
    return {
      title: '预览不可用',
    };
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  try {
    const preview = await getPreview(params.id);

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{preview.title}</h1>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>分类: {preview.category}</span>
            <span>标签: {preview.tags.join(', ')}</span>
          </div>
        </div>

        <div data-color-mode="light" className="prose prose-lg max-w-none">
          <MDPreview source={preview.content} />
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800">
            这是预览模式。预览链接将在1小时后过期。
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            预览不可用
          </h1>
          <p className="text-gray-600">
            预览可能已过期或无效。请返回编辑页面重新生成预览。
          </p>
        </div>
      </div>
    );
  }
}
