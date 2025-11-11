import React from 'react';
import { MdError, MdRefresh } from 'react-icons/md';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  className = '',
  showRetry = true,
  title = 'Something went wrong'
}) => {
  if (!error) return null;

  return (
    <div className={`flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className="flex items-center mb-3">
        <MdError className="text-red-500 mr-2" size={24} />
        <h3 className="text-lg font-semibold text-red-700">{title}</h3>
      </div>
      
      <p className="text-red-600 text-center mb-4 text-sm">
        {typeof error === 'string' ? error : 'An unexpected error occurred'}
      </p>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <MdRefresh className="mr-2" size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;