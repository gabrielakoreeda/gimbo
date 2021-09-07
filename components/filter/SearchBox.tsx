import { FaSearch } from "react-icons/fa";

const SearchBox: React.FC<{
  searchText: string;
  setSearchText: (searchText: string) => void;
  className?: string;
}> = ({ searchText, setSearchText, className }) => {
  return (
    <div
      className={`flex items-center space-x-2 bg-white border border-transparent focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-300 ${className}`}
    >
      <FaSearch className="text-gray-400 mx-2" />
      <input
        className="border-0 w-full focus:border-0 focus:ring-0"
        type="text"
        placeholder="Buscar por título ou corretora"
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText || ""}
      />
    </div>
  );
};

export default SearchBox;
