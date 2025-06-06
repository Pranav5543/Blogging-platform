
export default function Footer() {
  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} MindCanvas. All rights reserved.</p>
        <p className="mt-1">Built with Next.js and Firebase.</p>
      </div>
    </footer>
  );
}
