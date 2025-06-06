import type { BlogPost, BlogPostFormData } from './types';
import { slugify } from './utils';

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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const sortedPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / limit);
  return { posts: paginatedPosts, totalPages };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const post = posts.find(p => p.slug === slug);
  return post || null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const post = posts.find(p => p.id === id);
  return post || null;
}

export async function createPost(data: BlogPostFormData): Promise<BlogPost> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const now = new Date().toISOString();
  const newPost: BlogPost = {
    id: String(posts.length + 1),
    slug: slugify(data.title), // Ensure slug is unique in a real app
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl,
    createdAt: now,
    updatedAt: now,
  };
  // Check for slug uniqueness and append a number if needed (simplified here)
  let uniqueSlug = newPost.slug;
  let counter = 1;
  while (posts.some(p => p.slug === uniqueSlug)) {
    uniqueSlug = `${newPost.slug}-${counter}`;
    counter++;
  }
  newPost.slug = uniqueSlug;
  
  posts.unshift(newPost); // Add to the beginning of the array
  return newPost;
}

export async function updatePost(id: string, data: Partial<BlogPostFormData>): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return null;

  const updatedPost = { ...posts[postIndex], ...data, updatedAt: new Date().toISOString() };
  if (data.title && data.title !== posts[postIndex].title) {
    // Regenerate slug if title changed, ensure uniqueness
    let newSlug = slugify(data.title);
    let counter = 1;
    // Check against other posts, not the current one being updated if its slug changes
    while (posts.some(p => p.slug === newSlug && p.id !== id)) {
        newSlug = `${slugify(data.title)}-${counter}`;
        counter++;
    }
    updatedPost.slug = newSlug;
  }

  posts[postIndex] = updatedPost;
  return updatedPost;
}

export async function deletePost(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== id);
  return posts.length < initialLength;
}
