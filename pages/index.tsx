import Filter from "@components/Filter";
import TablePosicoes from "@components/table/TablePosicoes";
import NotasContext from "@store/notas-context";
import { NextPage } from "next";
import { useContext } from "react";

const Home: NextPage = () => {
  const notasCtx = useContext(NotasContext);
  const notas = notasCtx.notasConsolidadas;

  return (
    <>
      <Filter />
      <div className="flex flex-col">
        <h2 className="font-bold text-gray-800 mb-2">Posições Abertas</h2>
        <TablePosicoes notas={notas} />
      </div>
    </>
  );
};

export default Home;
