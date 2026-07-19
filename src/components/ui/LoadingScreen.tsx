import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-neutral-50 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-md">
        {/* Premium loader with primary (blue) and accent (purple) gradient spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-neutral-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-accent-500 animate-spin"></div>
        </div>
        <p className="text-neutral-500 font-medium tracking-wide animate-pulse">
          Loading IntelliStudy...
        </p>
      </div>
    </div>
  );
};
