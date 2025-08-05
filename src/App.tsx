/**
 * Root App component with error boundary and context providers
 */

import { useContext } from 'react';
import { CustomAppProvider, CustomAppContext } from './components/CustomAppProvider';
import { IntegrationApp } from './IntegrationApp';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';

/**
 * Inner app component that handles different states
 */
function AppContent() {
  const appState = useContext(CustomAppContext);

  if (!appState) {
    return <ErrorDisplay error="Custom app context not available" />;
  }

  if (appState.isLoading) {
    return <LoadingSpinner message="Connecting to Kontent.ai..." />;
  }

  if (appState.error) {
    const onRetry = appState.error.includes('IFrame') || appState.error.includes('iframe') 
      ? undefined 
      : () => window.location.reload();
    
    return (
      <ErrorDisplay 
        error={appState.error} 
        onRetry={onRetry}
      />
    );
  }

  return <IntegrationApp />;
}

/**
 * Root App component with providers and error handling
 */
export function App() {
  return (
    <CustomAppProvider>
      <AppContent />
    </CustomAppProvider>
  );
}