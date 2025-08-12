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

import { useState } from 'react';
import { BulkAssignmentDashboard } from './components/BulkAssignmentDashboard';
import { WorkflowManager } from './components/WorkflowManager';
import { ContributorDashboard } from './components/ContributorDashboard';
import { useCustomAppContext, useEnvironmentId } from './hooks';
import { ApiService } from './services/api';
import { Users, Workflow, BarChart3 } from 'lucide-react';

/**
 * Main application component with tabbed interface
 */
export function IntegrationApp() {
  const [activeTab, setActiveTab] = useState<'bulk-assignment' | 'workflow' | 'dashboard'>('bulk-assignment');
  const appContext = useCustomAppContext();
  const environmentId = useEnvironmentId();

  // Initialize API service when all required keys are provided
  const [apiConfig, setApiConfig] = useState({
    subscriptionApiKey: '',
    managementApiKey: '',
    environmentId: '',
    subscriptionId: '',
  });

  const apiService = apiConfig.subscriptionApiKey && 
                    apiConfig.managementApiKey && 
                    apiConfig.environmentId && 
                    apiConfig.subscriptionId
    ? new ApiService(
        apiConfig.subscriptionApiKey, 
        apiConfig.managementApiKey, 
        apiConfig.environmentId,
        apiConfig.subscriptionId
      )
    : null;

  if (!appContext) {
    return (
      <div className="error-container">
        <p>Unable to connect to Kontent.ai. Please ensure you're running this app within the Kontent.ai interface.</p>
      </div>
    );
  }

  return (
    <div className="integration-app">
      <div className="app-header">
        <h1>Kontent.ai Custom App</h1>
        <p>Environment: {environmentId || 'Not configured'}</p>
      </div>

      {/* API Configuration Setup */}
      {!apiConfig.subscriptionApiKey || !apiConfig.managementApiKey || !apiConfig.environmentId || !apiConfig.subscriptionId ? (
        <div className="api-keys-setup">
          <div className="setup-header">
            <h2>API Configuration Setup</h2>
          </div>
          <p>To use this app, you need to provide your API keys and configuration details.</p>
          
          <div className="api-keys-form">
            <div className="form-group">
              <label htmlFor="subscriptionApiKey">Subscription API Key</label>
              <input
                id="subscriptionApiKey"
                type="password"
                placeholder="Enter your Subscription API key"
                value={apiConfig.subscriptionApiKey}
                onChange={(e) => setApiConfig(prev => ({ ...prev, subscriptionApiKey: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="managementApiKey">Management API Key</label>
              <input
                id="managementApiKey"
                type="password"
                placeholder="Enter your Management API key"
                value={apiConfig.managementApiKey}
                onChange={(e) => setApiConfig(prev => ({ ...prev, managementApiKey: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="environmentId">Environment ID</label>
              <input
                id="environmentId"
                type="text"
                placeholder="Enter your Environment ID"
                value={apiConfig.environmentId}
                onChange={(e) => setApiConfig(prev => ({ ...prev, environmentId: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subscriptionId">Subscription ID</label>
              <input
                id="subscriptionId"
                type="text"
                placeholder="Enter your Subscription ID"
                value={apiConfig.subscriptionId}
                onChange={(e) => setApiConfig(prev => ({ ...prev, subscriptionId: e.target.value }))}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'bulk-assignment' ? 'active' : ''}`}
              onClick={() => setActiveTab('bulk-assignment')}
            >
              <Users size={20} />
              Bulk Assignment
            </button>
            <button
              className={`tab-button ${activeTab === 'workflow' ? 'active' : ''}`}
              onClick={() => setActiveTab('workflow')}
            >
              <Workflow size={20} />
              Workflow Management
            </button>
            <button
              className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 size={20} />
              Contributor Dashboard
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'bulk-assignment' && apiService && (
              <BulkAssignmentDashboard apiService={apiService} />
            )}
            {activeTab === 'workflow' && apiService && (
              <WorkflowManager apiService={apiService} />
            )}
            {activeTab === 'dashboard' && apiService && (
              <ContributorDashboard apiService={apiService} />
            )}
          </div>
        </>
      )}
    </div>
  );
}