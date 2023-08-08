import React, { useState } from "react";
import type { VideoData } from "../../../types/video";
import ReactPlayer from "react-player";
import ProgressBar from "../../ProgressBar";

interface VideoPreviewProps {
  isUploading: boolean;
  progress: number;
  errorMessage?: string;
  errorSubtitle?: string;
  videoData: VideoData;
  retryUploadHandler?: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  isUploading,
  progress,
  errorMessage,
  errorSubtitle,
  videoData,
  retryUploadHandler,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const showOverlay = isUploading || errorMessage;

  // Specify different configs based on video being remote or local
  const getVideoConfig = (videoData: VideoData) => {
    if (videoData.remoteVideo) {
      // Config for remote videos
      return {};
    } else {
      // Default config for local videos
      return {
        file: {
          attributes: {
            controlsList: "nodownload", // Disable download option for remote videos
            controls: true,
          },
          forceVideo: true,
        },
      };
    }
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(videoData.shareLink || "")
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((error) => {
        console.error("Error copying link: ", error);
      });
  };

  return (
    <div className="w-full max-w-sm bg-white shadow rounded p-3 flex flex-col items-start">
      <div
        className="relative bg-black/80 mb-3 rounded overflow-hidden w-full"
        style={{ paddingBottom: "56.25%" }}
      >
        <ReactPlayer
          className="absolute inset-0"
          url={videoData.source}
          config={getVideoConfig(videoData)}
          width="100%"
          height="100%"
          controls
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            {errorMessage ? (
              <div
                onClick={retryUploadHandler}
                className="bg-red-500 text-white p-4 rounded cursor-pointer"
              >
                <p className="text-xl font-bold mb-2">{errorMessage}</p>
                {errorSubtitle && <p className="text-sm">{errorSubtitle}</p>}
              </div>
            ) : (
              <ProgressBar progress={progress} />
              // <p className="text-gray-200">Uploading video... {progress}%</p>
            )}
          </div>
        )}
      </div>
      <button
        disabled={!!showOverlay || !videoData.shareLink}
        className="mb-1 text-sm text-blue-600 underline hover:no-underline outline outline-transparent transition-all duration-200 cursor-pointer active:cursor-auto focus:outline-blue-400 focus-within:outline-blue-400 focus:outline-1 disabled:no-underline disabled:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCopyClick}
      >
        {copySuccess ? "Link Copied!" : "Click to copy link to video"}
      </button>
      <p className="w-full max-w-[250px] overflow-hidden whitespace-nowrap text-ellipsis">
        {videoData.name}
      </p>
    </div>
  );
};

export default VideoPreview;
