import { Dispatch, SetStateAction } from "react";

const SelectionTabs: React.FC<{
  tabs: Array<{ label: string; value: string }>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
}> = ({ tabs, selectedTab, setSelectedTab }) => {
  const toggleSelected = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex">
      {tabs.map((tab) => {
        return (
          <p
            key={tab.value}
            className={`border-b-2 pb-2 px-2 ${
              selectedTab === tab.value
                ? "border-green-600 text-green-600"
                : "border-gray-300 cursor-pointer"
            }`}
            onClick={() => toggleSelected(tab.value)}
          >
            {tab.label}
          </p>
        );
      })}
      <span className="flex-grow border-b-2 border-gray-300"></span>
    </div>
  );
};

export default SelectionTabs;
