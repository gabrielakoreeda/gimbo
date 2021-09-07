import { Dispatch, SetStateAction } from "react";
import DateFilter from "./DateFilter";
import SearchBox from "./SearchBox";
import OperationTypeFilter from "./OperationTypeFilter";
import Button from "../ui/Button";

interface FilterInput {
  searchText: string;
  startDate: Date;
  endDate: Date;
  operationType: string;
}

const Filter: React.FC<{
  filterInput: FilterInput;
  setFilterInput: Dispatch<SetStateAction<FilterInput>>;
  onSearch: () => void;
}> = ({ filterInput, setFilterInput, onSearch }) => {
  return (
    <div className="grid grid-flow-col grid-cols-8 my-5 gap-1">
      <SearchBox
        searchText={filterInput.searchText}
        setSearchText={(searchText: string) => {
          setFilterInput((prev) => {
            return { ...prev, searchText: searchText };
          });
        }}
        className="col-span-3"
      />
      <OperationTypeFilter
        className="col-span-2"
        operationType={filterInput.operationType}
        setOperationType={(operationType: string) => {
          setFilterInput((prev) => {
            return { ...prev, operationType: operationType };
          });
        }}
      />
      <DateFilter
        className="col-span-2"
        startDate={filterInput.startDate}
        setStartDate={(date: Date) => {
          setFilterInput((prev) => {
            return { ...prev, startDate: date };
          });
        }}
        endDate={filterInput.endDate}
        setEndDate={(date: Date) => {
          setFilterInput((prev) => {
            return { ...prev, endDate: date };
          });
        }}
      />
      <Button onClick={onSearch}>Buscar</Button>
    </div>
  );
};

export default Filter;
