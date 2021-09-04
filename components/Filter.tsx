import { useContext, useRef } from "react";
import NotasContext from "@store/notas-context";
import Button from "./ui/Button";

const Filter: React.FC = () => {
  const notasCtx = useContext(NotasContext);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const filterHandler = () => {
    notasCtx.filter(startRef.current.value, endRef.current.value);
  };

  return (
    <div className="space-x-2 w-full flex justify-end items-center">
      <span className="mr-2 font-bold text-gray-800">
        Filtrar por período de
      </span>
      <input
        type="month"
        id="start"
        name="start"
        min="2018-03"
        ref={startRef}
      />
      <p className="font-bold text-gray-800">até</p>
      <input type="month" id="start" name="start" min="2018-03" ref={endRef} />
      <Button onClick={filterHandler}>Buscar</Button>
    </div>
  );
};

export default Filter;
