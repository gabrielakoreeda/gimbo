import TableAtivo from "@components/table/TableAtivo";
import TableAtivoPersonalizado from "@components/table/TableAtivoPersonalizado";
import Button from "@components/ui/Button";
import PageTitle from "@components/ui/PageTitle";
import NotasContext from "@store/notas-context";
import { FaDownload } from "react-icons/fa";
import { NextPage } from "next";
import { useContext, useRef, useState } from "react";

const Notas: NextPage = () => {
  const notaCtx = useContext(NotasContext);
  const notas = notaCtx.notas;
  const downloadRef = useRef<HTMLAnchorElement>();
  const [notasType, setNotasType] = useState("importadas");

  const toggleNotasType = () => {
    setNotasType((prev) =>
      prev === "importadas" ? "personalizadas" : "importadas"
    );
  };

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
      <div className="flex mb-4">
        <p
          className={`border-b-2 pb-2 px-2 ${
            notasType === "importadas"
              ? "border-green-600 text-green-600"
              : "border-gray-300 cursor-pointer"
          }`}
          onClick={toggleNotasType}
        >
          Notas importadas
        </p>
        <p
          className={`border-b-2 pb-2 px-2 ${
            notasType === "personalizadas"
              ? "border-green-600 text-green-600"
              : "border-gray-300 cursor-pointer"
          }`}
          onClick={toggleNotasType}
        >
          Notas personalizadas
        </p>
        <span className="flex-grow border-b-2 border-gray-300"></span>
      </div>
      {notasType === "importadas" && <TableAtivo notas={notas} />}
      {notasType === "personalizadas" && (
        <TableAtivoPersonalizado notas={notas} />
      )}
    </div>
  );
};

export default Notas;
