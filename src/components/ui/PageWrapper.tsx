import { memo, Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface PageWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PageWrapper = memo(function PageWrapper({ 
  children, 
  fallback = <LoadingSpinner size="lg" className="min-h-screen" />
}: PageWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
});
