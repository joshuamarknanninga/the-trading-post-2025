const handleSubmit = async e => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
      alert('Login Successful!');
      localStorage.setItem('token', data.token);
      // redirect to dashboard or map
    } else {
      alert(data.error);
    }
  } catch (err) {
    alert('Login failed. Server error.');
  }
};
localStorage.setItem('token', data.token);
localStorage.setItem('user_email', email);
