'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    }
  };

  return (
    <div className="p-8 pt-24">
      <div className="flex items-center mb-6">
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
          Change Password
        </span>
        <button
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Back
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Change Password</h1>
      </div>
      
      <div className="card">
        <div className="p-6">
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="form-label"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="form-input"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="form-label"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}
            {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg">{message}</div>}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn-primary"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}