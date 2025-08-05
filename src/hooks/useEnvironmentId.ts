/**
 * Hook to get the current environment ID
 */

import { useCustomAppContext } from './useCustomAppContext';

export function useEnvironmentId(): string | null {
  const context = useCustomAppContext();
  
  if (!context || !context.context) {
    return null;
  }
  
  return context.context.context?.environmentId || null;
}