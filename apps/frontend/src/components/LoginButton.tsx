'use client';

import { useState, useEffect } from 'react';
import { loginWithII, logout, checkAuth } from '@/lib/auth';

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuthStatus = async () => {
      const { isAuthenticated, principal } = await checkAuth();
      setIsLoggedIn(isAuthenticated);
      if (principal) setPrincipal(principal);
    };
    
    checkAuthStatus();
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { principal } = await loginWithII();
      setIsLoggedIn(true);
      setPrincipal(principal);
      // Redirect or update UI as needed
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setPrincipal(null);
  };

  return (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <span className="text-sm text-gray-600 truncate max-w-xs">
            {principal?.substring(0, 10)}...
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Login with Internet Identity'}
        </button>
      )}
    </div>
  );
}
