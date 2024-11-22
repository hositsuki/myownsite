import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { commentService } from '@/services/comments';
import { Avatar, Button, TextField, Typography, Box, IconButton, Divider } from '@mui/material';
import { ThumbUp, Reply, Delete, Edit } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Comment as CommentType } from '@/types/comment';

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
            {session?.user?.id === comment.author._id && (
              <Button
                size="small"
                startIcon={<Delete />}
                onClick={() => onDelete(comment._id)}
              >
                Delete
              </Button>
            )}
          </Box>
          {isReplying && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button onClick={() => setIsReplying(false)}>Cancel</Button>
                <Button variant="contained" onClick={handleReply}>
                  Reply
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      const response = await commentService.getComments(postId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!newComment.trim() || !session) return;

    try {
      const response = await commentService.createComment({
        content: newComment,
        postId,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  const handleReplyToComment = async (commentId: string, content: string) => {
    if (!session) return;

    try {
      const response = await commentService.replyToComment(postId, commentId, {
        content,
      });
      await loadComments(); // Reload all comments to get the updated structure
    } catch (error) {
      console.error('Failed to reply to comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!session) return;

    try {
      await commentService.likeComment(postId, commentId);
      await loadComments(); // Reload comments to get updated likes count
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(postId, commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (loading) {
    return <Typography>Loading comments...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      {session ? (
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button variant="contained" onClick={handleCreateComment}>
              Comment
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography color="text.secondary" gutterBottom>
          Please sign in to comment
        </Typography>
      )}
      <Box>
        {comments.map((comment) => (
          <React.Fragment key={comment._id}>
            <Comment
              comment={comment}
              onReply={handleReplyToComment}
              onLike={handleLikeComment}
              onDelete={handleDeleteComment}
            />
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default CommentSection;
