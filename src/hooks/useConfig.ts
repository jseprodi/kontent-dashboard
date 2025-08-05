/**
 * Hook to get the app configuration
 */

import { useCustomAppContext } from './useCustomAppContext';
import { AppConfig } from '../types';

export function useConfig(): AppConfig | null {
  const context = useCustomAppContext();
  
  if (!context || !context.context) {
    return null;
  }
  
  return context.context.config || null;
}

