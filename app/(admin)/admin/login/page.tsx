'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/admin');
      }
    };
    
    checkUser();
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/admin');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsResettingPassword(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox.');
    }
    
    setIsResettingPassword(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
        </div>
        
        <div className="card">
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="form-label"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="form-label"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}
              {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg">{message}</div>}
              <div>
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Login
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={handlePasswordReset}
                disabled={isResettingPassword}
                className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                {isResettingPassword ? 'Sending...' : 'Forgot your password?'}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <Link href="/admin/reset-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                Already have a reset link? Reset password
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
            &larr; Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
}