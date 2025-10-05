import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎉 InternConnect React App is Working!</h1>
      <p>If you can see this, the React app is loading correctly.</p>
      <p>Current URL: {window.location.href}</p>
      <p>Hash: {window.location.hash}</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Test Navigation:</h3>
        <a href="#/login" style={{ marginRight: '10px' }}>Login</a>
        <a href="#/student/dashboard" style={{ marginRight: '10px' }}>Student Dashboard</a>
        <a href="#/admin/dashboard">Admin Dashboard</a>
      </div>
    </div>
  );
}

export default App;
