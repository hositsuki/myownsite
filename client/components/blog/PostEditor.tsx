import React, { useState, useCallback } from 'react';
import { Form, Input, TextArea, SubmitButton } from '../ui/Form';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Loading } from '../ui/Loading';
import { Modal } from '../ui/Modal';
import { Post, CreatePostInput, UpdatePostInput } from '@/types/post';
import { postService } from '@/services/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
import { useSession } from 'next-auth/react';

interface PostEditorProps {
  post: Post | null;
  onSave?: (post: Post) => void;
  onCancel?: () => void;
}

interface PostForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string;
  coverImage?: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  scheduledPublishDate?: string;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  post,
  onSave,
  onCancel,
}) => {
  const { data: session } = useSession();
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSave = useCallback(async (values: PostForm) => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const tags = values.tags.split(',').map((tag) => tag.trim());
      const postData: CreatePostInput | UpdatePostInput = {
        ...values,
        tags,
        authorId: session.user.id,
        status: values.status || 'draft',
        scheduledPublishDate: values.scheduledPublishDate,
      };

      let savedPost: Post;
      if (post) {
        savedPost = await postService.updatePost(post.slug, postData as UpdatePostInput);
      } else {
        savedPost = await postService.createPost(postData as CreatePostInput);
      }

      onSave?.(savedPost);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save post'));
    } finally {
      setLoading(false);
    }
  }, [post, onSave, session]);

  const handleAutoSave = useCallback(async (values: PostForm) => {
    if (!post) return;

    try {
      const tags = values.tags.split(',').map((tag) => tag.trim());
      await postService.autoSave(post._id, {
        ...values,
        tags,
      });
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  }, [post]);

  const initialValues: PostForm = {
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    tags: post?.tags?.join(', ') || '',
    coverImage: post?.coverImage,
    status: post?.status || 'draft',
    scheduledPublishDate: post?.scheduledPublishDate,
  };

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>

        {showPreview ? (
          <div className="prose max-w-none dark:prose-invert">
            <h1>{initialValues.title}</h1>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
            >
              {initialValues.content}
            </ReactMarkdown>
          </div>
        ) : (
          <Form
            initialValues={initialValues}
            onSubmit={handleSave}
            onAutoSave={handleAutoSave}
            autoSaveInterval={30000}
          >
            <Input
              name="title"
              label="Title"
              required
              placeholder="Enter post title"
            />
            <Input
              name="slug"
              label="Slug"
              required
              placeholder="Enter post slug"
            />
            <TextArea
              name="content"
              label="Content"
              required
              placeholder="Write your post content in Markdown"
              rows={20}
            />
            <TextArea
              name="excerpt"
              label="Excerpt"
              required
              placeholder="Write a brief excerpt"
              rows={3}
            />
            <Input
              name="tags"
              label="Tags"
              placeholder="Enter tags separated by commas"
            />
            <Input
              name="coverImage"
              label="Cover Image URL"
              placeholder="Enter cover image URL"
            />
            <Input
              name="status"
              label="Status"
              type="select"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
            {initialValues.status === 'scheduled' && (
              <Input
                name="scheduledPublishDate"
                label="Scheduled Publish Date"
                type="datetime-local"
              />
            )}
            <SubmitButton loading={loading}>Save Post</SubmitButton>
          </Form>
        )}

        {error && (
          <div className="mt-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error.message}
          </div>
        )}

        {loading && <Loading />}

        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Preview"
        >
          <div className="prose max-w-none dark:prose-invert">
            <h1>{initialValues.title}</h1>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
            >
              {initialValues.content}
            </ReactMarkdown>
          </div>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};
