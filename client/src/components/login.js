// Import required hooks and tools
import React, { useState } from 'react';
import axios from 'axios'; // Library for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Used to redirect the user after login/signup
import './login.css'; // Import styles for this page

// Login component: Handles both login and signup
function Login() {
  // Holds the current values of the username and password inputs
  const [form, setForm] = useState({ username: '', password: '' });

  // Boolean to toggle between login and signup mode
  const [isSignup, setIsSignup] = useState(false);

  // Allows navigation to other routes programmatically
  const navigate = useNavigate();

  // Runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Decide whether we are hitting the /login or /signup endpoint
    const endpoint = isSignup ? 'signup' : 'login';

    try {
      // Send the POST request with the form data
      const res = await axios.post(`http://localhost:3001/auth/${endpoint}`, form);

      // Show success message returned from the server
      alert(res.data.message);

      // If this is a login (not signup), save user ID and redirect
      if (!isSignup) {
        localStorage.setItem('userId', res.data.user.user_id); // Save logged-in user ID
        localStorage.setItem('username', res.data.user.username); // Optional: save username

        // Redirect the user to the home page
        navigate('/home');
      }
    } catch (err) {
      // If there's an error (like wrong password), show it
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-wrapper">
        <h1 className="app-title">⚾ Stat Tracker</h1>

        {/* Form for both login and signup */}
        <form onSubmit={handleSubmit}>
          <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

          {/* Username input */}
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            required
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* Submit button */}
          <button type="submit">
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>

          {/* Toggle between login and signup views */}
          <p onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Sign in' : 'New user? Create an account'}
          </p>
        </form>
      </div>
    </div>
  );
}

// Make this component usable in other parts of the app
export default Login;
