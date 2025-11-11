import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const SkeletonCard = ({ className = '', rows = 3 }) => (
  <div className={`animate-pulse bg-white rounded-lg shadow p-4 ${className}`}>
    <div className="h-4 bg-gray-200 rounded mb-3"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-3 bg-gray-200 rounded mb-2"></div>
    ))}
  </div>
);

const SkeletonList = ({ count = 3, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const DataState = ({ 
  loading, 
  error, 
  data, 
  onRetry, 
  children,
  emptyMessage = 'No data available',
  loadingMessage = 'Loading...',
  errorTitle = 'Something went wrong',
  skeletonCount = 3,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-[200px] ${className}`}>
        <LoadingSpinner message={loadingMessage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage 
          error={error} 
          onRetry={onRetry} 
          title={errorTitle}
        />
      </div>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[200px] p-6 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <p className="text-gray-600 text-center">{emptyMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-[#ff4d2d] text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Refresh
          </button>
        )}
      </div>
    );
  }

  return children;
};

export default DataState;
export { SkeletonCard, SkeletonList };