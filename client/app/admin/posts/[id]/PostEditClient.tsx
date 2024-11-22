'use client';

import { useRouter } from 'next/navigation';
import { PostEditor } from '@/components/blog/PostEditor';
import { Post } from '@/services/api';
import { toast } from '@/components/ui/toast';

interface PostEditClientProps {
  post: Post | null;
}

export function PostEditClient({ post }: PostEditClientProps) {
  const router = useRouter();

  const handleSave = async (savedPost: Post) => {
    toast({
      title: post ? '文章已更新' : '文章已创建',
      description: `《${savedPost.title}》已${post ? '更新' : '保存'}成功`,
    });
    router.push('/admin/posts');
  };

  const handleCancel = () => {
    router.push('/admin/posts');
  };

  return (
    <PostEditor
      post={post}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
