"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost, BlogPostFormData } from "@/lib/types";
import { summarizeContentAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2 as Loader } from "lucide-react";
import React, { useState } from "react";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title must be at most 100 characters"),
  content: z.string().min(50, "Content must be at least 50 characters long"),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
});

interface BlogPostFormProps {
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  initialData?: BlogPost;
  isSubmitting: boolean;
}

export default function BlogPostForm({ onSubmit, initialData, isSubmitting }: BlogPostFormProps) {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleSummarize = async () => {
    const content = form.getValues("content");
    if (!content || content.length < 50) {
      toast({
        title: "Content too short",
        description: "Please write at least 50 characters before summarizing.",
        variant: "destructive",
      });
      return;
    }
    setIsSummarizing(true);
    const result = await summarizeContentAction(content);
    setIsSummarizing(false);
    if (result.summary) {
      // For now, we just show the summary. In a real app, you might want to put this into a summary field.
      toast({
        title: "AI Summary Generated",
        description: (
            <div className="max-h-40 overflow-y-auto">
              <p className="text-sm font-medium">Summary:</p>
              <p className="text-xs">{result.summary}</p>
            </div>
        ),
        duration: 10000, // Show for longer
      });
      // If there was a dedicated summary field in the form:
      // form.setValue("summary", result.summary); 
    } else if (result.error) {
      toast({
        title: "Summarization Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog post title" {...field} className="text-base"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                Content (Markdown supported)
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSummarize} 
                  disabled={isSummarizing || isSubmitting}
                  className="hover:bg-accent hover:text-accent-foreground"
                >
                  {isSummarizing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  AI Summarize
                </Button>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog post content here..."
                  {...field}
                  rows={15}
                  className="min-h-[300px] font-body text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} className="text-base" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || isSummarizing} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 hover:scale-105">
          {isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
          {initialData ? "Update Post" : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
