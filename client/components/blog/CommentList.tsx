import React, { useState, useRef, useCallback } from 'react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { Loading } from '../ui/Loading';
import { Form, TextArea, SubmitButton } from '../ui/Form';
import { useAsync } from '../../hooks/useAsync';
import { commentService } from '../../services/comments';
import { Comment, PaginatedResponse } from '../../types/comment';
import { PaginationParams } from '../../services/base';

interface CommentListProps {
  postId: string;
  currentUser?: {
    id: string;
    name: string;
    isAdmin?: boolean;
  };
}

interface CommentForm {
  content: string;
}

export const CommentList: React.FC<CommentListProps> = ({
  postId,
  currentUser,
}) => {
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const observer = useRef<IntersectionObserver>();
  const lastCommentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreComments();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await commentService.getComments(postId, {
        page: 1,
        limit: pageSize,
      });
      setComments(response.data);
      setHasMore(response.data.length === pageSize);
      setPage(2);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load comments'));
    } finally {
      setLoading(false);
    }
  };

  const loadMoreComments = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await commentService.getComments(postId, {
        page,
        limit: pageSize,
      });
      setComments((prev) => [...prev, ...response.data]);
      setHasMore(response.data.length === pageSize);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more comments'));
    } finally {
      setLoading(false);
    }
  };

  const { execute: submitComment, loading: submitting } = useAsync(
    async (values: CommentForm) => {
      if (replyTo) {
        await commentService.replyToComment(postId, replyTo._id, {
          content: values.content,
        });
      } else {
        await commentService.createComment({
          content: values.content,
          postId,
        });
      }
      await loadComments();
      setReplyTo(null);
    }
  );

  const handleDelete = async (commentId: string) => {
    try {
      await commentService.deleteComment(postId, commentId);
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      await commentService.likeComment(postId, commentId);
      const updatedComments = comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      );
      setComments(updatedComments);
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-4">
        {currentUser && (
          <Form<CommentForm>
            initialValues={{ content: '' }}
            onSubmit={submitComment}
            validate={(values) => {
              const errors: Partial<CommentForm> = {};
              if (!values.content) {
                errors.content = 'Comment content is required';
              }
              return errors;
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <div className="space-y-2">
                <TextArea
                  name="content"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.content ? errors.content : undefined}
                  placeholder={
                    replyTo
                      ? `Reply to ${replyTo.author.name}'s comment...`
                      : 'Write a comment...'
                  }
                />
                <div className="flex justify-end space-x-2">
                  {replyTo && (
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel Reply
                    </button>
                  )}
                  <SubmitButton loading={submitting}>
                    {replyTo ? 'Reply' : 'Comment'}
                  </SubmitButton>
                </div>
              </div>
            )}
          </Form>
        )}

        {error && (
          <div className="text-red-500">
            Error loading comments: {error.message}
          </div>
        )}

        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={comment._id}
              ref={index === comments.length - 1 ? lastCommentRef : null}
              className="p-4 bg-white rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{comment.author.name}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {(currentUser?.id === comment.author._id ||
                  currentUser?.isAdmin) && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="mt-2">{comment.content}</div>
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => handleLike(comment._id)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  Like ({comment.likes})
                </button>
                {currentUser && (
                  <button
                    onClick={() => setReplyTo(comment)}
                    className="text-gray-500 hover:text-blue-500"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {loading && <Loading />}
      </div>
    </ErrorBoundary>
  );
};
