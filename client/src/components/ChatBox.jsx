// src/components/ChatBox.jsx
import { useState } from "react";
import { queryDocs } from "../api/api";
import Message from "./Message";
import SourceList from "./SourceList";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await queryDocs(input);

      const botMsg = {
        type: "bot",
        text: res.data.answer
      };

      setMessages(prev => [...prev, botMsg]);
      setSources(res.data.sources || []);

    } catch (err) {
      console.error(err);
      const errorMsg = {
        type: "bot",
        text: "Sorry, I encountered an error. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-50">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">💬 Ask me anything about your documents</p>
            <p className="text-sm mt-2">Start a conversation by typing a message below</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sources Section */}
      {sources.length > 0 && <SourceList sources={sources} />}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your documents..."
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all
              ${!input.trim() || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }
            `}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}