"use server";

import { revalidatePath } from 'next/cache';
import { summarizeBlogPost as genAISummarize } from '@/ai/flows/summarize-blog-post';
import * as db from './db';
import type { BlogPost, BlogPostFormData } from './types';

export async function createBlogPostAction(data: BlogPostFormData): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  try {
    const newPost = await db.createPost(data);
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath(`/blog/${newPost.slug}`);
    return { success: true, post: newPost };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create post" };
  }
}

export async function updateBlogPostAction(id: string, data: Partial<BlogPostFormData>): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  try {
    const updatedPost = await db.updatePost(id, data);
    if (!updatedPost) {
      return { success: false, error: "Post not found" };
    }
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath(`/admin/posts/${id}/edit`);
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update post" };
  }
}

export async function deleteBlogPostAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await db.deletePost(id);
    if (!success) {
      return { success: false, error: "Failed to delete post or post not found" };
    }
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete post" };
  }
}

export async function summarizeContentAction(content: string): Promise<{ summary?: string; error?: string }> {
  if (!content.trim()) {
    return { error: "Content is empty, cannot summarize." };
  }
  try {
    // The GenAI flow expects `blogPostContent`
    const result = await genAISummarize({ blogPostContent: content });
    return { summary: result.summary };
  } catch (error) {
    console.error("Error summarizing content:", error);
    return { error: error instanceof Error ? error.message : "Failed to summarize content using AI" };
  }
}
