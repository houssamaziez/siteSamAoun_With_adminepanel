import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { signInWithEmail } from '../../lib/supabase';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        if (error.message.includes('Network connection failed')) {
          setError('Cannot connect to server. Please check your internet connection and try again.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        onLogin();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        <div className="text-center animate-scale-in">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-strong animate-float">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-bold gradient-text">Admin Login</h2>
          <p className="mt-3 text-lg text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-strong animate-fade-in" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-wiggle">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative animate-fade-in-left stagger-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-glow transition-all duration-300"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative animate-fade-in-right stagger-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-10 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-glow transition-all duration-300"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover-scale"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="animate-fade-in-up stagger-3">
            <Button
              type="submit"
              loading={loading}
              className="w-full hover-lift btn-primary shadow-medium"
              size="lg"
            >
              Sign In
            </Button>
          </div>

          <div className="text-center animate-fade-in stagger-4">
            <p className="text-sm text-gray-600">
              To create an admin user, go to your Supabase dashboard → Authentication → Users → Add user
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Then add the user ID to the admins table in your database
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}