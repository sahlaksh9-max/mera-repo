import React from 'react';
// This is an example of a heavy component that could benefit from lazy loading
// In a real scenario, this would be one of your actual large components

const HeavyComponentExample: React.FC = () => {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Heavy Component Example</h2>
      <p>This is an example of a heavy component that would benefit from lazy loading.</p>
      <p>In your actual app, this could be a component like AdmissionsPageManager which has over 2000 lines of code.</p>
    </div>
  );
};

export default HeavyComponentExample;