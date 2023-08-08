import React from "react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label={`Progress: ${progress}%`}
      className="relative w-11/12 h-3 bg-gray-200 rounded-md overflow-hidden"
    >
      <div
        className="absolute left-0 top-0 h-full bg-blue-500"
        style={{ width: `${progress}%` }}
      >
        <div className="text-xs absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
