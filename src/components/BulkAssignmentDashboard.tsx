import { useState } from 'react';
import { useCustomAppContext, useEnvironmentId } from '../hooks';
import { useBulkAssignment } from '../hooks/useBulkAssignment';
import { ApiService } from '../services/api';
import { ContentItemSelector } from './ContentItemSelector';
import { ContributorSelector } from './ContributorSelector';
import { AssignmentResults } from './AssignmentResults';
import { Users, FileText, ArrowRight } from 'lucide-react';

interface BulkAssignmentDashboardProps {
  apiService: ApiService;
}

export function BulkAssignmentDashboard({ apiService }: BulkAssignmentDashboardProps) {
  const appContext = useCustomAppContext();
  const environmentId = useEnvironmentId();
  const [activeTab, setActiveTab] = useState<'content' | 'contributors' | 'assign'>('content');
  
  const {
    selectedContentItems,
    selectedContributors,
    isAssigning,
    assignmentResults,
    setSelectedContentItems,
    setSelectedContributors,
    assignContributors,
    clearResults,
    resetSelection,
  } = useBulkAssignment({ apiService });

  const handleAssign = async () => {
    if (selectedContentItems.length === 0) {
      alert('Please select at least one content item.');
      return;
    }
    if (selectedContributors.length === 0) {
      alert('Please select at least one contributor.');
      return;
    }
    await assignContributors();
  };

  const handleRetry = async () => {
    const failedResults = assignmentResults.filter(result => !result.success);
    if (failedResults.length > 0) {
      await assignContributors();
    }
  };

  if (!appContext) {
    return (
      <div className="error-container">
        <p>Unable to connect to Kontent.ai. Please ensure you're running this app within the Kontent.ai interface.</p>
      </div>
    );
  }

  return (
    <div className="bulk-assignment-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Bulk Contributor Assignment</h1>
          <p>Assign contributors to multiple content items at once</p>
        </div>
        <div className="environment-info">
          <span>Environment: {environmentId || 'Not configured'}</span>
        </div>
      </div>

      <div className="navigation-tabs">
            <button
              className={`tab ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <FileText size={16} />
              Content Items ({selectedContentItems.length})
            </button>
            <button
              className={`tab ${activeTab === 'contributors' ? 'active' : ''}`}
              onClick={() => setActiveTab('contributors')}
            >
              <Users size={16} />
              Contributors ({selectedContributors.length})
            </button>
            <button
              className={`tab ${activeTab === 'assign' ? 'active' : ''}`}
              onClick={() => setActiveTab('assign')}
              disabled={selectedContentItems.length === 0 || selectedContributors.length === 0}
            >
              <ArrowRight size={16} />
              Assign
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'content' && (
              <ContentItemSelector
                apiService={apiService!}
                selectedItems={selectedContentItems}
                onSelectionChange={setSelectedContentItems}
              />
            )}

            {activeTab === 'contributors' && (
              <ContributorSelector
                apiService={apiService!}
                selectedContributors={selectedContributors}
                onSelectionChange={setSelectedContributors}
              />
            )}

            {activeTab === 'assign' && (
              <div className="assign-tab">
                <div className="assignment-summary">
                  <h3>Assignment Summary</h3>
                  <div className="summary-details">
                    <div className="summary-item">
                      <strong>Content Items:</strong> {selectedContentItems.length}
                    </div>
                    <div className="summary-item">
                      <strong>Contributors:</strong> {selectedContributors.length}
                    </div>
                    <div className="summary-item">
                      <strong>Total Assignments:</strong> {selectedContentItems.length * selectedContributors.length}
                    </div>
                  </div>
                  
                  <div className="assignment-actions">
                    <button
                      onClick={handleAssign}
                      disabled={isAssigning}
                      className="assign-button"
                    >
                      {isAssigning ? 'Assigning...' : 'Assign Contributors'}
                    </button>
                    <button
                      onClick={resetSelection}
                      className="reset-button"
                    >
                      Reset Selection
                    </button>
                  </div>
                </div>

                <AssignmentResults
                  results={assignmentResults}
                  isAssigning={isAssigning}
                  onClear={clearResults}
                  onRetry={handleRetry}
                />
              </div>
            )}
          </div>
    </div>
  );
} 