"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BlogPostForm from '@/components/BlogPostForm';
import { updateBlogPostAction } from '@/lib/actions';
import { getPostById } from '@/lib/db'; // Fetching client-side, could be SSR with prop
import type { BlogPost, BlogPostFormData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postId = typeof params.id === 'string' ? params.id : null;

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const fetchedPost = await getPostById(postId);
          if (fetchedPost) {
            setPost(fetchedPost);
          } else {
            toast({ title: 'Error', description: 'Post not found.', variant: 'destructive' });
            router.push('/admin/dashboard');
          }
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to fetch post data.', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    } else {
      toast({ title: 'Error', description: 'Invalid post ID.', variant: 'destructive' });
      router.push('/admin/dashboard');
    }
  }, [postId, router, toast]);

  const handleSubmit = async (data: BlogPostFormData) => {
    if (!postId) return;
    setIsSubmitting(true);
    const result = await updateBlogPostAction(postId, data);
    setIsSubmitting(false);

    if (result.success && result.post) {
      toast({
        title: 'Post Updated!',
        description: `Post "${result.post.title}" has been updated.`,
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        title: 'Error Updating Post',
        description: result.error || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!post) {
    return <div className="text-center text-muted-foreground">Post not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Blog Post</CardTitle>
          <CardDescription>Update the details of your blog post.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm onSubmit={handleSubmit} initialData={post} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
