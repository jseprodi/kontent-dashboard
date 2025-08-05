/**
 * React context provider for Custom App SDK
 */

import { createContext, ReactNode, useState, useEffect } from 'react';
import { getCustomAppContext } from '@kontent-ai/custom-app-sdk';
import { CustomAppState, CustomAppContext as AppContext } from '../types';

/**
 * Context for sharing custom app state throughout the component tree
 */
export const CustomAppContext = createContext<CustomAppState | null>(null);

/**
 * Props for CustomAppProvider component
 */
interface CustomAppProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes the Custom App SDK and provides
 * the app state to all child components
 */
export function CustomAppProvider({ children }: CustomAppProviderProps) {
  const [appState, setAppState] = useState<CustomAppState>({
    isLoading: true,
    error: null,
    context: null,
  });

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        const response = await getCustomAppContext();

        if (!isMounted) return;

        if (response.isError) {
          setAppState({
            isLoading: false,
            error: response.description || 'Failed to initialize custom app',
            context: null,
          });
          return;
        }

        // Transform the response to match our CustomAppContext type
        const context: AppContext = {
          config: response.config || {},
          context: {
            environmentId: response.context?.environmentId || '',
            userId: response.context?.userId || '',
            userEmail: response.context?.userEmail || '',
            userRoles: response.context?.userRoles?.map(role => ({
              id: role.id,
              codename: role.codename || undefined,
            })) || [],
          },
        };

        setAppState({
          isLoading: false,
          error: null,
          context,
        });
      } catch (error) {
        if (!isMounted) return;

        let errorMessage = 'Unknown error occurred';
        
        if (error instanceof Error) {
          // Check for specific iframe error
          if (error.message.includes('Custom app is not hosted in an IFrame')) {
            errorMessage = 'This app must be hosted within the Kontent.ai CMS interface. Please open this app from within your Kontent.ai project.';
          } else {
            errorMessage = error.message;
          }
        }

        setAppState({
          isLoading: false,
          error: errorMessage,
          context: null,
        });
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CustomAppContext.Provider value={appState}>
      {children}
    </CustomAppContext.Provider>
  );
}

