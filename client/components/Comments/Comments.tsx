import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';
import { addComment, approveComment } from '@/services/posts';

interface Comment {
  _id: string;
  author: string;
  content: string;
  date: string;
  isApproved: boolean;
}

interface CommentsProps {
  postSlug: string;
  comments: Comment[];
  onCommentAdded?: () => void;
}

export default function Comments({ postSlug, comments, onCommentAdded }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addComment(postSlug, {
        author: name,
        content: newComment,
        email
      });

      toast({
        title: '评论已提交',
        description: '评论将在审核后显示',
      });

      setNewComment('');
      setName('');
      setEmail('');

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      toast({
        title: '评论提交失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      await approveComment(postSlug, commentId);
      toast({
        title: '评论已审核通过',
      });
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      toast({
        title: '操作失败',
        description: '无法审核评论',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-2xl font-bold">评论</h2>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments
          .filter(comment => comment.isApproved || isAdmin)
          .map(comment => (
            <div
              key={comment._id}
              className={`p-4 rounded-lg ${
                comment.isApproved ? 'bg-gray-50' : 'bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{comment.author}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(comment.date).toLocaleDateString()}
                  </p>
                </div>
                {isAdmin && !comment.isApproved && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApproveComment(comment._id)}
                  >
                    审核通过
                  </Button>
                )}
              </div>
              <p className="text-gray-800">{comment.content}</p>
              {!comment.isApproved && isAdmin && (
                <p className="mt-2 text-sm text-yellow-600">
                  待审核评论
                </p>
              )}
            </div>
          ))}
      </div>

      {/* 评论表单 */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <div>
          <Input
            placeholder="你的名字"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="你的邮箱"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="写下你的评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows={4}
          />
        </div>
        <Button type="submit">
          提交评论
        </Button>
      </form>
    </div>
  );
}
