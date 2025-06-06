import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPosts, POSTS_PER_PAGE } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { PlusCircle, Edit, Trash2, ExternalLink } from 'lucide-react';
import PaginationControls from '@/components/PaginationControls';
import DeletePostButton from './DeletePostButton'; // New component for handling delete

export const dynamic = 'force-dynamic';

interface AdminDashboardProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminDashboardPage({ searchParams }: AdminDashboardProps) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const { posts, totalPages } = await getPosts({ page, limit: POSTS_PER_PAGE });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 hover:scale-105">
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Post
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage your existing blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No posts found. Create one to get started!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Created At</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium max-w-xs truncate">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="hover:text-primary hover:underline" title={post.title}>
                        {post.title}
                         <ExternalLink className="ml-1 inline-block h-3 w-3 text-muted-foreground" />
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(post.createdAt, 'MMM d, yyyy')}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(post.updatedAt, 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" asChild title="Edit Post" className="hover:text-primary">
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeletePostButton postId={post.id} postTitle={post.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {posts.length > 0 && (
          <CardFooter>
             <PaginationControls currentPage={page} totalPages={totalPages} baseUrl="/admin/dashboard" />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
