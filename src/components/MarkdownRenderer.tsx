"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// This component assumes you'll install react-markdown and remark-gfm:
// npm install react-markdown remark-gfm
// yarn add react-markdown remark-gfm
// pnpm add react-markdown remark-gfm

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={cn(
        "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none",
        "prose-headings:font-headline prose-headings:text-foreground",
        "prose-p:text-foreground/90 prose-p:font-body",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        "prose-strong:text-foreground",
        "prose-blockquote:border-primary prose-blockquote:text-muted-foreground",
        "prose-code:font-code prose-code:bg-muted prose-code:text-accent-foreground prose-code:p-1 prose-code:rounded-sm",
        "prose-pre:font-code prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto",
        className
      )}
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
  );
}
