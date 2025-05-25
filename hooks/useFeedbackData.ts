import { useState, useEffect } from 'react';
import { db } from '@/services/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

interface Feedback {
  id: string;
  rating: number;
  selectedOptions: string[];
  comment: string;
  createdAt: any; // Firestore Timestamp
}

export const useFeedbackData = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const feedbackData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Feedback[];
        setFeedbackList(feedbackData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { feedbackList, loading, error };
};