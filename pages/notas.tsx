import TableAtivo from "@components/table/TableAtivo";
import Button from "@components/ui/Button";
import PageTitle from "@components/ui/PageTitle";
import NotasContext from "@store/notas-context";
import { FaDownload } from "react-icons/fa";
import { NextPage } from "next";
import { useContext, useRef } from "react";

const Notas: NextPage = () => {
  const notaCtx = useContext(NotasContext);
  const notas = notaCtx.notas;
  const downloadRef = useRef<HTMLAnchorElement>();

  const downloadTableHandler = () => {
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(notas[0]);
    const csv = [
      header.join(","), // header row first
      ...notas.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");

    downloadRef.current.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    downloadRef.current.setAttribute("download", "notas.csv");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between">
        <PageTitle title="Notas" />
        <span>
          <a ref={downloadRef}>
            <Button onClick={downloadTableHandler}>
              <FaDownload className="mr-2" />
              Exportar
            </Button>
          </a>
        </span>
      </div>
      <TableAtivo notas={notas} />
    </div>
  );
};

export default Notas;
