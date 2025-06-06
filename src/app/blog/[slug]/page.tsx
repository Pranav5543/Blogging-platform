import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | Pranav's Digital Workbench`,
    description: post.summary || post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Button variant="outline" asChild className="hover:bg-accent hover:text-accent-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Published on {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <span>(Updated on {formatDate(post.updatedAt)})</span>
            )}
          </div>
        </header>

        {post.imageUrl && (
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              priority
              data-ai-hint="article cover"
            />
          </div>
        )}
        
        <MarkdownRenderer content={post.content} />

      </div>
    </article>
  );
}
