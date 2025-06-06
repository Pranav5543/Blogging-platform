
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
import { Wand2, Loader2 as Loader, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(100, "Title must be at most 100 characters"),
  content: z.string().min(50, "Content must be at least 50 characters long"),
  imageUrl: z.string().url("Image URL must be a valid URL").optional().or(z.literal('')),
});

interface BlogPostFormProps {
  onSubmit: (data: BlogPostFormData) => Promise<void>;
  initialData?: BlogPost | null;
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

 useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title || "",
        content: initialData.content || "",
        imageUrl: initialData.imageUrl || "",
      });
      setImagePreview(initialData.imageUrl || null);
      setSelectedFile(null);
      
      const fileInput = document.getElementById('imageFile') as HTMLInputElement | null;
      if (fileInput) {
          fileInput.value = "";
      }
    } else {
      // For new post, reset everything
      form.reset({ title: "", content: "", imageUrl: "" });
      setImagePreview(null);
      setSelectedFile(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]); // Dependency array simplified to just initialData

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 4MB.",
          variant: "destructive",
        });
        event.target.value = ""; 
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      form.setValue('imageUrl', ''); 
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
    let finalImageUrl = dataFromHook.imageUrl || ''; 

    if (selectedFile) { 
      setIsUploading(true);
      try {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(selectedFile.name)}`, {
          method: 'POST',
          body: selectedFile,
        });
        
        if (!response.ok) {
          const errorResult = await response.json();
          let errorMessage = errorResult.error || errorResult.message || `Upload failed with status: ${response.status}`;
          let toastDuration = 5000;

          if (errorMessage.includes("Vercel Blob token is missing")) {
            errorMessage = "CRITICAL: Vercel Blob token is MISSING in the server environment. \n1. Create a '.env.local' file in your project root. \n2. Add BLOB_READ_WRITE_TOKEN='your_token_here'. \n3. IMPORTANT: RESTART your Next.js dev server (npm run dev). \n Check server terminal logs for more details.";
            toastDuration = 15000;
          } else if (errorMessage.includes("BLOB_STORE_NOT_FOUND")) {
             errorMessage = "Vercel Blob Store Not Found or Not Connected. Please ensure you have created a Blob store on Vercel and connected it to this project in the Vercel dashboard (Project -> Storage tab).";
             toastDuration = 15000;
          }
          
          throw new Error(errorMessage);
        }
        const blobResult = await response.json();
        finalImageUrl = blobResult.url;
      } catch (error) {
        console.error("Image Upload Error (Caught in BlogPostForm):", error);
        let toastDescription = 'Could not upload image. Please try again.';
        let toastDuration = 5000;
        if (error instanceof Error) {
            toastDescription = error.message; 
             if (error.message.includes("Vercel Blob token is missing") || error.message.includes("BLOB_STORE_NOT_FOUND") || toastDescription.includes("CRITICAL: Vercel Blob token is MISSING")) {
                toastDuration = 15000; 
             }
        }
        toast({ 
            title: 'Image Upload Failed', 
            description: toastDescription, 
            variant: 'destructive',
            duration: toastDuration
        });
        setIsUploading(false);
        return; 
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
                 Current image URL (if any, from database): {form.watch('imageUrl') || 'None'}
            </FormDescription>
            {imagePreview && (
                <div className="mt-4 relative w-full max-w-md p-2 border rounded-md shadow-sm bg-muted/50">
                    <Image 
                        src={imagePreview} 
                        alt="Image preview" 
                        width={400} 
                        height={300} 
                        className="rounded-md object-contain max-h-64 w-auto"
                        key={imagePreview} // Using imagePreview as key helps if the src string itself changes
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
                    <FormItem className="sr-only"> {/* Keep this hidden as it's for form submission state */}
                        <FormLabel>Image URL (hidden)</FormLabel>
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
          {isUploading ? "Uploading Image..." : (initialData?.id ? "Update Post" : "Create Post")}
        </Button>
      </form>
    </Form>
  );
}
