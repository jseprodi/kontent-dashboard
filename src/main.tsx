/**
 * Application entry point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// Ensure we're running in a browser environment
if (typeof window === 'undefined') {
  throw new Error('This application must run in a browser environment');
}

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure your HTML includes a div with id="root"');
}

// Create root
const root = ReactDOM.createRoot(rootElement);

// Function to render error fallback
function renderError(message: string) {
  root.render(
    <div style={{ 
      maxWidth: '600px', 
      margin: '50px auto', 
      padding: '20px',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        border: '1px solid #f44336',
        borderRadius: '4px',
        padding: '16px',
        backgroundColor: '#ffebee'
      }}>
        <h4 style={{ color: '#d32f2f', margin: '0 0 8px 0' }}>
          App Not Running in Kontent.ai
        </h4>
        <p style={{ margin: '0 0 16px 0', color: '#424242' }}>
          {message}
        </p>
        <div style={{ marginTop: '16px' }}>
          <h5 style={{ margin: '0 0 8px 0', color: '#424242' }}>How to use this custom app:</h5>
          <ol style={{ marginLeft: '20px', color: '#424242' }}>
            <li>Open your Kontent.ai project</li>
            <li>Navigate to Environment settings → Custom apps</li>
            <li>Add this app with the correct URL</li>
            <li>Access the app from within the Kontent.ai interface</li>
          </ol>
          <p style={{ 
            marginTop: '16px', 
            fontSize: '14px', 
            color: '#666',
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '4px'
          }}>
            💡 This app cannot run standalone - it requires the Kontent.ai context to function properly.
          </p>
        </div>
      </div>
    </div>
  );
}

// Try to load and render the app with error handling
try {
  // Dynamic import to catch SDK errors during import
  import('./App').then(({ App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }).catch((error) => {
    console.error('Failed to load app:', error);
    if (error.message && error.message.includes('Custom app is not hosted in an IFrame')) {
      renderError('This app must be hosted within the Kontent.ai CMS interface. Please open this app from within your Kontent.ai project.');
    } else {
      renderError('Failed to load the application. Please try refreshing the page.');
    }
  });
} catch (error) {
  console.error('Failed to initialize app:', error);
  if (error instanceof Error && error.message.includes('Custom app is not hosted in an IFrame')) {
    renderError('This app must be hosted within the Kontent.ai CMS interface. Please open this app from within your Kontent.ai project.');
  } else {
    renderError('Failed to initialize the application. Please try refreshing the page.');
  }
}

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('Custom app is not hosted in an IFrame')) {
    event.preventDefault();
    renderError('This app must be hosted within the Kontent.ai CMS interface. Please open this app from within your Kontent.ai project.');
  }
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('Custom app is not hosted in an IFrame')) {
    event.preventDefault();
    renderError('This app must be hosted within the Kontent.ai CMS interface. Please open this app from within your Kontent.ai project.');
  }
});