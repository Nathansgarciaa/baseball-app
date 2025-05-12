import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // ✅ Import global styles
import './index.css'; // ✅ Import base styling (if separated from App.css)

console.log('✅ App Type:', typeof App); // should say 'function'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
