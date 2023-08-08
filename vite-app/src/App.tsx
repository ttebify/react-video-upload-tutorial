import HorizontalTab from "./components/HorizontalTab";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import VideoList from "./components/VideoList/VideoList";
import DragAndDropZone from "./components/DragAndDropZone";

function App() {
  const tabButtonOptions = [
    {
      name: "Create",
      onTabShow: () => console.log("Tab 1 shown"),
      tab: "uploadVideo",
    },
    {
      name: "Your creations",
      onTabShow: () => console.log("Tab 2 shown"),
      tab: "videoList",
    },
  ];

  const tabs = {
    uploadVideo: DragAndDropZone,
    videoList: VideoList,
  };

  return (
    <Layout>
      <Profile />
      <HorizontalTab buttonOptions={tabButtonOptions} tabs={tabs} />
    </Layout>
  );
}

export default App;
