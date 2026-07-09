import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-6">
      <form
        className="w-full max-w-sm bg-paper-raised border border-border rounded-md p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-xl font-medium text-ink">Welcome back</h1>
          <p className="text-ink-secondary text-sm mt-1">Log in to see your tasks.</p>
        </div>

        {error && (
          <div className="bg-rust/10 text-rust text-sm rounded-md px-3 py-2 border border-rust/30">
            {error}
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium text-ink-secondary">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-border rounded-md px-3 py-2 text-sm font-normal bg-paper text-ink
                       focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink-secondary">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-border rounded-md px-3 py-2 text-sm font-normal bg-paper text-ink
                       focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-gold hover:bg-gold/90 disabled:opacity-60
                     text-[#1a1006] font-medium text-sm rounded-md py-2.5 transition-colors"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-sm text-ink-secondary text-center">
          No account?{' '}
          <Link to="/register" className="text-moss font-medium hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}