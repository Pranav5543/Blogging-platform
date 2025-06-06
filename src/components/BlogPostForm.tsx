
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost, BlogPostFormData } from "@/lib/types";
import { summarizeContentAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2 as Loader, Upload, Image as ImageIcon, XCircle } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title must be at most 100 characters"),
  content: z.string().min(50, "Content must be at least 50 characters long"),
  imageUrl: z.string().url("Image URL must be a valid URL").optional().or(z.literal('')),
});

interface BlogPostFormProps {
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  initialData?: BlogPost;
  isSubmitting: boolean;
}

export default function BlogPostForm({ onSubmit, initialData, isSubmitting: parentIsSubmitting }: BlogPostFormProps) {
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 4MB.",
          variant: "destructive",
        });
        event.target.value = ""; // Reset file input
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue('imageUrl', ''); // Clear existing URL if a new file is chosen. It will be set after upload.
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    form.setValue('imageUrl', '');
    const fileInput = document.getElementById('imageFile') as HTMLInputElement | null;
    if (fileInput) {
        fileInput.value = "";
    }
  };

  const handleFormSubmit = async (dataFromHook: BlogPostFormData) => {
    let finalImageUrl = dataFromHook.imageUrl || initialData?.imageUrl || '';

    if (selectedFile) {
      setIsUploading(true);
      try {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(selectedFile.name)}`, {
          method: 'POST',
          body: selectedFile,
          // Content-Type is usually set automatically by the browser when body is a File object
        });
        
        if (!response.ok) {
          const errorResult = await response.json();
          // Prioritize the 'error' field from the server's JSON response for a more specific message
          throw new Error(errorResult.error || errorResult.message || `Upload failed with status: ${response.status}`);
        }
        const blobResult = await response.json();
        finalImageUrl = blobResult.url;
      } catch (error) {
        console.error("Image Upload Error:", error);
        toast({ 
            title: 'Image Upload Error', 
            description: error instanceof Error ? error.message : 'Could not upload image. Please try again.', 
            variant: 'destructive' 
        });
        setIsUploading(false);
        return; // Stop form submission if upload fails
      }
      setIsUploading(false);
    }

    const dataToSend: BlogPostFormData = {
      title: dataFromHook.title,
      content: dataFromHook.content,
      imageUrl: finalImageUrl,
    };
    await onSubmit(dataToSend);
  };

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
      toast({
        title: "AI Summary Generated",
        description: (
            <div className="max-h-40 overflow-y-auto">
              <p className="text-sm font-medium">Summary:</p>
              <p className="text-xs">{result.summary}</p>
            </div>
        ),
        duration: 10000,
      });
    } else if (result.error) {
      toast({
        title: "Summarization Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const currentIsSubmitting = parentIsSubmitting || isUploading || isSummarizing;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog post title" {...field} className="text-base" disabled={currentIsSubmitting} />
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
                  disabled={currentIsSubmitting}
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
                  disabled={currentIsSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
            <FormLabel>Blog Post Image</FormLabel>
            <FormControl>
                <Input 
                    id="imageFile"
                    type="file" 
                    accept="image/png, image/jpeg, image/gif, image/webp" 
                    onChange={handleFileChange} 
                    className="text-base"
                    disabled={currentIsSubmitting}
                />
            </FormControl>
            <FormDescription>
                Upload an image for your blog post (PNG, JPG, GIF, WEBP, max 4MB).
            </FormDescription>
            {imagePreview && (
                <div className="mt-4 relative w-full max-w-md p-2 border rounded-md shadow-sm bg-muted/50">
                    <Image 
                        src={imagePreview} 
                        alt="Image preview" 
                        width={400} 
                        height={300} 
                        className="rounded-md object-contain max-h-64 w-auto"
                    />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-background/70 hover:bg-destructive hover:text-destructive-foreground rounded-full h-7 w-7"
                        onClick={removeImage}
                        disabled={currentIsSubmitting}
                        title="Remove image"
                    >
                        <XCircle className="h-5 w-5" />
                    </Button>
                </div>
            )}
            <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                    <FormItem className="sr-only">
                        <FormLabel>Image URL (hidden, populated by upload)</FormLabel>
                        <FormControl>
                            <Input {...field} type="hidden" readOnly />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </FormItem>


        <Button type="submit" disabled={currentIsSubmitting} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-300 hover:scale-105">
          {(parentIsSubmitting || isUploading) && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? "Uploading Image..." : (initialData ? "Update Post" : "Create Post")}
        </Button>
      </form>
    </Form>
  );
}

