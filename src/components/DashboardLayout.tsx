
import React from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Home, CreditCard, Bell, MapPin, Building, ClipboardList, Users } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  const tenantNavItems = [
    { href: "/dashboard", title: "Dashboard", icon: Home },
    { href: "/dashboard/service-requests", title: "Service Requests", icon: Bell },
    { href: "/dashboard/map", title: "Map", icon: MapPin },
    { href: "/dashboard/payments", title: "Payments", icon: CreditCard },
  ];

  const managerNavItems = [
    { href: "/dashboard", title: "Dashboard", icon: Home },
    { href: "/dashboard/apartments", title: "Apartments", icon: Building },
    { href: "/dashboard/service-requests", title: "Service Requests", icon: ClipboardList },
    { href: "/dashboard/tenants", title: "Tenants", icon: Users },
  ];

  const navItems = user.role === 'manager' ? managerNavItems : tenantNavItems;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex flex-col w-64 border-r bg-background sticky top-0 h-screen">
        <SidebarNav items={navItems} />
      </aside>
      <main className="flex-1">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
