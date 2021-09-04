import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import TableAtivo from "@components/table/TableAtivo";
import Button from "@components/ui/Button";
import NotasContext from "@store/notas-context";

const Ativo = () => {
  const [notas, setNotas] = useState([]);
  const notaCtx = useContext(NotasContext);
  const getTicker = notaCtx.getTicker;
  const router = useRouter();
  const { id } = router.query;
  const ativoTicker = id.toString();
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const getDetails = async () => {
      getTicker(ativoTicker).then((data) => {
        setNotas(data);
        setType(data[0]?.tipo);
        setTicker(ativoTicker);
      });
    };

    getDetails();
  }, [getTicker, ativoTicker]);

  const changeTickerHandler = (e) => {
    e.preventDefault();
    setEdit(false);
    notaCtx.editTicker(ativoTicker, ticker !== id ? ticker : null, type);
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
        <form
          className="flex flex-col space-y-2 w-full relative border border-gray-400 rounded p-3 shadow"
          onSubmit={changeTickerHandler}
        >
          <p className="text-gray-8 font-bold">
            Adicionar operação personalizada
          </p>
          <div className="grid grid-cols-5 gap-5">
            <div>
              <label htmlFor="operationType">C/V:</label>
              <select
                id="operationType"
                name="operationType"
                className="w-full"
                onChange={(e) => setType(e.target.value)}
                disabled={!edit}
              >
                <option value="C">C</option>
                <option value="V">V</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="quantity">Quantidade: </label>
              <input type="number" id="quantity" name="quantity" min="0" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="price">Preço (R$): </label>
              <input type="number" id="price" name="price" min="0" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="price">Valor operação (R$): </label>
              <input type="number" id="price" name="price" min="0" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="date">Data pregão:</label>
              <input type="date" id="type" name="date" />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="corretora">Corretora: </label>
              <input type="text" id="corretora" name="corretora" />
            </div>
            <div className="flex flex-col col-span-3">
              <label htmlFor="description">Descrição: </label>
              <textarea id="description" name="description" rows={1} />
            </div>
          </div>
          <span className="w-full text-center">
            <Button type="submit">Adicionar</Button>
          </span>
        </form>
      </div>
      <TableAtivo notas={notas} />
    </>
  );
};

export default Ativo;
