import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Comment as CommentType, getPostComments, createComment, replyToComment, likeComment, deleteComment } from '@/services/comments';
import { Avatar, Button, TextField, Typography, Box, IconButton, Divider } from '@mui/material';
import { ThumbUp, Reply, Delete, Edit } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  comment: CommentType;
  onReply: (commentId: string, content: string) => Promise<void>;
  onLike: (commentId: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  level?: number;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, onLike, onDelete, level = 0 }) => {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(comment._id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <Box sx={{ ml: level * 4, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar src={comment.author.avatar} alt={comment.author.username}>
          {comment.author.username[0]}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2">{comment.author.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
              {comment.isEdited && ' (edited)'}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {comment.content}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <IconButton size="small" onClick={() => onLike(comment._id)}>
              <ThumbUp fontSize="small" />
            </IconButton>
            <Typography variant="caption">{comment.likes}</Typography>
            <Button
              size="small"
              startIcon={<Reply />}
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </Button>
            {session?.user?.email === comment.author._id && (
              <IconButton size="small" onClick={() => onDelete(comment._id)}>
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
          {isReplying && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                size="small"
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
                <Button size="small" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button size="small" variant="contained" onClick={handleReply}>
                  Reply
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {comment.replies?.map((reply) => (
        <Comment
          key={reply._id}
          comment={reply}
          onReply={onReply}
          onLike={onLike}
          onDelete={onDelete}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const fetchedComments = await getPostComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim() || !session) return;
    setIsLoading(true);
    try {
      await createComment(postId, newComment);
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
    setIsLoading(false);
  };

  const handleReply = async (commentId: string, content: string) => {
    if (!session) return;
    try {
      await replyToComment(commentId, content);
      await fetchComments();
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!session) return;
    try {
      await likeComment(commentId);
      await fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!session) return;
    try {
      await deleteComment(commentId);
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments ({comments.length})
      </Typography>
      {session ? (
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              variant="contained"
              onClick={handleCreateComment}
              disabled={isLoading || !newComment.trim()}
            >
              Post Comment
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please sign in to leave a comment.
        </Typography>
      )}
      <Divider sx={{ mb: 2 }} />
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onReply={handleReply}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      ))}
    </Box>
  );
};

export default CommentSection;
