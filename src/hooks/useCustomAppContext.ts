/**
 * Hook to access the full custom app context
 */

import { useContext } from 'react';
import { CustomAppState } from '../types';
import { CustomAppContext as Context } from '../components/CustomAppProvider';

export function useCustomAppContext(): CustomAppState | null {
  return useContext(Context);
}