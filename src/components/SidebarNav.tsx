
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Home, Building, MapPin, CreditCard, Bell, Settings, Users, ClipboardList } from 'lucide-react';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ElementType;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation();
  const { signOut, user } = useAuth();

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 px-4 py-6">
          <Building className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ComfyLiving</span>
        </div>
        <div className="px-3 py-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {user?.role === 'manager' ? 'Management' : 'Navigation'}
            </p>
            <nav
              className={cn(
                "flex flex-col space-y-1",
                className
              )}
              {...props}
            >
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className={cn(
                      "flex items-center justify-start gap-2 h-10 px-4 py-2",
                      pathname === item.href && "bg-accent text-accent-foreground"
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="mt-auto px-3 py-6">
        <Button 
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
