import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useGoogleLoginMutation } from '@features/auth/hooks';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: string;
              shape?: string;
              theme?: string;
              text?: string;
              size?: string;
              width?: number;
              logo_alignment?: string;
            },
          ) => void;
        };
      };
    };
  }
}

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL || 'demo@intellistudy.ai';
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'Demo1234';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  // Retrieve destination route if redirected by ProtectedRoute
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Load Google Identity Services script
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    if (window.google?.accounts) {
      setGoogleScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Track whether Google button has been initialized
  const googleInitialized = useRef(false);

  // Initialize and render Google Sign-In button
  useEffect(() => {
    if (!googleScriptLoaded || !googleBtnRef.current || !window.google?.accounts) return;
    if (googleInitialized.current) return;
    googleInitialized.current = true;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        googleLoginMutation.mutate(response.credential, {
          onSuccess: () => {
            toast.success('Signed in with Google!');
            navigate(from, { replace: true });
          },
          onError: (err: any) => {
            const msg = err.response?.data?.message || 'Google sign-in failed';
            toast.error(msg);
          },
        });
      },
    });
    window.google.accounts.id.renderButton(googleBtnRef.current, {
      type: 'standard',
      shape: 'rectangular',
      theme: 'outline',
      text: 'continue_with',
      size: 'large',
      width: googleBtnRef.current.offsetWidth || 400,
      logo_alignment: 'left',
    });
  }, [googleScriptLoaded, googleLoginMutation, navigate, from]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Welcome back!');
        navigate(from, { replace: true });
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Invalid email or password';
        toast.error(msg);
      },
    });
  };

  const handleDemoLogin = () => {
    setValue('email', DEMO_EMAIL);
    setValue('password', DEMO_PASSWORD);
    handleSubmit(onSubmit)();
  };

  // Shared indicator for any auth operation in progress
  const isPending = loginMutation.isPending || googleLoginMutation.isPending;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-xl px-md sm:px-lg">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center mb-md">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-lg font-display">I</span>
          </div>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-neutral-800 font-display">
          Sign in to IntelliStudy AI
        </h2>
        <p className="mt-xs text-center text-sm text-neutral-500">
          Or{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-micro">
            create a free account
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-lg sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-lg px-lg border border-neutral-200/60 rounded-2xl shadow-sm">
          <form className="space-y-md" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`block w-full px-md py-sm bg-neutral-50 border ${
                  errors.email ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary-200'
                } rounded-xl text-sm transition-micro focus:outline-none focus:ring-4`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-xs text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-xs">
                <label htmlFor="password" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`block w-full px-md py-sm bg-neutral-50 border ${
                  errors.password ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary-200'
                } rounded-xl text-sm transition-micro focus:outline-none focus:ring-4`}
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-xs text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full btn-primary font-semibold py-sm"
              >
                {loginMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Demo Login */}
            <div>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDemoLogin}
                className="w-full py-sm px-md border border-dashed border-accent-300 text-accent-600 hover:bg-accent-50 rounded-xl text-sm font-semibold transition-micro"
              >
                Demo Login
              </button>
            </div>
          </form>

          {/* Divider */}
          {GOOGLE_CLIENT_ID && (
            <div className="relative my-md">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-sm text-neutral-400 font-semibold">or continue with</span>
              </div>
            </div>
          )}

          {/* Google Sign-In Button */}
          {GOOGLE_CLIENT_ID && (
            <div className="flex justify-center">
              {googleLoginMutation.isPending ? (
                <div className="flex items-center justify-center gap-2 w-full py-sm border border-neutral-200 rounded-xl text-sm text-neutral-500">
                  <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                  Connecting to Google...
                </div>
              ) : (
                <div ref={googleBtnRef} className="w-full min-h-[40px]" />
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
export default LoginPage;
