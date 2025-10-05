import { setupWorker } from 'msw/browser';
import { handlers } from '@/mocks/handlers';

export const worker = setupWorker(...handlers);

export const enableMocking = async () => {
  if (typeof window === 'undefined') {
    return;
  }

  const { worker } = await import('./msw');
  
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
};


