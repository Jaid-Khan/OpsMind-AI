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
    if (!input) return;

    const userMsg = { type: "user", text: input };
    setMessages(prev => [...prev, userMsg]);

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
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="flex flex-col flex-1 p-4">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && <p className="text-gray-500 text-sm">Thinking...</p>}
      </div>

      {/* Sources */}
      <SourceList sources={sources} />

      {/* Input */}
      <div className="flex mt-4">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about SOP..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}