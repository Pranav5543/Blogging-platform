
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid'; // For generating unique filenames

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filenameParam = searchParams.get('filename');

  // Server-side log to check for the token
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  console.log('/api/upload: Checking for BLOB_READ_WRITE_TOKEN. Found:', blobToken ? 'A token is present.' : 'Token is UNDEFINED or EMPTY.');

  if (!blobToken) {
    console.error('/api/upload: CRITICAL ERROR - BLOB_READ_WRITE_TOKEN is not set in the server environment. Please ensure it is in your .env.local file and the Next.js development server has been RESTARTED.');
    // Return a specific error if token is missing, so client knows it's a server config issue
    return NextResponse.json({ message: 'Configuration error on server.', error: 'Vercel Blob token is missing in server environment.' }, { status: 500 });
  }

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
