import { useState } from 'react';
import { db } from '@/services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
      await addDoc(collection(db, 'feedback'), {
        ...feedback,
        createdAt: serverTimestamp(),
      });
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