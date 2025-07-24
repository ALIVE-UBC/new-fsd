import React, { useState } from 'react';
import LoginBackground from '@/assets/login-background.png';
import AliveLogo from '@/assets/alive-logo-2.png';
import AliveLogo2 from '@/assets/alive-logo-blk.png';
import { useNavigate, createFileRoute } from '@tanstack/react-router';


const mockUsers = [
  { id: 1, username: 'admin', password: 'password123' },
  { id: 2, username: 'alive', password: 'secure_password' },
  { id: 3, username: 'testuser', password: 'test' },
];


export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();


   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const foundUser = mockUsers.find(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
      );

      if (foundUser && foundUser.password === password) {
        // --- 3. On success, navigate to the dashboard ---
        // TanStack Router's navigate function is more powerful and type-safe.
        // It takes an object with options.
        console.log('Login successful, redirecting to dashboard...');
        navigate({ to: '/dashboard' });
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel (No changes here) */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-bl from-gray-800 via-gray-600 to-blue-400 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={LoginBackground}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-white text-center">
          <img src={AliveLogo} alt="Alive Research" className="mx-auto mb-4 w-45 h-auto" />
        </div>
      </div>

      {/* Right Panel (No changes here) */}
      <div className="flex flex-col w-full md:w-1/2 justify-center items-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img src={AliveLogo2} alt="Alive" className="mx-auto w-32 mb-6 h-auto" />
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="rounded-md">
              <div className="py-2">
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="py-2 relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="text-center p-2 text-sm text-red-600 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Continue →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};