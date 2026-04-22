// src/pages/ChatPage.jsx
import ChatBox from "../components/ChatBox";

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                OpsMind AI
              </h1>
            </div>
            <div className="text-sm text-gray-500 hidden sm:block">
              Powered by RAG
            </div>
          </div>
        </div>
      </header>
      
      {/* Chat Interface */}
      <ChatBox />
    </div>
  );
}