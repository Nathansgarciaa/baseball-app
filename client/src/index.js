import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('✅ App Type:', typeof App); // should say 'function'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
