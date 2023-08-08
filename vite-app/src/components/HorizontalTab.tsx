import React, { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import clsx from "clsx";

interface TabConfig {
  name: string;
  onTabShow: () => void;
  tab: string;
}

interface TabList {
  [key: string]: React.ComponentType;
}

interface HorizontalTabProps {
  buttonOptions: TabConfig[];
  tabs: TabList;
}

export default function HorizontalTab({
  buttonOptions,
  tabs,
}: HorizontalTabProps) {
  const [activeTab, setActiveTab] = useState(buttonOptions[0].tab);

  const transitions = useTransition(activeTab, {
    from: { opacity: 0.7 },
    enter: { opacity: 1 },
    leave: { opacity: 0.5 },
    exitBeforeEnter: true,
    config: { duration: 200 },
  });

  const handleTabClick = (tab: string, onClick: () => void) => {
    setActiveTab(tab);
    onClick();
  };

  return (
    <div className="flex flex-col items-center my-8 gap-4 w-full">
      <div className="p-2 shadow rounded-lg bg-white px-4">
        {buttonOptions.map(({ name, onTabShow, tab }) => (
          <button
            key={name}
            className={clsx(
              "px-4 py-2",
              tab === activeTab
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            )}
            onClick={() => handleTabClick(tab, onTabShow)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="w-full max-h-96">
        {transitions((style, tab) => {
          const TabComponent = tabs[tab];
          return (
            <animated.div style={style}>
              <TabComponent />
            </animated.div>
          );
        })}
      </div>
    </div>
  );
}
