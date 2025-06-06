
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid'; // For generating unique filenames

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filenameParam = searchParams.get('filename');

  if (!request.body) {
    return NextResponse.json({ message: 'No file body.' }, { status: 400 });
  }
  if (!filenameParam) {
    return NextResponse.json({ message: 'Filename is required.' }, { status: 400 });
  }

  // Sanitize filename and make it unique
  const originalFilename = filenameParam.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const uniqueFilename = `${nanoid(8)}-${originalFilename}`;
  
  try {
    const blob = await put(uniqueFilename, request.body, {
      access: 'public', // Make the blob publicly accessible
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during upload.';
    return NextResponse.json({ message: 'Error uploading file.', error: errorMessage }, { status: 500 });
  }
}

// Optional: Runtime configuration for Vercel
// export const runtime = 'edge'; // Vercel Blob works well with edge runtime

// To ensure the body is streamed, you might need to configure Next.js if not using Edge.
// For Node.js runtime, ensure body parsing is not prematurely consumed.
// However, for simple file uploads with `fetch` and `FormData`, this usually works.
// If running into issues with body streaming on Node.js runtime on Vercel,
// you might need to use a library like `formidable` or adjust API route body parser config.
// For Vercel deployment, using the Edge runtime is often recommended for Blob operations.
