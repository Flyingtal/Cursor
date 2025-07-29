'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
  const { token } = params;
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [message, setMessage] = useState('Processing your invitation...');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post('/api/invite/accept', { token });
        setStatus('success');
        setMessage('Invitation accepted! Redirecting to your trip...');
        const { tripId } = res.data;
        setTimeout(() => router.push(`/trips/${tripId}`), 1500);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Failed to accept invitation.');
      }
    })();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">{status === 'loading' ? 'Please wait' : status === 'error' ? 'Error' : 'Success'}</h1>
      <p>{message}</p>
    </div>
  );
}