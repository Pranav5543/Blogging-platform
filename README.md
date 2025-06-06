
# Pranav's Digital Workbench - Blogging Platform

This project is a full-stack blogging platform. It includes a frontend website for users to read blog posts and an admin panel for blog post management.

## Features

**Admin Panel:**
*   Secure login system using Email & Password authentication (via Firebase).
*   Admin users must be created manually in the Firebase Console.
*   Create, Read, Update, and Delete (CRUD) blog posts.
*   Posts include title, content (Markdown supported), and direct image uploads (stored on Vercel Blob).
*   AI-powered content summarization feature when creating/editing posts.
*   Paginated view of all blog posts in the dashboard.

**Frontend Website:**
*   Publicly accessible blog for users.
*   Displays blog posts with title, content preview (on homepage) or full content (on post page), publication date, and image.
*   Responsive and user-friendly interface.

## Tech Stack Used

*   **Frontend:**
    *   Next.js (v15+ with App Router)
    *   React (v18+)
    *   TypeScript
    *   Tailwind CSS
    *   ShadCN UI (Component Library)
*   **Backend (within Next.js):**
    *   Next.js API Routes & Server Actions
    *   Firebase Authentication (for Admin Panel login)
    *   Vercel Blob (for Image Storage)
    *   Genkit (by Google, for AI-powered summarization using Gemini models)
*   **Database (Blog Posts):**
    *   In-memory JavaScript array (`src/lib/db.ts`). This is for demonstration purposes and ease of setup. Data will be lost when the server restarts. For a production environment, this would be replaced with a persistent database solution (e.g., SQL, MongoDB, or Firebase Firestore).
*   **Styling:**
    *   Tailwind CSS for utility-first styling.
    *   ShadCN UI components, customizable via CSS variables.
    *   `globals.css` for theme setup.
*   **Fonts:**
    *   'Inter' for body and headlines.
    *   'Source Code Pro' for code blocks.

## Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Firebase Setup:**
    *   The Firebase project configuration (API key, project ID, etc.) is **hardcoded** into `src/lib/firebase.ts`. Ensure these details match your Firebase project.
        *   Project ID: `launchmytech-bc399` (as specified in the hardcoded config)
    *   **Enable Email/Password Authentication:**
        *   In your Firebase project, go to "Authentication" from the sidebar.
        *   Click on the "Sign-in method" tab.
        *   Enable "Email/Password" as a sign-in provider.

4.  **Vercel Blob Setup (for Image Uploads):**
    *   **On Vercel:**
        *   Deploy this project to Vercel.
        *   In your Vercel project dashboard, go to the "Storage" tab.
        *   Click "Create Database" and choose "Blob".
        *   Connect this new Blob store to your project. Vercel will automatically inject the `BLOB_READ_WRITE_TOKEN` environment variable into your deployed application.
    *   **For Local Development:**
        *   After creating and connecting the Blob store on Vercel, go to its "Settings" tab.
        *   Under "Tokens", generate a new Read/Write token.
        *   Create a file named `.env.local` in the root of your project.
        *   Add the token to your `.env.local` file:
            ```
            BLOB_READ_WRITE_TOKEN="YOUR_COPIED_BLOB_TOKEN_FROM_VERCEL"
            ```
        *   **Restart your Next.js development server (`npm run dev`)** for this variable to be loaded.

5.  **Create Admin User(s):**
    *   In the Firebase Console for your project (`launchmytech-bc399`), go to "Authentication" -> "Users" tab.
    *   Click "Add user".
    *   Enter an email and password for your admin account(s). For example:
        *   Email: `test@gmail.com`
        *   Password: `test@123`
    *   These are the credentials you will use to log into the Admin Panel. **There is no public sign-up for the admin panel.**

6.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:9002`.

## How Authentication and Blog Management Works

**Authentication (Admin Panel):**
*   The admin panel is protected. Accessing any route under `/admin/*` without being logged in will redirect the user to `/admin/login`.
*   Authentication is handled by Firebase Authentication, using the Email/Password sign-in method.
*   Admin users must be created manually in the Firebase Console.

**Blog Management:**
*   Logged-in admins can access the dashboard at `/admin/dashboard`.
*   From the dashboard, admins can:
    *   View a paginated list of existing blog posts.
    *   Navigate to create a new blog post.
    *   Edit existing posts (title, content, image).
    *   Delete posts.
*   When creating or editing a post:
    *   An image can be uploaded directly. This image is stored in Vercel Blob.
    *   An "AI Summarize" button is available, which uses Genkit and a Google Gemini model to generate a summary of the blog content. This summary is displayed as a toast notification.
*   Blog post data is managed by `src/lib/db.ts` using an in-memory JavaScript array (data is lost on server restart).

## Deployment to Vercel

This Next.js application is optimized for deployment to Vercel.

1.  **Push your code** to a Git repository (GitHub, GitLab, Bitbucket).
2.  **Connect your Git repository** to Vercel through the Vercel dashboard.
3.  Vercel will typically auto-detect it as a Next.js project and configure build settings automatically.
4.  **Environment Variables:**
    *   The Firebase configuration is hardcoded, so no Firebase environment variables are needed in Vercel.
    *   **Vercel Blob Token:** If you've linked a Vercel Blob store to your project through the Vercel dashboard, the `BLOB_READ_WRITE_TOKEN` will be automatically available to your deployed application.
5.  **Authorized Domains (Firebase):**
    *   Once deployed, add your Vercel URL (e.g., `your-project-name.vercel.app`) to the "Authorized domains" list in your Firebase project settings (Authentication -> Sign-in method). This is good practice.

This README should provide a good overview and the necessary setup/deployment instructions.
