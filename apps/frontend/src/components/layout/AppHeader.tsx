"use client";

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, ChevronDown, LogOut, Settings, UserCircle, Users, Briefcase, FileCheck, PanelLeft } from 'lucide-react';
import { useUserRole } from '@/contexts/UserRoleContext';
import type { UserRole } from '@/types';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar'; // For mobile toggle

export function AppHeader() {
  const { role, setRole } = useUserRole();
  const router = useRouter();
  const { toggleSidebar } = useSidebar(); // For mobile sidebar

  const handleSignOut = () => {
    // Simulate sign out
    router.push('/');
  };

  const handleRoleChange = (newRole: string) => {
    setRole(newRole as UserRole);
    // Potentially navigate to the new role's default page or refresh dashboard
    router.push('/dashboard'); 
  };
  
  const roleDisplayNames: Record<UserRole, string> = {
    job_seeker: 'Job Seeker',
    employer: 'Employer',
    verifier: 'Verifier',
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    job_seeker: <UserCircle className="mr-2 h-4 w-4" />,
    employer: <Briefcase className="mr-2 h-4 w-4" />,
    verifier: <FileCheck className="mr-2 h-4 w-4" />,
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0"
        onClick={toggleSidebar} // Use toggleSidebar from useSidebar
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1">
        <Link href="/dashboard" className="text-xl font-bold text-primary font-headline">
          TrueMatch
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 hover:bg-accent/20 active:scale-95 transition-all">
              {role && roleIcons[role]}
              {role ? roleDisplayNames[role] : 'Select Role'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={role || ''} onValueChange={handleRoleChange}>
              <DropdownMenuRadioItem value="job_seeker">
                <UserCircle className="mr-2 h-4 w-4" /> Job Seeker
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="employer">
                <Briefcase className="mr-2 h-4 w-4" /> Employer
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="verifier">
                <FileCheck className="mr-2 h-4 w-4" /> Verifier
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/20 active:scale-95 transition-all">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent/20 active:scale-95 transition-all">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="avatar person" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile"><UserCircle className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
