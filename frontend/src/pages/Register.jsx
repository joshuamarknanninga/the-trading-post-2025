import React, { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    selling_options: []
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        selling_options: checked
          ? [...prev.selling_options, value]
          : prev.selling_options.filter(option => option !== value)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        window.location.href = '/';
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Register</h2>
      <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required /><br />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
      <input name="address" placeholder="Street Address" value={form.address} onChange={handleChange} required /><br />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} required /><br />
      <input name="state" placeholder="State" value={form.state} onChange={handleChange} required /><br />

      <label>
        <input type="checkbox" value="Sell" onChange={handleChange} />
        Sell
      </label>
      <label>
        <input type="checkbox" value="Buy" onChange={handleChange} />
        Buy
      </label>
      <label>
        <input type="checkbox" value="Barter" onChange={handleChange} />
        Barter
      </label><br /><br />

      <button type="submit">Register</button>
    </form>
  );
}
