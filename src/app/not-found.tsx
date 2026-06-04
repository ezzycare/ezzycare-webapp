'use client';

import NavBar from '@/components/Base/Nav';
import { Error404Icon } from '@/icons/Error404Icon';
import { AuthStore, useAuthStore } from '@/stores/authStore';

export default function NotFoundPage() {
  const isAuthenticated = useAuthStore((state: AuthStore) =>
    state.isAuthenticated()
  );

  return (
    <div className="w-full h-full">
      <NavBar />
      <div className="max-w-238 mx-auto w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center bg-surface-default px-4">
        <div>
          <h1 className="text-4xl font-semibold text-text ">Page Not Found</h1>
          <p className="text-text-muted mt-3">
            We couldn’t find the page you were looking for. Please check the URL
            to be sure it’s correct and try again.
          </p>

          <button
            className="cursor-pointer bg-blue-3a text-blue-11 py-2 px-4 rounded-xl mt-10"
            onClick={() => {
              if (isAuthenticated) {
                window.location.href = '/dashboard';
              } else {
                window.location.href = '/';
              }
            }}
          >
            Back to home page
          </button>
        </div>
        <div className="text-center mt-20">
          <Error404Icon />
        </div>
      </div>
    </div>
  );
}
