
# Pranav's Digital Workbench - Blogging Platform

This project is a full-stack blogging platform built as part of an internship application process. It includes a frontend website for users to read blog posts and an admin panel for blog post management.

## Features

**Admin Panel:**
*   Secure login system using Email & Password authentication (via Firebase).
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
    *   In-memory JavaScript array (`src/lib/db.ts`). This is for demonstration purposes. For a production environment, this would be replaced with a persistent database solution (e.g., SQL, MongoDB, or Firebase Firestore).
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
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
    *   **Authentication:**
        *   In your Firebase project, go to "Authentication" from the sidebar.
        *   Click on the "Sign-in method" tab.
        *   Enable "Email/Password" as a sign-in provider.
        *   (Optional, if you later re-enable Google/OAuth providers): Under "Authorized domains", add `localhost` (for local development) and any domains you will deploy to (e.g., your Vercel domain).
    *   **Get Firebase Configuration:**
        *   In your Firebase project settings (click the gear icon ⚙️ next to "Project Overview"), scroll down to the "Your apps" section.
        *   If you don't have a web app registered, click "Add app" and select the Web platform (`</>`).
        *   Follow the steps to register your app. You'll be provided with a `firebaseConfig` object. Copy these values.

4.  **Environment Variables:**
    *   Create a new file named `.env.local` in the root of your project.
    *   Copy the contents of `.env.example` into `.env.local`.
    *   Populate `.env.local` with the Firebase configuration values you obtained in the previous step:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional, for Analytics
        ```
    *   **Important:** Ensure these variables are prefixed with `NEXT_PUBLIC_` so they are available on the client-side as needed by the Firebase SDK.

5.  **Create Admin User(s):**
    *   In the Firebase Console, go to "Authentication" -> "Users" tab.
    *   Click "Add user".
    *   Enter an email and password for your admin account(s). For example:
        *   Email: `test@gmail.com`
        *   Password: `test@123`
    *   These are the credentials you will use to log into the Admin Panel.

6.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:9002`.

## How Authentication and Blog Management Works

**Authentication (Admin Panel):**
*   The admin panel is protected. Accessing any route under `/admin/*` without being logged in will redirect the user to `/admin/login`.
*   Authentication is handled by Firebase Authentication, using the Email/Password sign-in method.
*   Admin users must be created manually in the Firebase Console by an existing project administrator. There is no public sign-up for the admin panel.
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
*   Blog post data (including title, content, image URL, creation/update dates, and slug) is managed by a service layer in `src/lib/db.ts`. **Currently, this uses an in-memory JavaScript array, meaning data will be lost when the server restarts.** For a production application, this would be replaced by a persistent database.

## Deployment

This Next.js application can be deployed to platforms like Vercel, Netlify, or Firebase App Hosting.

*   **Vercel (Recommended for Next.js):**
    *   Connect your GitHub repository to Vercel.
    *   Vercel will typically auto-detect it as a Next.js project.
    *   **Crucially, you must set up the environment variables (from your `.env.local` file) in your Vercel project settings.**
*   Ensure your Firebase project's "Authorized domains" list (under Authentication -> Sign-in method) includes your Vercel deployment URL(s) if you plan to use any OAuth providers in the future. For Email/Password auth, this is not strictly necessary but good practice.

This README should provide a good overview and the necessary setup instructions.
