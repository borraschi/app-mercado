import { useState } from 'react';
import { db } from '@/services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
      await addDoc(collection(db, 'reviews'), {
        userId,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitReview, loading, error };
};