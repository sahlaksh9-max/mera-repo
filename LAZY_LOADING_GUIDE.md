# Lazy Loading Guide

This guide explains how to implement lazy loading in your Vite + React project.

## Vite Configuration

Your Vite configuration already includes the alias for `@` pointing to the `src` directory:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

This configuration allows you to use the `@` alias in your imports, such as:
```ts
import SomeComponent from '@/components/SomeComponent';
```

## How to Implement Lazy Loading

### 1. Identify Components to Lazy Load

Large components that are not immediately visible on the screen or are rarely used are good candidates for lazy loading. Examples in your project include:

- AdmissionsPageManager.tsx (2494 lines)
- TopScorersLearnMoreManager.tsx (1728 lines)
- TeacherManager.tsx (1393 lines)
- GalleryManagerSimple.tsx (1072 lines)

### 2. Lazy Load a Component

To lazy load a component, follow these steps:

1. Import `React` and `Suspense`:
```jsx
import React, { Suspense } from 'react';
```

2. Use `React.lazy()` to dynamically import the component:
```jsx
const HeavyComponent = React.lazy(() => import('@/components/HeavyComponent'));
```

3. Wrap the component in a `Suspense` component with a fallback UI:
```jsx
<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

### 3. Complete Example

Here's a complete example of how to lazy load a component:

```jsx
import React, { Suspense } from 'react';

// Lazy load the heavy component
const HeavyComponent = React.lazy(() => import('@/components/HeavyComponent'));

function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      {/* Suspense is required for lazy-loaded components */}
      <Suspense fallback={<div>Loading component...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

export default MyPage;
```

### 4. Using Lazy Loading in Routes

You can also lazy load entire pages in your router. Here's how it's implemented in your project:

```jsx
// In App.tsx
import React, { Suspense } from 'react';
// ... other imports
import LazyLoadExample from "./pages/LazyLoadExample";

// ... in your routes
<Route path="/lazy-example" element={
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  >
    <LazyLoadExample />
  </motion.div>
} />
```

## Benefits of Lazy Loading

1. **Improved Initial Load Time**: Only the necessary code is loaded initially, reducing the bundle size.
2. **Better Performance**: Resources are allocated more efficiently.
3. **Enhanced User Experience**: Users can start interacting with the application sooner.

## Best Practices

1. **Use Meaningful Fallbacks**: Provide a good user experience while components are loading.
2. **Group Related Components**: Components that are always used together can be bundled together.
3. **Don't Overuse**: Not every component needs to be lazy loaded. Small, frequently used components should remain eagerly loaded.
4. **Test Thoroughly**: Ensure that lazy loading doesn't introduce any issues with your application's functionality.

## Example Files

- [LazyLoadExample.tsx](file:///c:/Users/user/Downloads/my-best-school-main/src/pages/LazyLoadExample.tsx): Demonstrates how to use lazy loading in a page component
- [HeavyComponentExample.tsx](file:///c:/Users/user/Downloads/my-best-school-main/src/components/HeavyComponentExample.tsx): An example of a heavy component that benefits from lazy loading

You can view the lazy loading example by navigating to `/lazy-example` in your application.