import { useRouter } from "next/dist/client/router";
import { useContext } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiRefreshLine } from "react-icons/ri";
import NotasContext from "@store/notas-context";

const Header: React.FC = () => {
  const notasCtx = useContext(NotasContext);
  const router = useRouter();

  const refreshNotasHandler = () => {
    router.push("/");
    notasCtx.reloadNotas(true);
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <header className="shadow-2xl w-full p-4 bg-black flex justify-between">
      <div
        className="text-green-500 text-2xl flex items-center space-x-2 cursor-pointer"
        onClick={goToHome}
      >
        <FaMoneyBillWave className="text-3xl" />
        <p className="font-bold">Gimbo</p>
      </div>
      <RiRefreshLine
        onClick={refreshNotasHandler}
        className="text-white text-3xl cursor-pointer"
      />
    </header>
  );
};

export default Header;
