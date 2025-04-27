import { useState } from 'react';
import { supabase } from '@/services/supabase';

interface FeedbackData {
  rating: number;
  selectedOptions: string[];
  comment: string;
}

export const useSubmitFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (feedback: FeedbackData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase
        .from('feedback')
        .insert({
          ...feedback,
          createdAt: new Date().toISOString(),
        });

      if (supabaseError) throw supabaseError;
      
      setIsSubmitting(false);
      return true; // Indicate success
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
      return false; // Indicate failure
    }
  };

  return { submitFeedback, isSubmitting, error };
};