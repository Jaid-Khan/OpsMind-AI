export default function SourceList({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 bg-white rounded-lg shadow-md overflow-hidden">

      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">
          Source Documents ({sources.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-100">

        {sources.map((src, i) => (
          <div key={i} className="px-4 py-2 text-sm flex items-center gap-2">

            <span className="text-gray-400 text-xs font-mono">
              #{i + 1}
            </span>

            {/* ✅ FIX IS HERE */}
            <span className="text-blue-600 font-medium">
              📄 {src.fileName} — Page {src.pageNumber}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}