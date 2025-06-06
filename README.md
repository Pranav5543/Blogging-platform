
# Pranav's Digital Workbench - Blogging Platform

This project is a full-stack blogging platform built as part of an internship application process. It includes a frontend website for users to read blog posts and an admin panel for blog post management.

## Features

**Admin Panel:**
*   Secure login system using Email & Password authentication (via Firebase). Admin users must be created manually in the Firebase Console.
*   Create, Read, Update, and Delete (CRUD) blog posts.
*   Posts include title, content (Markdown supported), and an optional image URL.
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
    *   The Firebase project configuration (API key, project ID, etc.) is currently **hardcoded** into `src/lib/firebase.ts` for simplified setup in this demonstration environment.
    *   You will still need a Firebase project in the [Firebase Console](https://console.firebase.google.com/) that matches these hardcoded details (Project ID: `launchmytech-bc399`).
    *   **Enable Email/Password Authentication:**
        *   In your Firebase project, go to "Authentication" from the sidebar.
        *   Click on the "Sign-in method" tab.
        *   Enable "Email/Password" as a sign-in provider.
    *   **(Note on Environment Variables for Future/Production Use):** Typically, Firebase credentials and other sensitive keys should be stored in environment variables (e.g., in a `.env.local` file for local development, and set in your hosting provider's settings for deployment) rather than being hardcoded. This project uses hardcoded values as a temporary measure to resolve specific setup issues.

4.  **Create Admin User(s):**
    *   In the Firebase Console for your project (`launchmytech-bc399`), go to "Authentication" -> "Users" tab.
    *   Click "Add user".
    *   Enter an email and password for your admin account(s). For example:
        *   Email: `test@gmail.com`
        *   Password: `test@123`
    *   These are the credentials you will use to log into the Admin Panel. **There is no public sign-up for the admin panel.**

5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:9002`.

## How Authentication and Blog Management Works

**Authentication (Admin Panel):**
*   The admin panel is protected. Accessing any route under `/admin/*` without being logged in will redirect the user to `/admin/login`.
*   Authentication is handled by Firebase Authentication, using the Email/Password sign-in method.
*   Admin users must be created manually in the Firebase Console by an existing project administrator.
*   Upon successful login, a session is established, and the admin user can access the dashboard and management features.
*   The `AuthProvider.tsx` component wraps the application to provide user authentication state.

**Blog Management:**
*   Logged-in admins can access the dashboard at `/admin/dashboard`.
*   From the dashboard, admins can:
    *   View a paginated list of existing blog posts.
    *   Navigate to create a new blog post.
    *   Edit existing posts (title, content, image URL).
    *   Delete posts.
*   When creating or editing a post, an "AI Summarize" button is available, which uses Genkit and a Google Gemini model to generate a summary of the blog content. This summary is currently displayed as a toast notification.
*   Blog post data is managed by `src/lib/db.ts` using an in-memory JavaScript array (data is lost on server restart).

## Deployment

This Next.js application can be deployed to platforms like Vercel, Netlify, or Render.

*   **Vercel (Recommended for Next.js):**
    *   Push your code to a Git repository (GitHub, GitLab, Bitbucket).
    *   Connect your Git repository to Vercel through the Vercel dashboard.
    *   Vercel will typically auto-detect it as a Next.js project and configure build settings automatically.
    *   **Environment Variables:**
        *   The Firebase configuration is currently hardcoded in `src/lib/firebase.ts`, so you do not need to set `NEXT_PUBLIC_FIREBASE_...` variables in Vercel for Firebase to function in this specific setup.
        *   If you add other services or APIs in the future that require secret keys, you would set those as environment variables in your Vercel project settings.
    *   **Authorized Domains:** Once deployed, add your Vercel URL (e.g., `your-project-name.vercel.app`) to the "Authorized domains" list in your Firebase project settings (Authentication -> Sign-in method). This is good practice and important if you ever enable OAuth providers.

This README should provide a good overview and the necessary setup/deployment instructions.
