import { useState } from 'react';
import { ApiService } from '../services/api';

interface ApiTestProps {
  apiService: ApiService;
}

export function ApiTest({ apiService }: ApiTestProps) {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testApis = async () => {
    setIsTesting(true);
    setTestResults([]);
    
    addResult('Starting API tests...');
    
    try {
      // Test users API
      addResult('Testing users API...');
      const users = await apiService.getUsers();
      addResult(`✅ Users API: Found ${users.length} users`);
    } catch (error) {
      addResult(`❌ Users API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    try {
      // Test content types API
      addResult('Testing content types API...');
      const types = await apiService.getContentTypes();
      addResult(`✅ Content Types API: Found ${types.length} types`);
    } catch (error) {
      addResult(`❌ Content Types API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    try {
      // Test content items API
      addResult('Testing content items API...');
      const items = await apiService.getContentItems();
      addResult(`✅ Content Items API: Found ${items.length} items`);
    } catch (error) {
      addResult(`❌ Content Items API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    addResult('API tests completed.');
    setIsTesting(false);
  };

  return (
    <div className="api-test">
      <h3>API Configuration Test</h3>
      <button 
        onClick={testApis} 
        disabled={isTesting}
        className="test-button"
      >
        {isTesting ? 'Testing...' : 'Test APIs'}
      </button>
      
      {testResults.length > 0 && (
        <div className="test-results">
          <h4>Test Results:</h4>
          <div className="results-log">
            {testResults.map((result, index) => (
              <div key={index} className="log-entry">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 