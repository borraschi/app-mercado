import { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

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
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reviewsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Review[];
        setReviews(reviewsData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { reviews, loading, error };
};