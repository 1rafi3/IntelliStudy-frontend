import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@features/auth/hooks';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormInputs) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Registration successful! Welcome.');
        navigate('/dashboard');
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Registration failed';
        toast.error(msg);
      },
    });
  };

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
          Create your account
        </h2>
        <p className="mt-xs text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-micro">
            Sign in
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
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                className={`block w-full px-md py-sm bg-neutral-50 border ${
                  errors.name ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary-200'
                } rounded-xl text-sm transition-micro focus:outline-none focus:ring-4`}
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-xs text-xs text-red-500 font-medium">{errors.name.message}</p>
              )}
            </div>

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
              <label htmlFor="password" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
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
                disabled={registerMutation.isPending}
                className="w-full btn-primary font-semibold py-sm"
              >
                {registerMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
export default RegisterPage;
