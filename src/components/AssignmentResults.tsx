import { AssignmentResult } from '../types';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

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
  const failedResults = results.filter(result => !result.success);

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
            {failedResults.length > 0 && (
              <div className="stat-item error">
                <XCircle size={16} />
                <span>{failedResults.length} failed</span>
              </div>
            )}
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
                    Content Item ID: {result.contentItemId}
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
                    Content Item ID: {result.contentItemId}
                  </div>
                  <div className="success-message">
                    Contributors assigned successfully
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