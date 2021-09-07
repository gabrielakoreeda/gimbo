import { FaMoneyBillWaveAlt } from "react-icons/fa";

const OperationTypeFilter: React.FC<{
  operationType: string;
  setOperationType: (operationType: string) => void;
  className?: string;
}> = ({ operationType, setOperationType, className }) => {
  return (
    <div
      className={`flex items-center w-full space-x-2 bg-white border border-transparent focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-300 ${className}`}
    >
      <FaMoneyBillWaveAlt className="text-gray-400 mx-2" />
      <select
        name="cars"
        id="cars"
        className={`border-0 w-full focus:border-0 focus:ring-0 ${
          operationType === "" ? "text-gray-500" : "text-black"
        }`}
        placeholder="C/V"
        value={operationType || ""}
        onChange={(e) => setOperationType(e.target.value)}
      >
        <option value="">Tipo de operação</option>
        <option value="C">C</option>
        <option value="V">V</option>
      </select>
    </div>
  );
};

export default OperationTypeFilter;
