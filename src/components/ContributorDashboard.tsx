import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { User, ContentItem } from '../types';
import { Users, FileText, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface ContributorDashboardProps {
  apiService: ApiService;
}

interface ContributorAssignment {
  contributor: User;
  contentItems: ContentItem[];
  totalItems: number;
  publishedItems: number;
  draftItems: number;
  archivedItems: number;
  lastActivity?: string;
}

export function ContributorDashboard({ apiService }: ContributorDashboardProps) {
  const [contributors, setContributors] = useState<User[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contributorAssignments, setContributorAssignments] = useState<ContributorAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [contributorsData, contentItemsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getContentItems()
      ]);

      setContributors(contributorsData);
      setContentItems(contentItemsData);

      const assignments = processContributorAssignments(contributorsData, contentItemsData);
      setContributorAssignments(assignments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const processContributorAssignments = (contributors: User[], items: ContentItem[]): ContributorAssignment[] => {
    return contributors.map(contributor => {
      const assignedItems = items.filter(item => 
        item.contributors && item.contributors.includes(contributor.id)
      );

      const publishedItems = assignedItems.filter(item => 
        item.workflow_step?.codename === 'published' || 
        item.workflow_step?.codename === 'scheduled'
      );

      const draftItems = assignedItems.filter(item => 
        item.workflow_step?.codename !== 'published' && 
        item.workflow_step?.codename !== 'scheduled' && 
        item.workflow_step?.codename !== 'archived'
      );

      const archivedItems = assignedItems.filter(item => 
        item.workflow_step?.codename === 'archived'
      );

      const lastActivity = assignedItems.length > 0 
        ? assignedItems.reduce((latest, item) => {
            if (!item.lastModified) return latest;
            if (!latest) return item.lastModified;
            return new Date(item.lastModified) > new Date(latest) ? item.lastModified : latest;
          }, undefined as string | undefined)
        : undefined;

      return {
        contributor,
        contentItems: assignedItems,
        totalItems: assignedItems.length,
        publishedItems: publishedItems.length,
        draftItems: draftItems.length,
        archivedItems: archivedItems.length,
        lastActivity
      };
    });
  };

  const getFilteredAssignments = () => {
    switch (activeFilter) {
      case 'active':
        return contributorAssignments.filter(assignment => assignment.totalItems > 0);
      case 'inactive':
        return contributorAssignments.filter(assignment => assignment.totalItems === 0);
      default:
        return contributorAssignments;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filteredAssignments = getFilteredAssignments();

  return (
    <div className="contributor-dashboard">
      <div className="dashboard-header">
        <h2>Contributor Dashboard</h2>
        <div className="dashboard-actions">
          <button 
            onClick={loadDashboardData} 
            disabled={isLoading}
            className="btn btn-secondary"
          >
            <RefreshCw size={16} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <Users size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Contributors</h3>
            <p className="summary-number">{contributors.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FileText size={24} />
          </div>
          <div className="summary-content">
            <h3>Total Content Items</h3>
            <p className="summary-number">{contentItems.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={24} />
          </div>
          <div className="summary-content">
            <h3>Published Items</h3>
            <p className="summary-number">
              {contentItems.filter(item => 
                item.workflow_step?.codename === 'published' || 
                item.workflow_step?.codename === 'scheduled'
              ).length}
            </p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <Clock size={24} />
          </div>
          <div className="summary-content">
            <h3>Draft Items</h3>
            <p className="summary-number">
              {contentItems.filter(item => 
                item.workflow_step?.codename !== 'published' && 
                item.workflow_step?.codename !== 'scheduled' && 
                item.workflow_step?.codename !== 'archived'
              ).length}
            </p>
          </div>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Contributors ({contributorAssignments.length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'active' ? 'active' : ''}`}
          onClick={() => setActiveFilter('active')}
        >
          Active Contributors ({contributorAssignments.filter(a => a.totalItems > 0).length})
        </button>
        <button
          className={`filter-tab ${activeFilter === 'inactive' ? 'active' : ''}`}
          onClick={() => setActiveFilter('inactive')}
        >
          Inactive Contributors ({contributorAssignments.filter(a => a.totalItems === 0).length})
        </button>
      </div>

      <div className="contributor-assignments">
        {filteredAssignments.length === 0 ? (
          <div className="no-data">
            <p>No contributors found matching the current filter.</p>
          </div>
        ) : (
          <div className="assignments-grid">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.contributor.id} className="assignment-card">
                <div className="assignment-header">
                  <div className="contributor-info">
                    <h3>{assignment.contributor.fullName || `${assignment.contributor.firstName || ''} ${assignment.contributor.lastName || ''}`.trim() || 'Unknown'}</h3>
                    <p className="contributor-email">{assignment.contributor.email}</p>
                  </div>
                  <div className="assignment-status">
                    {assignment.totalItems === 0 ? (
                      <span className="status-badge inactive">No Assignments</span>
                    ) : (
                      <span className="status-badge active">Active</span>
                    )}
                  </div>
                </div>

                <div className="assignment-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Items</span>
                    <span className="stat-value">{assignment.totalItems}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Published</span>
                    <span className="stat-value published">{assignment.publishedItems}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Draft</span>
                    <span className="stat-value draft">{assignment.draftItems}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Archived</span>
                    <span className="stat-value archived">{assignment.archivedItems}</span>
                  </div>
                </div>

                {assignment.lastActivity && (
                  <div className="last-activity">
                    <span className="activity-label">Last Activity:</span>
                    <span className="activity-date">{formatDate(assignment.lastActivity)}</span>
                  </div>
                )}

                {assignment.contentItems.length > 0 && (
                  <div className="content-items-preview">
                    <h4>Recent Assignments</h4>
                    <div className="items-list">
                      {assignment.contentItems.slice(0, 3).map((item) => (
                        <div key={item.id} className="content-item-preview">
                          <span className="item-name">{item.name}</span>
                          <span className={`item-status ${item.workflow_step?.codename || 'unknown'}`}>
                            {item.workflow_step?.codename || 'Unknown'}
                          </span>
                        </div>
                      ))}
                      {assignment.contentItems.length > 3 && (
                        <div className="more-items">
                          +{assignment.contentItems.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
