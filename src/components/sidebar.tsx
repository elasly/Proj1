'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Settings, HelpCircle, Menu, User, ChartAreaIcon, Users, CreditCard, Database, Key, Mail} from 'lucide-react';
import { Separator } from './ui/separator';
import { useSession } from 'next-auth/react';

const sidebarItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'profile', icon: User, href: '/profile' },
  { name: 'strategies', icon: ChartAreaIcon, href: '/strategies' },
  { name: 'charts', icon: ChartAreaIcon, href: '/charts' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Help', icon: HelpCircle, href: '/help' },
];

const adminMenu = [
  {name: 'users' , icon: Users, href: '/admin/users'},
  {name: 'email' , icon: Mail, href: '/admin/email'},
  {name: 'db cleanup' , icon: Database, href: '/admin/db'},
  {name: 'API Key' , icon: Key, href: '/admin/db'},
  {name: 'Subscriptions' , icon: CreditCard, href: '/admin/impersonate'},
];

const Sidebar = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <div className={cn(
      "flex flex-col h-screen transition-all duration-300",
      "bg-background text-foreground",
      "border-r border-border",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="p-4 flex items-center justify-between">
        {isExpanded && <span className="text-xl font-bold">
          </span>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <ScrollArea className="flex-grow">
        <nav className="space-y-2 p-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <TooltipProvider key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} passHref>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          !isExpanded && "justify-center",
                          isActive && "bg-secondary"
                        )}
                      >
                        <item.icon className="h-5 w-5 mr-2" />
                        {isExpanded && <span>{item.name}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right">
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
        {isAdmin && (
          <>
            <Separator className="my-4" />
            <nav className="space-y-2 p-2">
              {adminMenu.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <TooltipProvider key={item.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href} passHref>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start",
                              !isExpanded && "justify-center",
                              isActive && "bg-secondary"
                            )}
                          >
                            <item.icon className="h-5 w-5 mr-2" />
                            {isExpanded && <span>{item.name}</span>}
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      {!isExpanded && (
                        <TooltipContent side="right">
                          <p>{item.name}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </nav>
          </>     
        )}
      </ScrollArea>
    </div> 
  );
};

export default Sidebar;