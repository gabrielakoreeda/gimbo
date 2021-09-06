import TableAtivo from "@components/table/TableAtivo";
import PageTitle from "@components/ui/PageTitle";
import NotasContext from "@store/notas-context";
import { NextPage } from "next";
import { useContext } from "react";

const Notas: NextPage = () => {
  const notaCtx = useContext(NotasContext);
  const notas = notaCtx.notas;

  return (
    <div className="flex flex-col h-full">
      <PageTitle title="Notas" />
      <TableAtivo notas={notas} />
    </div>
  );
};

export default Notas;
