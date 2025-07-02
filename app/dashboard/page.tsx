'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  // useEffect(() => {
  //   const loggedIn = localStorage.getItem('isLoggedIn');
  //   if (loggedIn !== 'true') {
  //     router.push('/login');
  //   }
  // }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <h1 className="text-3xl font-semibold">Welcome to your Dashboard 🎉</h1>
    </div>
  );
}
