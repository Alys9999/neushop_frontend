import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://db-group5-452710.wl.r.appspot.com";

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // used only for registration
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch(`/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) throw new Error("Login failed");
        return response.json();
      })
      .then(() => {
        navigate('/dashboard');
      })
      .catch(() => setErrorMsg('Invalid login'));
  };

  const handleRegister = () => {
    if (!username || !email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    fetch(`/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(() => {
        navigate('/dashboard');
      })
      .catch(async (errRes) => {
        const err = await errRes.json();
        setErrorMsg(err.error || "Registration failed");
      });
  };

  return (
    <div className="container" style={{ maxWidth: '450px', margin: '80px auto', padding: '30px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 className="mb-4 text-center">Welcome to <strong>Neushop</strong></h2>
      <div className="mb-3">
        <label className="form-label">Username</label>
        <input 
          type="text"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username" 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email (only for registration)</label>
        <input 
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email" 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input 
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password" 
        />
      </div>
      {errorMsg && <p className="text-danger">{errorMsg}</p>}
      <div className="d-grid gap-2">
        <button className="btn btn-primary" onClick={handleLogin}>Log In</button>
        <button className="btn btn-success" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default Login;
