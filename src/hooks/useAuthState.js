import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

const auth = getAuth();

/**
 * Hook para verificar el estado de autenticación en web y plataformas nativas
 * Evita el problema de loops infinitos en iOS/Android
 */
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let unsubscribe;
    let mounted = true;

    const setupAuth = async () => {
      if (Capacitor.isNativePlatform()) {
        // En plataformas nativas, solo obtén el usuario actual una vez
        try {
          const result = await FirebaseAuthentication.getCurrentUser();
          if (mounted) {
            setUser(result.user || null);
            setAuthReady(true);
          }
        } catch (error) {
          if (mounted) {
            setUser(null);
            setAuthReady(true);
          }
        }
      } else {
        // En web, usa el listener normal
        unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
          if (mounted) {
            setUser(firebaseUser);
            setAuthReady(true);
          }
        });
      }
    };

    setupAuth();

    return () => {
      mounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { user, authReady };
};
