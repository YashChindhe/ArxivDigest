import type { Metadata } from "next";
import { SidebarNav } from "@/components/sidebar-nav";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArxivDigest - AI Research Paper Summarizer",
  description: "Summarize research papers from arXiv with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth h-full"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldBeDark = theme === 'dark' || (theme === null && prefersDark);
                if (shouldBeDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col md:flex-row">
        {/* Mobile Header */}
        <Navbar />

        {/* Desktop Sidebar */}
        <SidebarNav />

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0 md:ml-64">
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="py-6 px-10 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            ArxivDigest © 2026 • AI Research Assistant
          </footer>
        </div>
      </body>
    </html>
  );
}
