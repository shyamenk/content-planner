import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/ThemeProvider";
import { MainNav } from "./components/main-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Social Media Post Tracker",
  description: "Manage your social media pipeline efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
