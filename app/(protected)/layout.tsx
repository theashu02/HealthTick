"use client";

import { useAuth } from "@/hook/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Calendar, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

function Sidebar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-card sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors md:h-8 md:w-8"
              >
                <Calendar className="h-5 w-5" />
                <span className="sr-only">Scheduler</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Scheduler</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex h-9 w-9 items-center justify-center rounded-full md:h-8 md:w-8">
                <Avatar>
                  <AvatarImage
                    src={user?.photoURL ?? ""}
                    alt={user?.displayName ?? "User"}
                  />
                  <AvatarFallback>
                    {getInitials(user?.displayName)}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Profile</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              {user?.displayName ?? "Profile"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Sidebar />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:pl-20 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
