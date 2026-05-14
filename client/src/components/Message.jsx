import { useState } from "react";

import {
  getSourcePreview,
} from "../api/api";

import SourceModal from "./SourceModal";

export default function Message({
  msg,
}) {

  const isUser =
    msg.type === "user";

  const [selectedSource,
    setSelectedSource] =
    useState(null);

  const handleSourceClick =
    async (src) => {

      try {

        const res =
          await getSourcePreview(
            src.fileName,
            src.pageNumber
          );

        setSelectedSource(
          res.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  return (
    <>

      <div
        className={`flex ${
          isUser
            ? "justify-end"
            : "justify-start"
        } px-2`}
      >

        <div className="max-w-2xl w-full">

          {/* MESSAGE */}
          <div
            className={`
              px-4 py-3 rounded-xl shadow-sm whitespace-pre-wrap leading-relaxed
              ${
                isUser
                  ? "bg-blue-600 text-white ml-auto rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }
            `}
          >
            {msg.text}
          </div>

          {/* SOURCES */}
          {!isUser &&
            msg.sources?.length > 0 && (

            <div className="mt-3 px-2">

              <div className="text-xs text-gray-500 mb-2 font-medium">
                Sources
              </div>

              <div className="flex flex-wrap gap-2">

                {msg.sources.map(
                  (src, i) => (

                    <button
                      key={i}

                      onClick={() =>
                        handleSourceClick(
                          src
                        )
                      }

                      className="
                        text-xs
                        bg-gray-100
                        hover:bg-blue-100
                        hover:text-blue-700
                        px-3
                        py-1
                        rounded-full
                        transition
                      "
                    >
                      📄 {src.fileName}
                      {" "}
                      •
                      {" "}
                      p.{src.pageNumber}
                    </button>
                  )
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL */}
      <SourceModal
        source={selectedSource}
        onClose={() =>
          setSelectedSource(null)
        }
      />

    </>
  );
}