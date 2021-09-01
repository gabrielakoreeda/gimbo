import { useContext, useEffect, useRef } from "react";
import NotasContext from "../store/notas-context";
import Button from "./ui/Button";

const Filter = () => {
  const notasCtx = useContext(NotasContext);
  const startRef = useRef();
  const endRef = useRef();

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
        className="rounded p-1"
        ref={startRef}
      />
      <p className="font-bold text-gray-800">até</p>
      <input
        type="month"
        id="start"
        name="start"
        min="2018-03"
        className="rounded p-1"
        ref={endRef}
      />
      <Button onClick={filterHandler}>Buscar</Button>
    </div>
  );
};

export default Filter;
