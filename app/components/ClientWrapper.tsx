'use client';

import dynamic from 'next/dynamic';

const CacheDemo = dynamic(() => import('./CacheDemo'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Loading cache interface...
    </div>
  ),
});

export default function ClientWrapper() {
  return <CacheDemo />;
}
