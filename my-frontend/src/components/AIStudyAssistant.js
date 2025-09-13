// "use client";

// import { useState } from "react";
// import { Plus, Send, Loader2 } from "lucide-react";

// export default function AIStudyAssistant() {
//   const [question, setQuestion] = useState("");
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState("");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     if (!question && !file) {
//       alert("Please enter a question or upload a file.");
//       return;
//     }

//     setLoading(true);
//     setResponse("");

//     try {
//       const formData = new FormData();
//       formData.append("question", question);
//       if (file) formData.append("file", file);

//       const res = await fetch("/api/askGemini", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await res.json();
//       setResponse(data.answer);
//     } catch (error) {
//       console.error(error);
//       setResponse("❌ Error: Could not get response from AI.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-100 p-6">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition">
//         {/* Header */}
//         <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-2">
//           🤖 AI Study Assistant
//         </h1>
//         <p className="text-center text-gray-600 mb-8">
//           Upload study materials or ask a question to get focused, exam-ready answers.
//         </p>

//         {/* Input Section */}
//         <div className="relative flex items-center">
//           {/* File Upload */}
//           <label
//             htmlFor="file-upload"
//             className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-blue-600 hover:text-blue-800 transition"
//           >
//             <Plus size={22} />
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             onChange={handleFileChange}
//             className="hidden"
//           />

//           {/* Textarea */}
//           <textarea
//             placeholder="Type your question here..."
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             className="flex-1 w-full min-h-[70px] py-3 pl-12 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 placeholder-gray-400"
//           />

//           {/* Send Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-full shadow-md disabled:opacity-50 transition"
//           >
//             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
//           </button>
//         </div>

//         {/* File Preview */}
//         {file && (
//           <div className="mt-3 text-sm text-gray-600 flex items-center">
//             📂 <span className="ml-2">{file.name}</span>
//           </div>
//         )}

//         {/* AI Response */}
//         {response && (
//           <div className="mt-8 space-y-4">
//             {/* User message bubble */}
//             {question && (
//               <div className="flex justify-end">
//                 <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl max-w-[75%] shadow-sm">
//                   {question}
//                 </div>
//               </div>
//             )}

//             {/* AI message bubble */}
//             <div className="flex justify-start">
//               <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl border border-gray-200 shadow-sm max-w-[85%]">
//                 <h2 className="font-semibold text-blue-700 mb-1">AI Response:</h2>
//                 <p className="leading-relaxed whitespace-pre-line">{response}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Send,
  Loader2,
  X,
  FileText,
  Image,
  File,
  Trash2,
  Copy,
  Download,
  RefreshCw,
} from "lucide-react";

// ❌ DO NOT import pdf-parse here - it only works server-side
// import pdf from 'pdf-parse'; // Remove this if present

export default function AIStudyAssistant() {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom when new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType?.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (fileType === "application/pdf") return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 10 * 1024 * 1024) {
        alert("File size should be less than 10MB");
        return;
      }
      setFile(droppedFile);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Clear all conversations
  const clearChat = () => {
    setConversations([]);
  };

  // Submit question/file
  const handleSubmit = async () => {
    if (!question.trim() && !file) {
      alert("Please enter a question or upload a file.");
      return;
    }

    const userMessage = {
      type: "user",
      content: question.trim(),
      file: file
        ? {
            name: file.name,
            type: file.type,
            size: file.size,
          }
        : null,
      timestamp: new Date(),
    };

    // Add user message to conversation
    setConversations((prev) => [...prev, userMessage]);

    const currentQuestion = question;
    const currentFile = file;

    // Reset inputs
    setQuestion("");
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", currentQuestion);
      if (currentFile) formData.append("file", currentFile);

      const res = await fetch("/api/askGemini", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // Add AI response to conversation
      const aiMessage = {
        type: "ai",
        content: data.answer || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
      };

      setConversations((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        type: "ai",
        content: "❌ Error: Could not get response from AI. Please try again.",
        timestamp: new Date(),
        isError: true,
      };
      setConversations((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                🤖 AI Study Assistant
              </h1>
              <p className="opacity-90 text-sm mt-1">
                Upload study materials or ask questions to get focused,
                exam-ready answers
              </p>
            </div>
            {conversations.length > 0 && (
              <button
                onClick={clearChat}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-lg font-medium">Ready to help you study!</p>
              <p className="text-sm">
                Upload a file or ask a question to get started
              </p>
            </div>
          ) : (
            conversations.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : message.isError
                      ? "bg-red-50 border border-red-200 text-red-800"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {message.type === "user" && message.file && (
                    <div className="mb-2 flex items-center space-x-2 text-blue-100">
                      {getFileIcon(message.file.type)}
                      <span className="text-sm">{message.file.name}</span>
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>

                  {message.type === "ai" && !message.isError && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Copy response"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Section */}
        <div className="p-6 border-t border-gray-200 bg-white">
          {/* File Upload Area */}
          <div
            className={`relative mb-4 border-2 border-dashed rounded-lg p-4 transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.txt,.doc,.docx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Drop files here or{" "}
                    <span className="text-blue-600 underline">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports: Images, PDF, Text files (Max 10MB)
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="relative flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                placeholder="Type your question here... (Press Enter to send, Shift+Enter for new line)"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full min-h-[60px] max-h-[120px] py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800 placeholder-gray-400"
                rows="2"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (!question.trim() && !file)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl shadow-md transition-colors flex items-center justify-center min-w-[60px]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>Press Enter to send • Shift+Enter for new line</span>
            <span>{conversations.length} messages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
