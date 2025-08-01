import React from 'react';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  return (
    // <header className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
    //   <div className="flex items-center gap-4">
    //     <h1 className="text-2xl font-bold text-gray-900">HealthTick Calendar</h1>
    //     {user.photoURL && (
    //       <img 
    //         src={user.photoURL} 
    //         alt="Coach" 
    //         className="w-10 h-10 rounded-full" 
    //       />
    //     )}
    //     <span className="text-sm text-gray-600 hidden sm:block">
    //       {user.displayName}
    //     </span>
    //   </div>
    //   <button
    //     onClick={onSignOut}
    //     className="flex items-center gap-2 px-4 py-2 mt-4 sm:mt-0 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
    //   >
    //     <LogOut size={16} />
    //     Sign Out
    //   </button>
    // </header>
    <header className="flex justify-between items-center py-4 px-6 bg-white rounded-xl shadow-lg mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Coach Dashboard</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.photoURL || "/placeholder.svg?height=40&width=40&query=user avatar"}
                alt={user.displayName || "User"}
              />
              <AvatarFallback>
                {user.displayName ? user.displayName.charAt(0) : user.email ? user.email.charAt(0) : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;