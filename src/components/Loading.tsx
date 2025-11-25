import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
}

export default function Loading({ fullScreen = false }: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-primary-color rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-primary-color rounded-full animate-spin"></div>
      </div>
    </div>
  );
}