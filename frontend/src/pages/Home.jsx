import React from 'react';
import LoginForm from '../components/LoginForm';
import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <LoginForm />
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <Link to="/register">Register</Link> | <Link to="/chat">Join Chatroom</Link>
      </div>
    </div>
  );
}
