/**
 * Hook to get current user information
 */

import { useCustomAppContext } from './useCustomAppContext';

export interface UserInfo {
  userId: string;
  userEmail: string;
}

export function useUserInfo(): UserInfo | null {
  const context = useCustomAppContext();
  
  if (!context || !context.context) {
    return null;
  }
  
  return {
    userId: context.context.context.userId || '',
    userEmail: context.context.context.userEmail || '',
  };
}