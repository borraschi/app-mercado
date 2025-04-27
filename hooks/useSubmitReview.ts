import { useState } from 'react';
import { supabase } from '@/services/supabase';

interface SubmitReviewParams {
  userId: string;
  rating: number;
  comment: string;
}

export const useSubmitReview = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = async ({ userId, rating, comment }: SubmitReviewParams) => {
    setLoading(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase
        .from('reviews')
        .insert({
          userId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        });

      if (supabaseError) throw supabaseError;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitReview, loading, error };
};