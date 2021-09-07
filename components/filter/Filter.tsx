import { Dispatch, SetStateAction } from "react";
import DateFilter from "./DateFilter";
import SearchBox from "./SearchBox";
import OperationTypeFilter from "./OperationTypeFilter";
import Button from "../ui/Button";

interface FilterInput {
  titulo: string;
  corretora: string;
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
    <div className="grid grid-flow-col grid-cols-9 my-5 gap-1">
      <SearchBox
        placeholder="Buscar título"
        searchText={filterInput.titulo}
        setSearchText={(titulo: string) => {
          setFilterInput((prev) => {
            return { ...prev, titulo: titulo };
          });
        }}
        className="col-span-2 rounded-l"
      />
      <SearchBox
        placeholder="Buscar corretora"
        searchText={filterInput.corretora}
        setSearchText={(corretora: string) => {
          setFilterInput((prev) => {
            return { ...prev, corretora: corretora };
          });
        }}
        className="col-span-2"
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
