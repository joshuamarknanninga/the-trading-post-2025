import React from 'react';
import PaymentForm from '../components/PaymentForm';

export default function Dashboard() {
  const email = localStorage.getItem('user_email'); // You should store this after login

  const connectWallet = async () => {
    const response = await fetch('http://localhost:5000/api/wallet/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const goToStripeDashboard = () => {
      window.open('https://dashboard.stripe.com/login', '_blank');
    };
  
    <button onClick={goToStripeDashboard}>Withdraw Funds</button>

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url; // Redirect to Stripe onboarding
    } else {
      alert(data.error || 'Error connecting wallet');
    }
  };

  return (
    <div>
      <h2>Welcome to your Dashboard</h2>
      <button onClick={connectWallet}>Connect Stripe Wallet</button>
      <PaymentForm />
    </div>
  );
}
