import React, { useState } from 'react'
import { testFirebaseConnection } from './testFirebase'
import './App.css'

function App() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFirebaseTest = async () => {
    setIsLoading(true)
    setTestResult('Testing Firebase connection...')

    try {
      const success = await testFirebaseConnection()
      setTestResult(success ? 'Firebase connection successful!' : 'Firebase connection failed!')
    } catch (error) {
      setTestResult(`Firebase test error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Brill Prime - Web</h1>
      <p>Multi-platform e-commerce application</p>

      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={handleFirebaseTest} 
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Testing...' : 'Test Firebase Connection'}
        </button>
      </div>

      {testResult && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          backgroundColor: testResult.includes('successful') ? '#d4edda' : '#f8d7da',
          color: testResult.includes('successful') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {testResult}
        </div>
      )}

      <p style={{ fontSize: '12px', color: '#666' }}>
        Check the browser console for detailed Firebase test logs
      </p>
    </div>
  )
}

export default App