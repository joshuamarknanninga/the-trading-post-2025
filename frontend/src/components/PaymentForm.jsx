import React, { useState } from 'react';

export default function PaymentForm() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const sendPayment = async e => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/wallet/pay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiver_email: email, amount })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Payment Sent!');
    } else {
      alert(data.error);
    }
  };

  return (
    <form onSubmit={sendPayment}>
      <h3>Send Payment</h3>
      <input
        type="email"
        placeholder="Recipient's Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="number"
        placeholder="Amount (USD)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      /><br />
      <button type="submit">Send</button>
    </form>
  );
}
