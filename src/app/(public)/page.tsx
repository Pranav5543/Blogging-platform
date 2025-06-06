import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaginationControls from '@/components/PaginationControls';
import { getPosts, POSTS_PER_PAGE } from '@/lib/db';
import { formatDate, truncateText } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Ensure fresh data on each request

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const { posts, totalPages } = await getPosts({ page, limit: POSTS_PER_PAGE });

  return (
    <>
      <header className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Welcome to the Workbench
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          Thoughts, learnings, and digital creations.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No blog posts yet. Stay tuned!</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              {post.imageUrl && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="blog post" // More generic hint for homepage
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-xl leading-tight hover:text-primary">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Published on {formatDate(post.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-foreground/80">
                  {truncateText(post.summary || post.content, 150)}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="group p-0 text-primary hover:text-accent">
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <PaginationControls currentPage={page} totalPages={totalPages} />
    </>
  );
}
