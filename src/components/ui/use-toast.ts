'use client';

import { ToastProps } from '@radix-ui/react-toast';
import { toast as sonnerToast, type ToasterProps } from 'sonner';

export { toast } from 'sonner';

export type { ToastProps };

export function useToast() {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
  };
}  