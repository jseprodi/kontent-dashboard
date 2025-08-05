/**
 * Hook to get current user roles
 */

import { useCustomAppContext } from './useCustomAppContext';
import { UserRole } from '../types';

export function useUserRoles(): UserRole[] {
  const context = useCustomAppContext();
  
  if (!context || !context.context) {
    return [];
  }
  
  return context.context.context.userRoles || [];
}