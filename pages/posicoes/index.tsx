import TablePosicoes from "@components/table/TablePosicoes";
import TablePosicoesFechadas from "@components/table/TablePosicoesFechadas";
import PageTitle from "@components/ui/PageTitle";
import NotasContext from "@store/notas-context";
import { NextPage } from "next";
import { useContext } from "react";

const Posicoes: NextPage = () => {
  const notasCtx = useContext(NotasContext);
  const notas = notasCtx.notasConsolidadas;

  return (
    <div className="flex flex-col h-full">
      <PageTitle title="Posições" />
      <div className="flex overflow-y-auto space-x-4">
        <div className="flex flex-col">
          <h2 className="font-bold text-gray-800 mb-2">Posições Abertas</h2>
          <TablePosicoes notas={notas} />
        </div>
        <div className="flex flex-col col-span-2">
          <h2 className="font-bold text-gray-800 mb-2">Posições Fechadas</h2>
          <TablePosicoesFechadas notas={notas} />
        </div>
      </div>
    </div>
  );
};

export default Posicoes;
