import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Login.module.css'; // Adjust path if needed
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/auth/login', {
        email,
        password,
      });
      setMessage(response.data.message);
      console.log('Login successful:', response.data);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <p><Link href="/forgot-password">Forgot Password?</Link></p>
        <button type="submit" className={styles.button}>Login</button>

        <p>Don't have an account? <Link href="/register">Register</Link></p>
        
      </form>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
