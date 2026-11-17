'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getJumpTarget } from '@/lib/jumpTarget';

function scrollToTarget(id: string) {
  const target = getJumpTarget(id);
  if (!target) return false;
  const y = target.el.getBoundingClientRect().top + window.scrollY + target.offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
  return true;
}

const HashScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    const attemptScroll = (retries = 10) => {
      const hash = window.location.hash;
      if (!hash) return;
      const id = decodeURIComponent(hash.replace('#', ''));
      if (!scrollToTarget(id) && retries > 0) {
        setTimeout(() => attemptScroll(retries - 1), 80);
      }
    };

    // Small delay to let the page render after navigation
    setTimeout(() => attemptScroll(10), 50);

    const handleHashChange = () => {
      attemptScroll(10);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathname]);

  return null;
};

export default HashScroll;
