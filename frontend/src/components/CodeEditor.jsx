import { useState, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Copy, Sparkles, Bot, Terminal } from "lucide-react";
import axios from "axios";
import "./codeeditor.css";

const languageOptions = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
};

const CodeEditor = () => {
  const [selectedCode, setSelectedCode] = useState("");
  const [aiExplanation, setAiExplanation] = useState("AI will explain the selected code here...");
  const [aiSuggestion, setAiSuggestion] = useState("AI will suggest improvements here...");
  const editorRef = useRef(null);
  const [code, setCode] = useState("");
  const [selectedLang, setSelectedLang] = useState("python");
  const [debugResult, setDebugResult] = useState("Run the code to see output...");
  const [userInput, setUserInput] = useState("");


  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorSelection(() => {
      const selection = editor.getModel().getValueInRange(editor.getSelection());
      setSelectedCode(selection);
    });
  };

  const handleDebug = async () => {
    setDebugResult("Running...");
    try {
      const response = await axios.post("http://localhost:3000/debug", {
        code,
        language: selectedLang,
        input: userInput,
      });

      const result = response.data;

      if (result.stdout) {
        setDebugResult(result.stdout);
      } else if (result.stderr) {
        setDebugResult(`Error: ${result.stderr}`);
      } else if (result.compile_output) {
        setDebugResult(`Compilation Error: ${result.compile_output}`);
      } else {
        setDebugResult("No output received.");
      }
    } catch (error) {
      console.error("Debug error:", error);
      setDebugResult(error);
    }
  };

  const handleExplainCode = async () => {
    if (!selectedCode) {
      alert("Please select a line or block of code!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: selectedCode }),
      });
  
      const data = await response.json();
      console.log(data);
      if (data.explanation && data.suggestion) {
        setAiExplanation(`🧠 Explanation:\n${data.explanation}`);
        setAiSuggestion(`💡 Suggestion:\n${data.suggestion}\n\n✅ Improved Code:\n${data.improved_code}`);
      } else {
        alert("No explanation or suggestion received.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };
  
  

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    alert("✅ Code copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-6 text-white flex flex-col items-center">
    <div className="w-full max-w-full bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="text-black p-2 rounded-lg"
        >
          {Object.keys(languageOptions).map((key) => (
            <option key={key} value={key}>
              {languageOptions[key]}
            </option>
          ))}
        </select>
        <span className="text-md sm:text-lg">Paste or write your code</span>
        <button
          onClick={handleCopyCode}
          className="text-sm text-teal-300 hover:text-teal-400 flex items-center"
        >
          <Copy className="w-4 h-4 mr-1" /> Copy Code
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left side: Code Editor */}
        <div className="flex-1">
          <Editor
            height="600px"
            theme="vs-dark"
            language={selectedLang}
            value={code}
            onChange={setCode}
            onMount={handleEditorDidMount}
            options={{ fontSize: 14 }}
          />
        </div>
        {/* Right side: Output, Explanation, and Suggested Fix */}
        <div className="flex-1 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]"> 
          <div>
            <label className="text-white font-medium">Input for your program:</label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={4}
              className="w-full mt-2 p-2 rounded-xl bg-gray-900 text-white border border-gray-700"
              placeholder="Enter input data (e.g., numbers, strings)..."
            />
          </div>

          {/* Run and Debug, Explain Code, Clear Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <motion.button
              className="bg-teal-600 hover:bg-teal-700 w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              onClick={handleDebug}
            >
              <Terminal className="w-4 h-4" /> Run & Debug
            </motion.button>

            <motion.button
              className="bg-purple-600 hover:bg-purple-700 w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              onClick={handleExplainCode}
            >
              <Bot className="w-4 h-4" /> Explain Code
            </motion.button>

            <motion.button
              className="bg-yellow-500 hover:bg-yellow-600 w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03 }}
              onClick={() => setCode("")}
            >
              <Sparkles className="w-4 h-4" /> Clear
            </motion.button>
          </div>

          {/* Output */}
          {debugResult && (
            <motion.div
              className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-bold text-teal-400 mb-2">💥 Output:</h3>
              <code className="text-green-400 whitespace-pre-wrap">{debugResult}</code>
            </motion.div>
          )}

          {/* AI Explanation */}
          <motion.div
            className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-purple-300 mb-2">🤖 AI Explanation:</h3>
            <p className="text-white whitespace-pre-wrap">{aiExplanation}</p>
          </motion.div>

          {/* Suggested Fix */}
          <motion.div
            className="mt-4 p-4 bg-gray-800 rounded-xl border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-bold text-yellow-300 mb-2">💡 Suggested Fix:</h3>
            <p className="text-white whitespace-pre-wrap">{aiSuggestion}</p>
          </motion.div>
        </div>

      </div>
    </div>
  </div>

  );
};

export default CodeEditor;
