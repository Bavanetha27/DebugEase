import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CodeEditor from "./components/CodeEditor";
import NavBar from "./components/NavBar";

function App() {
  return (
    
    <Router>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<CodeEditor />} />
      </Routes>
      <footer className="text-center py-6 bg-slate-900 text-gray-400">
        <p>&copy; 2025 DebugEase</p>
      </footer>
    </Router>

  );
}

export default App;
