
import type { BlogPost, BlogPostFormData } from './types';
import { slugify } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

// In-memory store for blog posts
let posts: BlogPost[] = [
  {
    id: '1',
    slug: 'first-post',
    title: 'My First Blog Post',
    content: 'This is the content of my first blog post. It supports **Markdown**!\n\n```javascript\nconsole.log("Hello, Markdown!");\n```\n\nIsn\'t that cool?',
    summary: 'A brief introduction to my new blog and its first post.',
    imageUrl: 'https://placehold.co/600x400.png?text=First+Post',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    slug: 'understanding-ai-summarization',
    title: 'Understanding AI Summarization',
    content: 'AI summarization is a fascinating field. It uses natural language processing to condense long texts into shorter, easy-to-digest summaries. This post explores how it works and its applications. \n\nFor example, a news article might be summarized into a few key bullet points: \n- Point 1 \n- Point 2 \n- Point 3',
    summary: 'An exploration of AI summarization techniques and their impact.',
    imageUrl: 'https://placehold.co/600x400.png?text=AI+Summarization',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const POSTS_PER_PAGE = 5;

export async function getPosts({ page = 1, limit = POSTS_PER_PAGE }: { page?: number, limit?: number } = {}): Promise<{ posts: BlogPost[], totalPages: number }> {
  noStore(); // Prevent caching of this function's output
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / limit);
  return { posts: paginatedPosts, totalPages };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  noStore(); // Prevent caching
  await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
  const post = posts.find(p => p.slug === slug);
  return post || null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  noStore(); // Prevent caching
  await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
  const post = posts.find(p => p.id === id);
  return post || null;
}

export async function createPost(data: BlogPostFormData): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
  const now = new Date().toISOString();
  const newPost: BlogPost = {
    id: String(Date.now()), // Use timestamp for more unique ID
    slug: slugify(data.title),
    title: data.title,
    content: data.content,
    summary: data.content.substring(0, 150) + (data.content.length > 150 ? "..." : ""), // Auto-generate summary
    imageUrl: data.imageUrl,
    createdAt: now,
    updatedAt: now,
  };
  
  let uniqueSlug = newPost.slug;
  let counter = 1;
  while (posts.some(p => p.slug === uniqueSlug)) {
    uniqueSlug = `${newPost.slug}-${counter}`;
    counter++;
  }
  newPost.slug = uniqueSlug;
  
  posts.unshift(newPost); 
  console.log(`[db.ts] createPost: Post "${newPost.title}" created with id ${newPost.id}`);
  return newPost;
}

export async function updatePost(id: string, data: Partial<BlogPostFormData>): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
  const postIndex = posts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    console.error(`[db.ts] updatePost: Post with id ${id} not found.`);
    return null;
  }

  const currentPost = posts[postIndex];
  console.log(`[db.ts] updatePost: Updating post ${id}. Current title: "${currentPost.title}". New data:`, data);

  // Create the new post object by merging currentPost with the new data
  // Ensure all fields of BlogPost are covered.
  const updatedPostData: BlogPost = {
    ...currentPost, // Start with all fields from the current post
    title: data.title !== undefined ? data.title : currentPost.title,
    content: data.content !== undefined ? data.content : currentPost.content,
    imageUrl: data.imageUrl !== undefined ? data.imageUrl : currentPost.imageUrl, // This allows setting imageUrl to ''
    updatedAt: new Date().toISOString(),
    // summary will be re-evaluated if content changes, or kept if content doesn't change
    summary: data.content !== undefined ? (data.content.substring(0, 150) + (data.content.length > 150 ? "..." : "")) : currentPost.summary,
  };


  if (data.title && data.title !== currentPost.title) {
    let newSlug = slugify(data.title);
    let counter = 1;
    while (posts.some(p => p.slug === newSlug && p.id !== id)) { // Check slug against other posts
      newSlug = `${slugify(data.title)}-${counter}`;
      counter++;
    }
    updatedPostData.slug = newSlug;
    console.log(`[db.ts] updatePost: Slug updated to "${updatedPostData.slug}" due to title change.`);
  }

  posts[postIndex] = updatedPostData;
  console.log(`[db.ts] updatePost: Post ${id} updated successfully. New title: "${updatedPostData.title}"`);
  return updatedPostData;
}

export async function deletePost(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== id);
  const success = posts.length < initialLength;
  if (success) {
    console.log(`[db.ts] deletePost: Post ${id} deleted.`);
  } else {
    console.warn(`[db.ts] deletePost: Post ${id} not found or not deleted.`);
  }
  return success;
}

    