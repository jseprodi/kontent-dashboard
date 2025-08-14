import { AssignmentResult } from '../types';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Info } from 'lucide-react';

interface AssignmentResultsProps {
  results: AssignmentResult[];
  isAssigning: boolean;
  onClear: () => void;
  onRetry: () => void;
}

export function AssignmentResults({ 
  results, 
  isAssigning, 
  onClear, 
  onRetry 
}: AssignmentResultsProps) {
  if (results.length === 0 && !isAssigning) {
    return null;
  }

  const successfulResults = results.filter(result => result.success);
  const failedResults = results.filter(result => !result.success && !result.requiresManualIntervention);
  const manualInterventionResults = results.filter(result => result.requiresManualIntervention);

  return (
    <div className="assignment-results">
      <div className="results-header">
        <h3>Assignment Results</h3>
        <div className="results-actions">
          {results.length > 0 && (
            <button onClick={onClear} className="clear-btn">
              Clear Results
            </button>
          )}
          {failedResults.length > 0 && (
            <button onClick={onRetry} className="retry-btn">
              <RefreshCw size={16} />
              Retry Failed
            </button>
          )}
        </div>
      </div>

      {isAssigning && (
        <div className="assigning-status">
          <div className="spinner"></div>
          <p>Assigning contributors to content items...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-summary">
          <div className="summary-stats">
            <div className="stat-item success">
              <CheckCircle size={16} />
              <span>{successfulResults.length} successful</span>
            </div>
            {manualInterventionResults.length > 0 && (
              <div className="stat-item warning">
                <AlertTriangle size={16} />
                <span>{manualInterventionResults.length} need manual intervention</span>
              </div>
            )}
            {failedResults.length > 0 && (
              <div className="stat-item error">
                <XCircle size={16} />
                <span>{failedResults.length} failed</span>
              </div>
            )}
          </div>
        </div>
      )}

      {manualInterventionResults.length > 0 && (
        <div className="manual-intervention-results">
          <h4>Items Requiring Manual Intervention</h4>
          <div className="manual-intervention-list">
            {manualInterventionResults.map((result, index) => (
              <div key={index} className="manual-intervention-item">
                <div className="manual-intervention-icon">
                  <AlertTriangle size={16} />
                </div>
                <div className="manual-intervention-content">
                  <div className="manual-intervention-title">
                    Content Item: {result.contentItemCodename || result.contentItemId}
                  </div>
                  {result.reason === 'archived' && (
                    <div className="manual-intervention-reason">
                      <strong>Reason:</strong> Item is archived
                    </div>
                  )}
                  {result.message && (
                    <div className="manual-intervention-message">{result.message}</div>
                  )}
                  {result.instructions && (
                    <div className="manual-intervention-instructions">
                      <Info size={14} />
                      <span>{result.instructions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {failedResults.length > 0 && (
        <div className="failed-results">
          <h4>Failed Assignments</h4>
          <div className="error-list">
            {failedResults.map((result, index) => (
              <div key={index} className="error-item">
                <div className="error-icon">
                  <XCircle size={16} />
                </div>
                <div className="error-content">
                  <div className="error-title">
                    Content Item: {result.contentItemCodename || result.contentItemId}
                  </div>
                  {result.error && (
                    <div className="error-message">{result.error}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {successfulResults.length > 0 && (
        <div className="successful-results">
          <h4>Successful Assignments</h4>
          <div className="success-list">
            {successfulResults.map((result, index) => (
              <div key={index} className="success-item">
                <div className="success-icon">
                  <CheckCircle size={16} />
                </div>
                <div className="success-content">
                  <div className="success-title">
                    Content Item: {result.contentItemCodename || result.contentItemId}
                  </div>
                  <div className="success-message">
                    {result.message || 'Contributors assigned successfully'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 