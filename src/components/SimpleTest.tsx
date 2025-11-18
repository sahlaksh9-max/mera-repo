import React from "react";

const SimpleTest = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      minHeight: '500px',
      border: '2px solid red'
    }}>
      <h1 style={{ color: 'red', fontSize: '24px', marginBottom: '20px' }}>
        🔴 SIMPLE TEST COMPONENT - IF YOU SEE THIS, IT WORKS!
      </h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        This is a basic test component with inline styles.
      </p>
      <p style={{ fontSize: '16px', color: 'blue' }}>
        If this shows up, then the component system is working.
      </p>
      <div style={{
        backgroundColor: '#f0f0f0',
        padding: '15px',
        marginTop: '20px',
        border: '1px solid #ccc'
      }}>
        <h2 style={{ color: 'green' }}>About Page Manager - Test Version</h2>
        <p>This will be replaced with the full About Page Manager once we confirm it loads.</p>
      </div>
    </div>
  );
};

export default SimpleTest;
