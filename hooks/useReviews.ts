import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Set up realtime subscription
        const subscription = supabase
          .channel('review-changes')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'reviews' }, 
            () => {
              fetchInitialData();
            }
          )
          .subscribe();

        // Fetch initial data
        fetchInitialData();

        // Cleanup subscription
        return () => {
          supabase.removeChannel(subscription);
        };
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchInitialData = async () => {
      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select('*')
        .order('createdAt', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setReviews(data as Review[]);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  return { reviews, loading, error };
};