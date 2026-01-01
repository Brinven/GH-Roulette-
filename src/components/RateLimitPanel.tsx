'use client';

import { RateLimitInfo } from '@/lib/github/types';
import { useState, useEffect } from 'react';

interface RateLimitPanelProps {
  rateLimit: RateLimitInfo | null;
}

export default function RateLimitPanel({ rateLimit }: RateLimitPanelProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Helper to ensure resetAt is a Date object
  const getResetAt = (): Date => {
    if (!rateLimit) return new Date();
    if (rateLimit.resetAt instanceof Date) {
      return rateLimit.resetAt;
    }
    // Handle string or number (timestamp)
    if (typeof rateLimit.resetAt === 'string') {
      return new Date(rateLimit.resetAt);
    }
    if (typeof rateLimit.reset === 'number' && rateLimit.reset > 0) {
      return new Date(rateLimit.reset * 1000);
    }
    return new Date();
  };

  useEffect(() => {
    if (!rateLimit) return;

    const resetAt = getResetAt();

    const updateTimer = () => {
      const now = Date.now();
      const resetTime = resetAt.getTime();
      const diff = Math.max(0, resetTime - now);

      if (diff === 0) {
        setTimeRemaining('Resetting...');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [rateLimit]);

  const resetAt = getResetAt();

  if (!rateLimit) {
    return (
      <div className="border rounded-lg p-3 bg-gray-50">
        <p className="text-sm text-gray-600">Rate limit: Not loaded</p>
      </div>
    );
  }

  const isExhausted = rateLimit.remaining === 0;
  const percentage = (rateLimit.remaining / rateLimit.limit) * 100;

  return (
    <div className={`border rounded-lg p-3 ${isExhausted ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Rate Limit</span>
        <span className={`text-sm font-bold ${isExhausted ? 'text-red-600' : 'text-gray-900'}`}>
          {rateLimit.remaining} / {rateLimit.limit}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${
            percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isExhausted ? (
        <p className="text-xs text-red-600 font-medium">
          Resets in {timeRemaining}
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          Resets at {resetAt.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}

