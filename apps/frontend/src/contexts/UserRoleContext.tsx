"use client";

import type { UserRole } from '@/types';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserRoleContextType {
  role: UserRole | null;
  setRole: Dispatch<SetStateAction<UserRole | null>>;
  isLoading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching initial role or reading from localStorage
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    if (storedRole) {
      setRole(storedRole);
    } else {
      setRole('job_seeker'); // Default role
      localStorage.setItem('userRole', 'job_seeker');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
    }
  }, [role]);

  return (
    <UserRoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
