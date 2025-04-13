import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log("Login submitted", email, password);
    // call to Python backend for login
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
      <button type="submit">Login</button>
    </form>
  );
}
