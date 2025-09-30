import { Upload, X } from "lucide-react";
import React, { useState } from "react";
import { StandardCard } from "@/components/StandardCard.tsx";

interface ImageLoaderProps {
  image: string | null;
  handleImageUpload: (file: File) => void;
  handleClearImage: () => void;
}

const ImageLoader = ({
  image,
  handleImageUpload,
  handleClearImage,
}: ImageLoaderProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  return (
    <>
      {!image ? (
        <div
          className={`mb-8 relative border-3 border-dashed rounded-2xl p-16 text-center transition-all bg-white dark:bg-slate-800 ${
            dragActive
              ? "border-indigo-500 bg-opacity-50"
              : "border-slate-300 dark:border-slate-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload
            className={`w-16 h-16 mx-auto mb-4 text-slate-600 dark:text-slate-400`}
          />
          <h3
            className={`text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2`}
          >
            Drop your image here
          </h3>
          <p className={`text-slate-600 dark:text-slate-400 mb-6`}>
            or click to browse
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            Choose File
          </label>
        </div>
      ) : (
        <StandardCard
          additionalClasses={`flex justify-center relative mb-8 overflow-hidden p-4`}
        >
          <button
            onClick={handleClearImage}
            className={`absolute top-6 right-6 z-10 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:opacity-80 transition-opacity`}
          >
            <X className={`w-5 h-5 text-slate-600 dark:text-slate-400`} />
          </button>
          <img
            src={image}
            alt="Uploaded"
            className="w-auto h-auto align-self justify-self rounded-lg"
          />
        </StandardCard>
      )}
    </>
  );
};

export default ImageLoader;
