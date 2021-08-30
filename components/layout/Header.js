import { FaMoneyBillWave } from "react-icons/fa";

const Header = () => {
  return (
    <header className="shadow-2xl w-full p-4 bg-black">
      <div className="text-green-500 text-2xl flex items-center space-x-2">
        <FaMoneyBillWave className="text-3xl" />
        <p className="font-bold">Gimbo</p>
      </div>
    </header>
  );
};

export default Header;
