// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp > now) {
          router.replace('/dashboard'); // ✅ redirect to dashboard
        } else {
          localStorage.clear();
          router.replace('/login'); // ✅ token expired
        }
      } catch (err) {
        localStorage.clear();
        router.replace('/login'); // ✅ invalid token
      }
    } else {
      router.replace('/login'); // ✅ not logged in
    }
  }, [router]);

  return null; // Or a loading spinner if you want
}
