export default function SourceModal({
  source,
  onClose,
}) {
  if (!source) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div>
            <h2 className="font-bold text-lg text-gray-800">
              📄 Source Preview
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {source.fileName} • Page {source.pageNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">

          <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
            {source.chunkText}
          </div>

        </div>

      </div>
    </div>
  );
}