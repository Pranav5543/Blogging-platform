"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogPostForm from '@/components/BlogPostForm';
import { createBlogPostAction } from '@/lib/actions';
import type { BlogPostFormData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: BlogPostFormData) => {
    setIsSubmitting(true);
    const result = await createBlogPostAction(data);
    setIsSubmitting(false);

    if (result.success && result.post) {
      toast({
        title: 'Post Created!',
        description: `Your new post "${result.post.title}" has been published.`,
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        title: 'Error Creating Post',
        description: result.error || 'An unknown error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create New Blog Post</CardTitle>
          <CardDescription>Fill in the details below to publish a new article.</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}
