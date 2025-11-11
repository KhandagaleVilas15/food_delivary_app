import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-[#ff4d2d] rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-2 text-sm text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;