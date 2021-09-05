import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import TableAtivo from "@components/table/TableAtivo";
import NewOperationForm from "@components/forms/NewOperationForm";
import Button from "@components/ui/Button";
import NotasContext from "@store/notas-context";

const Ativo = () => {
  const notaCtx = useContext(NotasContext);
  const notas = notaCtx.currentTicker;
  const getTicker = notaCtx.getTicker;
  const router = useRouter();
  const { id } = router.query;
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const ativoTicker = id?.toString();
    setTicker(ativoTicker);
    getTicker(ativoTicker);
  }, [getTicker, id]);

  const changeTickerHandler = (e) => {
    e.preventDefault();
    setEdit(false);
    notaCtx.editTicker(id?.toString(), ticker !== id ? ticker : null, type);
  };

  const editTickerHandler = (e) => {
    e.preventDefault();
    setEdit(true);
  };

  return (
    <>
      <div className="flex space-x-5 mb-4 items-end">
        <form
          className="flex flex-col max-w-min border border-gray-400 rounded p-3 shadow-md"
          onSubmit={changeTickerHandler}
        >
          <p className="text-gray-8 font-bold mb-2">Editar informações</p>
          <span className="mb-5">
            <label htmlFor="ticker">Ticker: </label>
            <input
              type="text"
              id="ticker"
              name="ticker"
              value={ticker || ""}
              onChange={(e) => setTicker(e.target.value)}
              disabled={!edit}
            />
          </span>
          <span className="mb-2">
            <label htmlFor="type">Tipo:</label>
            <select
              id="type"
              name="type"
              value={type || ""}
              className="w-full"
              onChange={(e) => setType(e.target.value)}
              disabled={!edit}
            >
              <option value="FII">FII</option>
              <option value="Ação">Ação</option>
            </select>
          </span>
          <span className="w-full text-center">
            {edit ? (
              <Button type="submit">Salvar</Button>
            ) : (
              <Button onClick={editTickerHandler}>Editar</Button>
            )}
          </span>
        </form>
        <NewOperationForm />
      </div>
      <TableAtivo notas={notas} />
    </>
  );
};

export default Ativo;
