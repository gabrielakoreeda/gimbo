import NotasContext from "@store/notas-context";
import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import TableIR from "@components/table/TableIR";
import Button from "@components/ui/Button";

const IR: NextPage = () => {
  const notasCtx = useContext(NotasContext);
  const ir = notasCtx.ir;
  const [referenceYear, setReferenceYear] = useState<string>();
  const [notasPorMes, setNotasPorMes] = useState({});
  const [selectedNotas, setSelectedNotas] = useState({});

  useEffect(() => {
    setNotasPorMes(ir);
    const currentYear = new Date().getFullYear().toString();
    setReferenceYear(currentYear);
    setSelectedNotas(ir[currentYear]);
  }, [ir]);

  const selectYearHandler = () => {
    setSelectedNotas(notasPorMes[referenceYear]);
  };

  return (
    <>
      <div className="space-y-4">
        <span className="space-x-2 flex items-center">
          <label htmlFor="referenceYear">Ano de referĂȘncia:</label>
          <input
            id="referenceYear"
            className="w-1/12"
            type="number"
            min="2000"
            step="1"
            value={referenceYear || new Date().getFullYear()}
            onChange={(e) => setReferenceYear(e.target.value)}
          />
          <Button onClick={selectYearHandler}>Selecionar</Button>
        </span>
        <TableIR notas={selectedNotas || {}} />
      </div>
    </>
  );
};

export default IR;
