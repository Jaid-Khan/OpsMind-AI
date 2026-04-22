// src/components/Message.jsx
export default function Message({ msg }) {
  const isUser = msg.type === "user";
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`
        max-w-[80%] sm:max-w-[70%] lg:max-w-[60%] 
        px-4 py-2 rounded-lg shadow-sm
        ${isUser 
          ? "bg-blue-600 text-white rounded-br-none" 
          : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
        }
      `}>
        <div className="whitespace-pre-wrap break-words">
          {msg.text}
        </div>
      </div>
    </div>
  );
}