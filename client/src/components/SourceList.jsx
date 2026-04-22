// src/components/SourceList.jsx
export default function SourceList({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Source Documents ({sources.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sources.map((src, i) => (
          <div 
            key={i} 
            className="px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 text-xs font-mono">#{i + 1}</span>
              <span className="text-blue-600 hover:text-blue-800 font-medium truncate">
                📄 {src}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}