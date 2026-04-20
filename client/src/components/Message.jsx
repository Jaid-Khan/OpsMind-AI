// src/components/Message.jsx
export default function Message({ msg }) {
  return (
    <div className={`p-3 rounded max-w-xl ${
      msg.type === "user"
        ? "bg-blue-500 text-white self-end ml-auto"
        : "bg-white"
    }`}>
      {msg.text}
    </div>
  );
}