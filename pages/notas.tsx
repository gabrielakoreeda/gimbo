import TableAtivo from "@components/table/TableAtivo";
import TableAtivoPersonalizado from "@components/table/TableAtivoPersonalizado";
import Filter from "@components/filter/Filter";
import Button from "@components/ui/Button";
import PageTitle from "@components/ui/PageTitle";
import NotasContext from "@store/notas-context";
import { FaDownload } from "react-icons/fa";
import { NextPage } from "next";
import { useContext, useEffect, useRef, useState } from "react";
import { filterNotas } from "@utils/query-notas";

const Notas: NextPage = () => {
  const notaCtx = useContext(NotasContext);
  const notas = notaCtx.notas;
  const [filteredNotas, setFilteredNotas] = useState<Nota[]>([]);
  const downloadRef = useRef<HTMLAnchorElement>();
  const [notasType, setNotasType] = useState("importadas");
  const [filterInput, setFilterInput] = useState<{
    titulo: string;
    corretora: string;
    startDate: Date;
    endDate: Date;
    operationType: string;
  }>({
    titulo: "",
    corretora: "",
    startDate: null,
    endDate: null,
    operationType: "",
  });

  useEffect(() => {
    setFilteredNotas(notas);
  }, [notas]);

  const onSearchHandler = () => {
    const filtered = filterNotas(
      notas,
      filterInput.startDate,
      filterInput.endDate,
      filterInput.operationType,
      filterInput.titulo,
      filterInput.corretora
    );
    setFilteredNotas(filtered);
  };

  const toggleNotasType = () => {
    setNotasType((prev) =>
      prev === "importadas" ? "personalizadas" : "importadas"
    );
  };

  const downloadTableHandler = () => {
    const replacer = (key, value) => (value === null ? "" : value);
    const header = Object.keys(notas[0]);
    const csv = [
      header.join(","),
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
      <div className="flex">
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
      <Filter
        filterInput={filterInput}
        setFilterInput={setFilterInput}
        onSearch={onSearchHandler}
      />
      {notasType === "importadas" && <TableAtivo notas={filteredNotas} />}
      {notasType === "personalizadas" && (
        <TableAtivoPersonalizado notas={filteredNotas} />
      )}
    </div>
  );
};

export default Notas;
