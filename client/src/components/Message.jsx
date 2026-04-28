export default function Message({ msg }) {
  const isUser = msg.type === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} px-2`}>
      
      <div className="max-w-2xl w-full">

        {/* Message Bubble */}
        <div
          className={`
            px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap leading-relaxed
            ${isUser
              ? "bg-blue-600 text-white ml-auto rounded-br-none"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
            }
          `}
        >
          {msg.text}
        </div>

        {/* ✅ SOURCES AT END */}
        {!isUser && msg.sources?.length > 0 && (
          <div className="mt-3 px-2">
            
            <div className="text-xs text-gray-500 mb-2 font-medium">
              Sources
            </div>

            <div className="flex flex-wrap gap-2">
              {msg.sources.map((src, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition"
                >
                  📄 {src.fileName} • p.{src.pageNumber}
                </span>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}