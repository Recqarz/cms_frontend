import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./components/Home"; // Ensure correct path

function App() {
  return (
    <Router>
      <Home />
    </Router>
  );
}

export default App;
