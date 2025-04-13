import React, { useEffect, useState } from 'react';

export default function WalletSummary({ email }) {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await fetch('http://localhost:5000/api/wallet/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setBalance(data.available ? data.available[0].amount / 100 : 0);
    };

    const fetchTransactions = async () => {
      const res = await fetch('http://localhost:5000/api/wallet/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setTransactions(data);
    };

    fetchBalance();
    fetchTransactions();
  }, [email]);

  return (
    <div>
      <h3>Wallet Balance: ${balance}</h3>
      <h4>Transaction History:</h4>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>{t.amount / 100} USD — {t.created}</li>
        ))}
      </ul>
    </div>
  );
}
