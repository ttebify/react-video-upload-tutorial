import { useCallback, useEffect, useState } from "react";
import addFileSvg from "../assets/images/add-files.svg";
import VideoUploadForm from "./forms/VideoUpload/VideoUploadForm";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";

const maxFileSize = 25 * 1024 * 1024; // 25MB in bytes

export default function DragAndDropZone() {
  const [selectedVideoData, setSelectedVideoData] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    // You can handle other properties like file size, file type, etc. if needed

    if (file) {
      // Pass the selected video data to the VideoUploadForm
      setSelectedVideoData(file);
    }
  }, []);

  // Example of validation
  function customValidator(file: File) {
    const errors = [];

    if (file.size > maxFileSize) {
      errors.push({
        code: "file-size-exceeded",
        message: "File size exceeds the limit of 25MB",
      });
    }

    return errors.length ? errors : null;
  }

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4"] },
    multiple: false,
    validator: customValidator,
  });

  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.forEach(({ errors }) => {
        errors.forEach((e) => {
          toast.error("Failed to upload file", {
            description: e.message,
          });
        });
      });
    }
  }, [fileRejections]);

  return (
    <div className="bg-gray-100 rounded-xl p-6 md:p-10 border border-gray-400 shadow-md transition-colors">
      {selectedVideoData === null ? (
        <div className="text-center cursor-pointer" {...getRootProps()}>
          <input {...getInputProps()} className="hidden" />
          <img
            src={addFileSvg}
            className="w-40 h-40 mx-auto mb-4"
            alt="Upload Icon"
          />
          <p className="text-base font-medium text-gray-900 mb-2">
            Drag and drop video files to upload
          </p>
          <p className="text-gray-500 text-sm">
            Your videos will be private until you publish them.
          </p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold mt-4">
            Select Files
          </button>
        </div>
      ) : (
        <VideoUploadForm
          selectedVideoData={selectedVideoData}
          setSelectedVideoData={setSelectedVideoData}
        />
      )}
      <Toaster richColors closeButton />
    </div>
  );
}
