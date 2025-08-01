"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Users,
  Calendar,
  Settings,
  BarChart3,
  MessageSquare,
  LogOut,
  Menu,
  GripVertical,
} from "lucide-react";

interface SidebarProps {
  user: any;
  onSignOut: () => void;
}

const SidebarContent: React.FC<{
  user: any;
  onSignOut: () => void;
  onItemClick?: () => void;
}> = ({ user, onSignOut, onItemClick }) => (
  <>
    <Separator />

    {/* User Profile Section */}
    <div className="p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-auto p-3 font-normal hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  user.photoURL ||
                  "/placeholder.svg?height=32&width=32&query=user avatar"
                }
                alt={user.displayName || "User"}
              />
              <AvatarFallback className="text-xs">
                {user.displayName
                  ? user.displayName.charAt(0)
                  : user.email
                  ? user.email.charAt(0)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <p className="w-full text-sm font-medium leading-none truncate">
                {user.displayName || "User"}
              </p>
              <p className="w-full text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-sm text-slate-600 absolute bottom-5">
        Made by Ashu | © 2025 All Rights Reserved.
      </p>
    </div>
  </>
);

const Sidebar: React.FC<SidebarProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 400) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <>
      {/* Mobile Header with Menu Button */}
      {/* <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-border shadow-sm">
        <h1 className="text-xl font-bold text-foreground">Coach Dashboard</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="text-left">Coach Dashboard</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-[calc(100vh-80px)]">
              <SidebarContent
                user={user}
                onSignOut={onSignOut}
                onItemClick={() => setIsOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div> */}
      {/* Mobile Header with Menu Button */}
      <div className="lg:hidden flex fixed top-0 right-0 left-0 items-center justify-between p-4 bg-[#f4f4f4] border-b border-border shadow-sm z-50">
        <h1 className="text-xl font-bold text-foreground">Coach Dashboard</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          {/* 1. Make the SheetContent a vertical flex container
           */}
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="p-6 border-b border-border">
              <SheetTitle className="text-left">Coach Dashboard</SheetTitle>
            </SheetHeader>
            {/* 2. Make this container grow to fill the remaining space and allow scrolling
             */}
            <div className="flex-1 overflow-y-auto">
              <SidebarContent
                user={user}
                onSignOut={onSignOut}
                onItemClick={() => setIsOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex relative">
        <div
          className="flex flex-col h-full bg-white border-r border-border shadow-sm transition-all duration-200 ease-in-out"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">
              Coach Dashboard
            </h1>
          </div>

          <SidebarContent user={user} onSignOut={onSignOut} />
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 bg-transparent hover:bg-border cursor-col-resize transition-colors duration-200 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          {isResizing && (
            <div className="absolute inset-y-0 -left-1 -right-1 bg-primary/20" />
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
