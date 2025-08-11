import { useState } from 'react';
import { ApiService } from '../services/api';
import { Workflow } from '../types';
import { Settings, Play, Edit, Trash2, Plus, RefreshCw } from 'lucide-react';

interface WorkflowManagerProps {
  apiService: ApiService;
}

export function WorkflowManager({ apiService }: WorkflowManagerProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [draftStepId, setDraftStepId] = useState<string | null>(null);

  const loadWorkflows = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const workflowsData = await apiService.getWorkflows();
      setWorkflows(workflowsData);
      
      // Try to find the default workflow and draft step
      const defaultDraftStepId = await apiService.getDefaultWorkflowDraftStep();
      setDraftStepId(defaultDraftStepId);
      
      if (defaultDraftStepId) {
        console.log(`Default draft step ID: ${defaultDraftStepId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkflowSelect = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      await apiService.deleteWorkflow(workflowId);
      await loadWorkflows(); // Reload the list
      setSelectedWorkflow(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workflow');
    }
  };

  return (
    <div className="workflow-manager">
      <div className="workflow-header">
        <h2>Workflow Management</h2>
        <div className="workflow-actions">
          <button 
            onClick={loadWorkflows} 
            disabled={isLoading}
            className="btn btn-secondary"
          >
            <RefreshCw size={16} />
            {isLoading ? 'Loading...' : 'Refresh Workflows'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {draftStepId && (
        <div className="info-message">
          <p><strong>Default Draft Step ID:</strong> {draftStepId}</p>
          <p>This ID will be used when automatically changing workflow steps for published/archived items.</p>
        </div>
      )}

      <div className="workflow-content">
        <div className="workflow-list">
          <h3>Available Workflows</h3>
          {workflows.length === 0 ? (
            <p>No workflows found. Click "Refresh Workflows" to load them.</p>
          ) : (
            <div className="workflow-grid">
              {workflows.map((workflow) => (
                <div 
                  key={workflow.id} 
                  className={`workflow-card ${selectedWorkflow?.id === workflow.id ? 'selected' : ''}`}
                  onClick={() => handleWorkflowSelect(workflow)}
                >
                  <div className="workflow-card-header">
                    <h4>{workflow.name}</h4>
                    <span className="workflow-codename">{workflow.codename}</span>
                  </div>
                  <div className="workflow-steps">
                    <p><strong>Steps:</strong> {workflow.steps.length}</p>
                    <p><strong>Scopes:</strong> {workflow.scopes.join(', ')}</p>
                  </div>
                  <div className="workflow-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkflow(workflow.id);
                      }}
                      className="btn btn-danger btn-sm"
                      title="Delete workflow"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedWorkflow && (
          <div className="workflow-details">
            <h3>Workflow Details: {selectedWorkflow.name}</h3>
            <div className="workflow-info">
              <p><strong>ID:</strong> {selectedWorkflow.id}</p>
              <p><strong>Codename:</strong> {selectedWorkflow.codename}</p>
              <p><strong>Scopes:</strong> {selectedWorkflow.scopes.join(', ')}</p>
            </div>

            <div className="workflow-steps-detail">
              <h4>Workflow Steps</h4>
              <div className="steps-list">
                {selectedWorkflow.steps.map((step) => (
                  <div key={step.id} className="step-item">
                    <div className="step-header">
                      <span className="step-name">{step.name}</span>
                      <span className="step-codename">{step.codename}</span>
                    </div>
                    <div className="step-details">
                      <p><strong>ID:</strong> {step.id}</p>
                      {step.color && <p><strong>Color:</strong> {step.color}</p>}
                      {step.role_ids && step.role_ids.length > 0 && (
                        <p><strong>Roles:</strong> {step.role_ids.length}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedWorkflow.published_step && (
              <div className="special-steps">
                <h4>Special Steps</h4>
                <p><strong>Published Step:</strong> {selectedWorkflow.published_step.name}</p>
                {selectedWorkflow.scheduled_step && (
                  <p><strong>Scheduled Step:</strong> {selectedWorkflow.scheduled_step.name}</p>
                )}
                {selectedWorkflow.archived_step && (
                  <p><strong>Archived Step:</strong> {selectedWorkflow.archived_step.name}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="workflow-usage">
        <h3>How It Works</h3>
        <p>
          When you assign contributors to content items using the bulk assignment feature, 
          the system will automatically:
        </p>
        <ul>
          <li>Check if the content item is currently published or archived</li>
          <li>If so, create a new version of the item</li>
          <li>Change the workflow step to the draft step (ID: {draftStepId || 'Not found'})</li>
          <li>Assign the contributors to the new draft version</li>
        </ul>
        <p>
          This ensures that published or archived content goes through proper review 
          before being published again.
        </p>
      </div>
    </div>
  );
}
