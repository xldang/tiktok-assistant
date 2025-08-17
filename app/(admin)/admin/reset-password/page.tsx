'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);

  const supabase = createClient();

  // Function to parse URL fragment parameters
  const parseFragmentParams = () => {
    const fragment = window.location.hash.substring(1); // Remove the '#'
    const params = new URLSearchParams(fragment);
    const paramMap = {};
    for (const [key, value] of params) {
      paramMap[key] = value;
    }
    return paramMap;
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Get fragment parameters (after #)
        const fragmentParams = parseFragmentParams();
        const accessToken = fragmentParams['access_token'];
        const refreshToken = fragmentParams['refresh_token'];
        const tokenType = fragmentParams['token_type'];
        const type = fragmentParams['type'];

        console.log('Fragment params:', fragmentParams);

        // Check if this is a recovery link
        if (type === 'recovery' && accessToken) {
          // Set the session using the access token from the fragment
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          console.log('Set session result:', data, error);

          if (error) {
            setError(`Error setting session: ${error.message}`);
          } else if (data?.session) {
            // Verify that we have a valid session
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log('User:', user, 'User error:', userError);
            
            if (userError) {
              setError(`Error getting user: ${userError.message}`);
            } else if (user) {
              setSessionValid(true);
            } else {
              setError('Failed to establish a valid session. Please try resetting your password again.');
            }
          }
        } else {
          // Check if there's already a session
          const { data: { session }, error } = await supabase.auth.getSession();
          console.log('Existing session:', session, 'Session error:', error);
          
          if (error) {
            setError(`Error getting session: ${error.message}`);
          } else if (session?.user) {
            // Verify that we have a valid session
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            console.log('User:', user, 'User error:', userError);
            
            if (userError) {
              setError(`Error getting user: ${userError.message}`);
            } else if (user) {
              setSessionValid(true);
            } else {
              setError('Failed to establish a valid session. Please try resetting your password again.');
            }
          } else {
            setError('No valid session found. Please use the password reset link sent to your email.');
          }
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('An unexpected error occurred while initializing the session.');
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Your password has been updated successfully. Redirecting to login page...');
        // Sign out the user to clear any session
        await supabase.auth.signOut();
        setTimeout(() => {
          router.push('/admin/login');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error updating password:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
        {!sessionValid && (
          <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg">
            <p>No valid session found. Please use the password reset link sent to your email.</p>
            <p className="mt-2">If you arrived here directly, please go to the login page to initiate a new password reset.</p>
          </div>
        )}
        {sessionValid && (
          <div className="p-4 mb-4 text-sm text-green-800 bg-green-100 rounded-lg">
            <p>Valid session detected. You can now reset your password.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!sessionValid}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${!sessionValid ? 'bg-gray-100' : ''}`}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!sessionValid}
              className={`w-full px-3 py-2 mt-1 border rounded-md ${!sessionValid ? 'bg-gray-100' : ''}`}
            />
          </div>
          <button
            type="submit"
            disabled={!sessionValid || loading}
            className={`w-full px-4 py-2 font-medium text-white rounded-md ${
              !sessionValid || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="text-sm">
          <Link href="/admin/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}