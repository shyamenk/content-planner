"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Archive, PowerSquare, Castle } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/posts", label: "Post", icon: PowerSquare },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/category", label: "Category", icon: Castle },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="hidden text-xl font-bold text-primary sm:inline-block">
                Social Media Post Tracker
              </span>
              <span className="text-xl font-bold text-primary sm:hidden">
                SMPT
              </span>
            </Link>
          </div>
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                  "rounded-lg hover:bg-primary/10",
                  pathname === item.href
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-primary",
                )}
                asChild
              >
                <Link href={item.href} className="flex items-center space-x-1">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
