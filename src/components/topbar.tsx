import React from 'react';
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Settings, User, LogOut, LogIn } from 'lucide-react';
import { api } from "@/utils/api"; // Adjust this import based on your tRPC setup
import { ModeToggle } from "@/components/mode-togle"; 
import Image from 'next/image';
import logo from '@/components/Logo.png';
import logoDark from '@/components/logo-inverted.png';
import { useTheme } from "next-themes";



const TopBar = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { theme } = useTheme();

    { enabled: sessionData?.user !== undefined };

  const userInitials = sessionData?.user?.name
    ? sessionData.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };
  

  const handleLogin = () => {
    signIn();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex-1">
      
        <Image 
          src={theme === 'dark' ? logoDark.src : logo.src} 
          alt="StratTrader" 
          width={150}
          height={200}
          className='flex mx-auto sm:mx-0 sm:shrink-1' />
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle/>
        <form onSubmit={(e) => e.preventDefault()} className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8 w-[300px]"
          />
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={sessionData?.user?.image || ''} alt={sessionData?.user?.name || 'User'} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            {sessionData?.user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={handleLogin}>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log in</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;