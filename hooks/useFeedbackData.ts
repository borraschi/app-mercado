import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';

interface Feedback {
  id: string;
  rating: number;
  selectedOptions: string[];
  comment: string;
  createdAt: string;
}

export const useFeedbackData = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Set up realtime subscription
        const subscription = supabase
          .channel('feedback-changes')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'feedback' }, 
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
        .from('feedback')
        .select('*')
        .order('createdAt', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setFeedbackList(data as Feedback[]);
      }
      setLoading(false);
    };

    fetchFeedback();
  }, []);

  return { feedbackList, loading, error };
};