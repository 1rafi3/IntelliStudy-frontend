import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-md text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-extrabold text-primary-600 tracking-tight font-display mb-sm">404</h1>
        <h2 className="text-xl font-bold text-neutral-800 mb-xs">Page not found</h2>
        <p className="text-neutral-500 mb-lg text-sm">
          Sorry, we couldn't find the page you are looking for. It might have been moved or deleted.
        </p>
        <Link
          to="/"
          className="btn-primary"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
