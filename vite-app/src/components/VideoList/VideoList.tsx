import React from "react";

export default function VideoList() {
  // Dummy data for videos
  const videos = [
    {
      id: 1,
      thumbnailUrl: "https://via.placeholder.com/300x200",
      title: "Video 1",
      description: "Description for Video 1",
      date: "2023-08-07",
    },
    {
      id: 2,
      thumbnailUrl: "https://via.placeholder.com/300x200",
      title: "Video 2",
      description: "Description for Video 2",
      date: "2023-08-08",
    },
    // Add more dummy video data here...
  ];

  return (
    <div className="flex flex-col gap-4">
      {videos.map((video) => (
        <VideoListCard
          key={video.id}
          thumbnailUrl={video.thumbnailUrl}
          title={video.title}
          description={video.description}
          date={video.date}
        />
      ))}
    </div>
  );
}
interface VideoListCardProps {
  thumbnailUrl: string;
  title: string;
  description: string;
  date: string;
}

const VideoListCard: React.FC<VideoListCardProps> = ({
  thumbnailUrl,
  title,
  description,
  date,
}) => {
  return (
    <div className="bg-white shadow rounded p-4 flex">
      <div className="flex-shrink-0 w-[200px]">
        <img src={thumbnailUrl} alt={title} className="w-full h-auto" />
      </div>
      <div className="ml-4 flex-grow">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{description}</p>
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">
          Watch
        </button>
      </div>
      <div className="flex flex-col items-end justify-between">
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
  );
};
