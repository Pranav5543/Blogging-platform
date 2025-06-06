
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { nanoid } from 'nanoid'; // For generating unique filenames

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filenameParam = searchParams.get('filename');

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  console.log('/api/upload: Checking for BLOB_READ_WRITE_TOKEN. Found:', blobToken ? 'A token is present.' : 'Token is UNDEFINED or EMPTY.');

  if (!blobToken) {
    console.error(`
      --------------------------------------------------------------------------------------------
      CRITICAL SERVER CONFIGURATION ERROR in /api/upload:
      BLOB_READ_WRITE_TOKEN is UNDEFINED or EMPTY in the server's environment.

      This means the Vercel Blob SDK cannot authenticate to upload files.

      TO FIX THIS LOCALLY:
      1. Ensure you have a file named '.env.local' in the ROOT of your project directory.
      2. Add the following line to '.env.local':
         BLOB_READ_WRITE_TOKEN="your_actual_token_from_vercel_blob_settings"
         (Replace "your_actual_token_from_vercel_blob_settings" with the real token)
      3. !!! IMPORTANT: You MUST RESTART your Next.js development server (npm run dev) !!!
         Next.js only loads .env.local variables on startup.
      --------------------------------------------------------------------------------------------
    `);
    return NextResponse.json({ message: 'Configuration error on server.', error: 'Vercel Blob token is missing in server environment. See server logs for detailed instructions.' }, { status: 500 });
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
