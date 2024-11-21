'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';

const MDPreviewComponent = dynamic(() => import('@uiw/react-markdown-preview'), { ssr: false });

interface MDPreviewProps {
  content: string;
}

export function MDPreview({ content }: MDPreviewProps) {
  return (
    <div data-color-mode="light" className="prose prose-lg max-w-none">
      <MDPreviewComponent source={content} />
    </div>
  );
}
