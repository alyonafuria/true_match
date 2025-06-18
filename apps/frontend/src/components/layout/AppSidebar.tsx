
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserRole } from '@/contexts/UserRoleContext';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger, // Added for potential desktop toggle
} from '@/components/ui/sidebar'; // Ensure SidebarTrigger is exported or use custom
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Briefcase,
  CheckSquare,
  Users,
  CreditCard,
  FileCheck,
  ClipboardList,
  PlusCircle,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  Scroll,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const jobSeekerNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/profile', label: 'My Profile / CV', icon: <UserCircle /> },
  { href: '/jobs', label: 'Job Board', icon: <Briefcase /> },
  { href: '/applications', label: 'My Applications', icon: <CheckSquare /> },
];

const employerNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/jobs/post', label: 'Post a Job', icon: <PlusCircle /> },
  { href: '/jobs/manage', label: 'Manage Jobs', icon: <Users /> },
  { href: '/payments', label: 'Payments', icon: <CreditCard /> },
];

const verifierNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/review', label: 'Review Queue', icon: <ClipboardList /> },
];

const commonBottomNavItems: NavItem[] = [
  { href: '/about', label: 'About TrueMatch', icon: <Info /> },
  { href: '/help', label: 'Help Center', icon: <HelpCircle /> },
  { href: '/faq', label: 'FAQ', icon: <Scroll /> },
  { href: '/settings', label: 'Settings', icon: <Settings /> },
];


export function AppSidebar() {
  const { role } = useUserRole();
  const pathname = usePathname();
  const router = useRouter();

  let navItems: NavItem[] = [];
  if (role === 'job_seeker') navItems = jobSeekerNavItems;
  else if (role === 'employer') navItems = employerNavItems;
  else if (role === 'verifier') navItems = verifierNavItems;

  const handleSignOut = () => {
    router.push('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 flex items-center justify-between">
        {/* <Link href="/dashboard" className="text-lg font-semibold text-primary font-headline">
          TrueMatch
        </Link> */}
        {/* SidebarTrigger can be used if sidebar has a button to toggle its own state on desktop */}
        {/* For now, PanelLeft in AppHeader handles mobile, and desktop sidebar is part of layout flow */}
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  className="w-full justify-start hover:bg-sidebar-accent active:scale-[0.98] transition-all"
                  tooltip={item.label}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         <SidebarMenu>
            {commonBottomNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="w-full justify-start hover:bg-sidebar-accent active:scale-[0.98] transition-all"
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={handleSignOut}
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive focus:text-destructive focus:bg-destructive/10 active:scale-[0.98] transition-all"
                    tooltip="Sign Out"
                >
                    <LogOut />
                    <span className="truncate">Sign Out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
