import { useEffect, useRef, useState } from "react";
import { VideoData } from "../../../types/video";
import VideoPreview from "./VideoPreview";
import { IKCore } from "imagekitio-react";
import clsx from "clsx";

interface VideoUploadFormProps {
  selectedVideoData: File;
  setSelectedVideoData: React.Dispatch<React.SetStateAction<File | null>>;
}

type VideoUploadError = {
  errorMessage?: string;
  errorSubtitle?: string;
};

/* Environment Variables */
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const authenticationEndpoint = import.meta.env.VITE_AUTHENTICATION_ENDPOINT;

export default function VideoUploadForm({
  selectedVideoData,
  setSelectedVideoData,
}: VideoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoData, setVideoData] = useState<VideoData>({
    name: selectedVideoData.name,
    source: "",
    description: "",
    remoteVideo: false,
  });
  const [uploadError, setUploadError] = useState<VideoUploadError>({});
  const [nameError, setNameError] = useState<string | null>(null);

  const xhrRef = useRef<XMLHttpRequest | null>(null); // Create a ref to hold xhr

  const isUploadComplete = !isUploading && uploadProgress === 0;

  // Handle file reading when the selected video changes
  useEffect(() => {
    const handleSelectedVideoChange = () => {
      if (selectedVideoData) {
        const reader = new FileReader();

        reader.onloadend = () => {
          // Once the file is read, create a temporary URL for preview
          const tempVideoSource = reader.result as string;
          setVideoData({
            name: selectedVideoData.name,
            description: "",
            source: tempVideoSource,
            remoteVideo: false,
          });
        };

        reader.onerror = () => {
          setUploadError({
            errorMessage: "Error reading the selected video.",
            errorSubtitle: "Please try again.",
          });
        };

        reader.readAsDataURL(selectedVideoData);
      }
    };

    handleSelectedVideoChange();
  }, [selectedVideoData]);

  // Function to handle the video upload
  const handleUploadVideo = async () => {
    if (!videoData.name.trim()) {
      setNameError("Name is required");
      return;
    }

    // Reset name error if valid
    setNameError(null);

    setIsUploading(true);
    setUploadProgress(0);

    const imagekit = new IKCore({
      publicKey,
      urlEndpoint,
      authenticationEndpoint,
    });

    let customMetadata = {};
    if (videoData.description) {
      customMetadata = {
        ...customMetadata,
        description: videoData.description,
      };
    }

    xhrRef.current = new XMLHttpRequest(); // Assign xhr to ref

    xhrRef.current.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    });

    imagekit.upload(
      {
        file: selectedVideoData,
        fileName: videoData.name,
        customMetadata: JSON.stringify(customMetadata),
        xhr: xhrRef.current,
      },
      function (err, result) {
        setIsUploading(false);
        setUploadProgress(0);

        if (err) {
          setUploadError({
            errorMessage: "Error uploading video",
            errorSubtitle: "Please try again",
          });
        }

        if (result) {
          setUploadError({});
          setVideoData((prev) => ({
            ...prev,
            name: result.name,
            remoteVideo: true,
            shareLink: result.url,
            source: result.url,
          }));
        }
      }
    );
  };

  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort(); // Abort the request using ref
    }

    setIsUploading(false);
    setUploadProgress(0);
    setUploadError({});
  };

  // Event handler for changes in the name field
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;

    if (!name.trim()) {
      setNameError("Name is required");
    } else {
      // Reset name error if valid
      setNameError(null);
    }

    setVideoData((prevVideoData) => ({
      ...prevVideoData,
      name: event.target.value,
    }));
  };

  // Event handler for changes in the description field
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setVideoData((prevVideoData) => ({
      ...prevVideoData,
      description: event.target.value,
    }));
  };

  const handleSelectDifferentVideo = () => {
    // Cancel any pending video upload
    if (isUploading) {
      handleCancelUpload();
    }
    setSelectedVideoData(null);
  };

  return (
    <div className="flex flex-col gap-3 items-start">
      <p
        aria-label="Video title"
        className="text-2xl mb-3 w-full overflow-hidden line-clamp-2 break-words text-ellipsis"
      >
        {videoData.name}
      </p>

      <div className="flex flex-col md:flex-row w-full gap-6">
        <form
          action=""
          className="flex flex-col gap-4"
          aria-label="Video details form"
        >
          <div className="text-xl">Details</div>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Video name"
            value={videoData.name}
            onChange={handleNameChange}
            className={clsx(
              "py-2 px-4 border rounded-md focus:outline-none focus:ring",
              {
                "border-red-500": nameError,
                "border-gray-300 focus:border-blue-500": !nameError,
              }
            )}
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-1">{nameError}</p>
          )}

          <textarea
            name="description"
            id="description"
            cols={30}
            rows={5}
            placeholder="Description"
            value={videoData.description}
            onChange={handleDescriptionChange}
            className="py-2 px-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:border-blue-500"
          ></textarea>
        </form>
        <VideoPreview
          isUploading={isUploading}
          progress={uploadProgress}
          errorMessage={uploadError.errorMessage}
          errorSubtitle={uploadError.errorSubtitle}
          videoData={videoData}
          retryUploadHandler={handleUploadVideo}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Upload video"
          className={clsx("text-white px-4 py-2 rounded-md font-bold", {
            "bg-blue-500": isUploadComplete && !nameError,
            "bg-gray-300 cursor-not-allowed": !isUploadComplete || nameError,
          })}
          type="button"
          disabled={!isUploadComplete || !!nameError}
          onClick={handleUploadVideo}
        >
          Upload video
        </button>

        {!isUploadComplete && (
          <button
            aria-label="Cancel upload"
            className="bg-red-500 text-white px-2 py-2 rounded-md font-bold"
            type="button"
            onClick={handleCancelUpload}
          >
            Cancel
          </button>
        )}
        <button
          aria-label="Select a different video"
          className="bg-yellow-500 text-white px-2 py-2 rounded-md font-bold"
          type="button"
          onClick={handleSelectDifferentVideo}
        >
          Select a Different Video
        </button>
      </div>
    </div>
  );
}
