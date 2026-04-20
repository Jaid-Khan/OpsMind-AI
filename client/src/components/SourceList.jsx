// src/components/SourceList.jsx
export default function SourceList({ sources }) {
  if (!sources.length) return null;

  return (
    <div className="bg-white p-3 mt-2 rounded shadow">
      <h3 className="font-semibold text-sm mb-2">Sources:</h3>
      <ul className="text-sm text-blue-600">
        {sources.map((src, i) => (
          <li key={i}>📄 {src}</li>
        ))}
      </ul>
    </div>
  );
}