"use client";

import { useState } from "react";
import { Plus, Send } from "lucide-react";

export default function AIStudyAssistant() {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!question && !file) {
      alert("Please enter a question or upload a file.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const formData = new FormData();
      formData.append("question", question);
      if (file) formData.append("file", file);

      const res = await fetch("/api/askGemini", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      console.error(error);
      setResponse("Error: Could not get response from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">
          🤖 AI Study Assistant
        </h1>
        <p className="text-center mb-6 text-gray-600">
          Upload study files or type your question to get smart answers for exam
          preparation.
        </p>

        {/* Textarea with icons */}
        <div className="relative flex items-center">
          {/* File upload */}
          <label
            htmlFor="file-upload"
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800 z-10"
          >
            <Plus size={24} />
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="absolute left-0 w-0 h-0 overflow-hidden"
          />

          {/* Textarea */}
          <textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 w-full pt-4  pl-12 pr-12 rounded-xl border
             border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-full disabled:opacity-50 z-10"
          >
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>

        {/* AI Response */}
        {response && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
            <h2 className="font-semibold mb-2 text-blue-700">AI Response:</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
