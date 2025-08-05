/**
 * Main integration app component
 * 
 * This is where you'll build your custom app functionality.
 * The example below shows how to access information from Kontent.ai.
 * 
 * Available hooks:
 * - useConfig() - Get app configuration
 * - useEnvironmentId() - Get current environment ID  
 * - useUserInfo() - Get current user info (ID and email)
 * - useUserRoles() - Get current user's roles
 * - useCustomAppContext() - Get full app state
 */

import { BulkAssignmentDashboard } from './components/BulkAssignmentDashboard';

/**
 * Main application component for bulk contributor assignment
 */
export function IntegrationApp() {
  return <BulkAssignmentDashboard />;
}