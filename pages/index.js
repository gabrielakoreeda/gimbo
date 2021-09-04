import Filter from "@components/Filter";
import TablePosicoes from "@components/table/TablePosicoes";
import NotasContext from "@store/notas-context";
import { useContext } from "react";

export default function Home() {
  const notasCtx = useContext(NotasContext);
  const notas = notasCtx.notas;

  return (
    <>
      <Filter />
      <div className="flex flex-col">
        <h2 className="font-bold text-gray-800 mb-2">Posições Abertas</h2>
        <TablePosicoes data={notas} />
      </div>
    </>
  );
}
