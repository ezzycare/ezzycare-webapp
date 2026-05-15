'use client';

import FullLogo from '@/icons/FullLogo';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

export default function NotFoundPage() {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-default px-4">
      <FullLogo className="h-12 w-44 mb-8" />

      {/* 404 Text */}
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-extrabold text-text-muted tracking-tight animate-pulse">
          404
        </h1>
        <p className="text-xl text-text-muted max-w-md mx-auto animate-fadeIn">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Link
            href="/dashboard"
            className={clsx(
              'px-6 py-3 rounded-xl font-medium text-sm bg-blue-3a text-blue-11a hover:bg-blue-4a transition-all duration-300 transform hover:scale-105'
            )}
          >
            Go Home
          </Link>

          <button
            className={clsx(
              'px-6 py-3 rounded-xl font-medium text-sm border border-neutral-3a text-text-alt hover:bg-neutral-3a transition-all duration-300 transform hover:scale-105'
            )}
            onClick={() => setShowSecret(!showSecret)}
          >
            {showSecret ? 'Hide Secret' : 'Reveal Secret'}
          </button>
        </div>

        {/* Secret Box */}
        {showSecret && (
          <div className="mt-4 p-4 rounded-xl bg-surface-card shadow-lg text-sm text-text-alt max-w-md mx-auto animate-fadeIn">
            👀 Surprise! Even 404 pages can be stylish. Keep exploring our
            dashboard.
          </div>
        )}
      </div>

      {/* Animated Emoji / Illustration */}
      <div className="mt-12 animate-bounce">
        <span className="text-9xl">🙈</span>
      </div>
    </div>
  );
}
