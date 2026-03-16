'use client';

/**
 * HydrationProvider — rehidrata el store de Zustand en el cliente.
 *
 * Zustand con skipHydration: true no lee localStorage durante SSR.
 * Este componente llama a rehydrate() en el primer useEffect del cliente,
 * lo que garantiza que el estado persistido esté disponible antes de
 * que cualquier componente lo necesite.
 *
 * Ref oficial: https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md#skiphydration
 */
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export function HydrationProvider() {
  useEffect(() => {
    // rehydrate() lee localStorage y actualiza el store de forma síncrona
    useAuthStore.persist.rehydrate();
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
