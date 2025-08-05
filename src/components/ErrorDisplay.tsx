import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const isIframeError = error.includes('IFrame') || error.includes('iframe');
  const isDeploymentError = error.includes('401') || error.includes('unauthorized');

  return (
    <div className="error-display">
      <div className="error-icon">
        <AlertCircle size={48} />
      </div>
      
      <h2>Something went wrong</h2>
      
      <div className="error-message">
        {isIframeError ? (
          <div>
            <p><strong>This app must be opened from within Kontent.ai</strong></p>
            <p>Please navigate to your Kontent.ai project and open this custom app from there.</p>
            <div className="error-actions">
              <a 
                href="https://app.kontent.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="button primary"
              >
                <ExternalLink size={16} />
                Open Kontent.ai
              </a>
            </div>
          </div>
        ) : isDeploymentError ? (
          <div>
            <p><strong>Deployment Configuration Issue</strong></p>
            <p>The app is not properly configured for iframe embedding. Please check the deployment settings.</p>
            <div className="error-actions">
              {onRetry && (
                <button onClick={onRetry} className="button secondary">
                  <RefreshCw size={16} />
                  Retry
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Unexpected Error</strong></p>
            <p>{error}</p>
            <div className="error-actions">
              {onRetry && (
                <button onClick={onRetry} className="button secondary">
                  <RefreshCw size={16} />
                  Retry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}