const SelectionTabs: React.FC<{
  tabs: Array<{ label: string; value: string }>;
  selectedTab: string;
  toggleSelected: () => void;
}> = ({ tabs, selectedTab, toggleSelected }) => {
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
            onClick={toggleSelected}
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
