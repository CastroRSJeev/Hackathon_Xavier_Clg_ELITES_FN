"use client";

import { useState } from "react";
import { Plus, Send, Loader2 } from "lucide-react";

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
      setResponse("❌ Error: Could not get response from AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
          🤖 AI Study Assistant
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload study materials or ask a question to get focused, exam-ready answers.
        </p>

        {/* Input Section */}
        <div className="relative flex items-center">
          {/* File Upload */}
          <label
            htmlFor="file-upload"
            className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800 transition"
          >
            <Plus size={22} />
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Textarea */}
          <textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 w-full min-h-[70px] py-3 pl-12 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 placeholder-gray-400"
          />

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-md disabled:opacity-50 transition"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
          </button>
        </div>

        {/* File Preview */}
        {file && (
          <div className="mt-3 text-sm text-gray-600 flex items-center">
            📂 <span className="ml-2">{file.name}</span>
          </div>
        )}

        {/* AI Response */}
        {response && (
          <div className="mt-8 space-y-4">
            {/* User message bubble */}
            {question && (
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-[75%] shadow-sm">
                  {question}
                </div>
              </div>
            )}

            {/* AI message bubble */}
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl border border-gray-200 shadow-sm max-w-[85%]">
                <h2 className="font-semibold text-blue-700 mb-1">AI Response:</h2>
                <p className="leading-relaxed whitespace-pre-line">{response}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
