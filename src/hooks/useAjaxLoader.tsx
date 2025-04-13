// src/hooks/useAjaxLoader.ts
import { useIonLoading } from '@ionic/react';
import { useRef } from 'react';

export const useAjaxLoader = () => {
  const [present, dismiss] = useIonLoading();
  const isPresented = useRef(false);

  const safePresent = async (message = 'Loading...') => {
    if (!isPresented.current) {
      isPresented.current = true;
      await present({ message });
      console.log('[Loader] presented');
    }
  };

  const safeDismiss = async () => {
    if (isPresented.current) {
      await dismiss();
      isPresented.current = false;
      console.log('[Loader] dismissed');
    }
  };

  return {
    safePresent,
    safeDismiss,
  };
};
