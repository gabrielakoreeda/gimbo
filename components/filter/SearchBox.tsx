import { FaSearch } from "react-icons/fa";
const SearchBox = () => {
  return (
    <span className="flex items-center space-x-2 bg-white">
      <FaSearch className="text-gray-400 ml-2" />
      <input
        className="border-0 w-full"
        type="text"
        placeholder="Buscar por título ou corretora"
      />
    </span>
  );
};

export default SearchBox;
