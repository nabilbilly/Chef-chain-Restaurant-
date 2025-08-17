import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../../services/api/test';

const TestConnection = () => {
  const [apiStatus, setApiStatus] = useState('Testing...');
  const [isLoading, setIsLoading] = useState(true);
  const [lastTested, setLastTested] = useState(null);

  const testConnection = async () => {
    setIsLoading(true);
    setApiStatus('Testing...');
    
    try {
      const response = await apiEndpoints.test();
      setApiStatus(response.data.message);
      setLastTested(new Date().toLocaleTimeString());
    } catch (error) {
      setApiStatus('Failed to connect to Django API');
      console.error('API connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-secondary-800">
          🔗 API Connection Test
        </h3>
      </div>
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-secondary-600">Status:</p>
            <p className={`font-medium ${
              isLoading ? 'text-yellow-600' : 
              apiStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'
            }`}>
              {isLoading ? 'Testing connection...' : apiStatus}
            </p>
          </div>
          <div className={`badge-${
            isLoading ? 'warning' : 
            apiStatus.includes('Failed') ? 'error' : 'success'
          }`}>
            {isLoading ? 'Testing' : 
             apiStatus.includes('Failed') ? 'Failed' : 'Connected'}
          </div>
        </div>
        
        {lastTested && (
          <p className="text-xs text-secondary-500 mb-4">
            Last tested: {lastTested}
          </p>
        )}
        
        <button 
          onClick={testConnection}
          disabled={isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Testing...' : 'Test Again'}
        </button>
      </div>
    </div>
  );
};

export default TestConnection;