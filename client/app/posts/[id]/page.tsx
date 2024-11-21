'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Container, Typography, Box, Divider, Chip, Card, CardContent } from '@mui/material';
import { getPostById, getRelatedPosts } from '@/services/posts';
import CommentSection from '@/components/Comments/CommentSection';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = React.useState<any>(null);
  const [relatedPosts, setRelatedPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id as string);
        setPost(data);
        const related = await getRelatedPosts(id as string);
        setRelatedPosts(related);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Post not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', mb: 2 }}>
          <Typography variant="body2">
            By {post.author?.username || 'Anonymous'}
          </Typography>
          <Typography variant="body2">
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Typography>
          {post.createdAt !== post.updatedAt && (
            <Typography variant="body2">
              (Updated {formatDistanceToNow(new Date(post.updatedAt))} ago)
            </Typography>
          )}
          <Typography variant="body2">
            {post.readTime}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
          {post.tags?.map((tag: string) => (
            <Chip
              key={tag}
              label={tag}
              component={Link}
              href={`/tags/${tag}`}
              clickable
              size="small"
            />
          ))}
        </Box>

        <Box 
          sx={{ mb: 4 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {relatedPosts.length > 0 && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>
              相关文章
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3, mb: 4 }}>
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost._id}>
                  <CardContent>
                    <Typography variant="h6" component={Link} href={`/posts/${relatedPost._id}`} sx={{ 
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main' }
                    }}>
                      {relatedPost.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {relatedPost.excerpt}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {relatedPost.tags?.map((tag: string) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ my: 4 }} />
        <CommentSection postId={post._id} />
      </Box>
    </Container>
  );
};

export default PostPage;
