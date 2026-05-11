import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import { cleanAnswer } from "../utils/cleanAnswer";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // ✅ Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      type: "user",
      text: input,
    };

    // 🔥 EMPTY BOT MESSAGE
    const botMsg = {
      type: "bot",
      text: "",
      sources: [],
    };

    // 🔥 STORE CURRENT INPUT
    const currentInput = input;

    setMessages((prev) => [
      ...prev,
      userMsg,
      botMsg,
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/query/stream",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            query: currentInput,
            history: messages.slice(-5),
          }),
        }
      );

      const reader =
        response.body.getReader();

      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) break;

        const chunk =
          decoder.decode(value);

        const lines = chunk
          .split("\n")
          .filter((line) =>
            line.startsWith("data:")
          );

        for (const line of lines) {
          const jsonStr =
            line.replace("data: ", "");

          if (!jsonStr) continue;

          const parsed =
            JSON.parse(jsonStr);

          // 🔥 STREAM TOKEN
          if (parsed.token) {
            fullText += parsed.token;

            setMessages((prev) => {
              const updated = [...prev];

              updated[
                updated.length - 1
              ] = {
                ...updated[
                  updated.length - 1
                ],

                text: cleanAnswer(
                  fullText
                ),
              };

              return updated;
            });
          }

          // 🔥 FINAL SOURCES
          if (parsed.done) {
            setMessages((prev) => {
              const updated = [...prev];

              updated[
                updated.length - 1
              ] = {
                ...updated[
                  updated.length - 1
                ],

                sources:
                  parsed.sources || [],
              };

              return updated;
            });
          }
        }
      }

    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Streaming failed.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !loading
    ) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg">
              💬 Ask me anything about your documents
            </p>

            <p className="text-sm mt-2">
              Start a conversation below
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">

          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }

            onKeyDown={handleKeyDown}

            placeholder="Ask about your documents..."

            disabled={loading}
          />

          <button
            onClick={handleSend}

            disabled={
              !input.trim() || loading
            }

            className={`
              px-6 py-2 rounded-lg font-medium transition
              ${
                !input.trim() ||
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
              }
            `}
          >
            {loading
              ? "Thinking..."
              : "Send"}
          </button>

        </div>
      </div>
    </div>
  );
}