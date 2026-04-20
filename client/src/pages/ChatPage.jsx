// src/pages/ChatPage.jsx
import ChatBox from "../components/ChatBox";

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <h1 className="text-xl font-bold p-4 bg-white shadow">
        OpsMind AI
      </h1>
      <ChatBox />
    </div>
  );
}