const TestComponent = () => {
  return (
    <div style={{ padding: "32px", backgroundColor: "white", color: "black", borderRadius: "8px", border: "2px solid red" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px", color: "red" }}>
        🔴 TEST COMPONENT WORKS! 🔴
      </h1>
      <p style={{ color: "black" }}>If you can see this RED bordered box, the component is rendering correctly.</p>
      <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "#3b82f6", color: "white", borderRadius: "4px" }}>
        <p>This is a test to ensure components are loading.</p>
      </div>
    </div>
  );
};

export default TestComponent;
