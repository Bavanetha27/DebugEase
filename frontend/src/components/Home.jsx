import React, { useState,useEffect,useContext } from "react";
import { Link } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion"; 
import AOS from "aos"; 
import "aos/dist/aos.css";
import "./Home.css";
import { AuthContext } from "./AuthContext";


const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen body">
      
      <header className="text-center py-16 flex flex-col justify-center align-middle min-h-screen hero">
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-7xl font-bold mb-4"
        >
          AI-Powered Code Debugger
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl text-gray-300"
        >
          Paste your code, get instant fixes, and optimize it with AI.
        </motion.p>
        {isLoggedIn ? (
          <Link to="/editor">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-6 px-6 py-3 bg-teal-400 hover:bg-teal-600 text-white rounded-lg shadow-lg transition"
            >
              Try It Now
            </motion.button>
          </Link>
        ) : (
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-6 px-6 py-3 bg-teal-400 hover:bg-teal-600 text-white rounded-lg shadow-lg transition"
            >
              Log In to Try It Now
            </motion.button>
          </Link>
        )}
      </header>

      <section className="py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6" data-aos="fade-up">
          ⚡ How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg" data-aos="zoom-in">
            <h3 className="text-xl font-semibold mb-2">1️⃣ Paste Your Code</h3>
            <p className="text-gray-400">Copy and paste your code into the editor.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg" data-aos="zoom-in" data-aos-delay="200">
            <h3 className="text-xl font-semibold mb-2">2️⃣ AI Debugging</h3>
            <p className="text-gray-400">AI identifies errors and suggests fixes.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg" data-aos="zoom-in" data-aos-delay="400">
            <h3 className="text-xl font-semibold mb-2">3️⃣ Get Optimized Code</h3>
            <p className="text-gray-400">Receive optimized code and explanations.</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <h2 className="text-3xl font-semibold text-center mb-6" data-aos="fade-up">
          ✨ Features
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-zinc-500" data-aos="fade-right">
            <h3 className="text-xl font-semibold mb-2">🛑 Error Detection</h3>
            <p className="text-gray-400">Find syntax and logical errors instantly.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-zinc-500" data-aos="fade-left">
            <h3 className="text-xl font-semibold mb-2">🔧 AI Fixes</h3>
            <p className="text-gray-400">AI suggests code improvements automatically.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-zinc-500" data-aos="fade-right">
            <h3 className="text-xl font-semibold mb-2">📖 Code Explanation</h3>
            <p className="text-gray-400">Understand your code with detailed AI explanations.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg hover:bg-zinc-500" data-aos="fade-left">
            <h3 className="text-xl font-semibold mb-2">🌙 Dark Mode & Syntax Highlighting</h3>
            <p className="text-gray-400">Enjoy a beautiful, readable editor.</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6" data-aos="fade-up">
          🎯 Try Debugging Now
        </h2>
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Editor height="300px" language="javascript" theme="vs-dark" defaultValue="// Paste your code here..." />
          {isLoggedIn ? (
            <Link to="/editor">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-6 px-6 py-3 bg-fuchsia-400 hover:bg-fuchsia-600 text-white rounded-lg shadow-lg transition"
              >
                Start Debugging
              </motion.button>
            </Link>
          ) : (
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-6 px-6 py-3 bg-fuchsia-400 hover:bg-fuchsia-600 text-white rounded-lg shadow-lg transition"
              >
                Log In to Start Debugging
              </motion.button>
            </Link>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
