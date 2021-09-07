import { FaCalendar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateFilter: React.FC<{
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}> = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <div className="flex items-center space-x-2 bg-white border border-transparent focus-within:border-green-300 focus-within:ring-green-300 focus-within:ring-1">
      <FaCalendar className="text-gray-400 mx-2" />
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setStartDate(update[0]);
          setEndDate(update[1]);
        }}
        isClearable={true}
        placeholderText="Data pregão"
        className="border-0 focus-within:ring-0"
      />
    </div>
  );
};

export default DateFilter;
