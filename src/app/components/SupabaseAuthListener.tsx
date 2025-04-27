'use client';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SupabaseAuthListener() {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        const userId = session.user.id;
        supabase
          .from('profiles')
          .upsert({ id: userId })
          .then(({ error }) => {
            if (error) console.error('Profile upsert failed:', error);
          });
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return null;
}
