import React, { Suspense } from 'react';

// Lazy load the heavy component
const HeavyComponent = React.lazy(() => import('@/components/HeavyComponentExample'));

function LazyLoadExample() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lazy Loading Example</h1>
      <p className="mb-4">The heavy component below is loaded lazily, which helps improve initial page load performance.</p>
      
      {/* 
        Suspense is required for lazy-loaded components. 
        The fallback prop specifies what to render while the component is loading.
      */}
      <Suspense fallback={<div className="p-4 bg-gray-200 rounded-lg">Loading component...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

export default LazyLoadExample;