'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { login } from '@/actions/auth';
import styles from './login.module.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>GovStaff</h1>
          <p className={styles.subtitle}>Unified Staff Management System</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', background: '#fef2f2', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className="input-group">
            <label htmlFor="role">Select Role</label>
            <select id="role" name="role" className={styles.roleSelect} defaultValue="brc">
              <option value="brc">BRC Login</option>
              <option value="district">District Login</option>
              <option value="state">State Login</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              className="input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary ${styles.submitBtn}`}
          >
            <Lock size={18} />
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </main>
  );
}
