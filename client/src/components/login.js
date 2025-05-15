import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? 'signup' : 'login';

    try {
      const res = await axios.post(`http://localhost:3001/auth/${endpoint}`, form); // ✅ fixed
      alert(res.data.message);
      if (!isSignup) navigate('/home'); // Redirect after login
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="auth-container">
      <div className="form-wrapper">
        <h1 className="app-title">⚾ Stat Tracker</h1>
        <form onSubmit={handleSubmit}>
          <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">{isSignup ? 'Create Account' : 'Sign In'}</button>
          <p onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Sign in' : 'New user? Create an account'}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
