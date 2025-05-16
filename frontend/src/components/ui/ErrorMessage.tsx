import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <p>{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="ml-auto flex items-center gap-1 text-xs bg-white border border-red-300 rounded px-2 py-1 hover:bg-red-50 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Retry
        </button>
      )}
    </div>
  );
};