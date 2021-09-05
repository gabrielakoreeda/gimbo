import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import TableAtivo from "@components/table/TableAtivo";
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
  const [newOperation, setNewOperation] = useState<{
    ticker: string;
    operationType: string;
    quantity: number;
    price: number;
    priceTotal: number;
    date: string;
    corretora: string;
    description: string;
  }>({
    ticker: "",
    operationType: "",
    quantity: 0,
    price: 0,
    priceTotal: 0,
    date: "",
    corretora: "",
    description: "",
  });

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

  const addNewOperationHandler = (e) => {
    e.preventDefault();
    notaCtx.addNewOperation(newOperation);
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
          onSubmit={addNewOperationHandler}
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
                onChange={(e) =>
                  setNewOperation((prev) => {
                    return { ...prev, operationType: e.target.value };
                  })
                }
                disabled={!edit}
              >
                <option value="C">C</option>
                <option value="V">V</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="quantity">Quantidade: </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="0"
                onChange={(e) =>
                  setNewOperation((prev) => {
                    return { ...prev, quantity: parseFloat(e.target.value) };
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="price">Preço (R$): </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                onChange={(e) =>
                  setNewOperation((prev) => {
                    return { ...prev, price: parseFloat(e.target.value) };
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="priceTotal">Valor operação (R$): </label>
              <input
                type="number"
                id="priceTotal"
                name="priceTotal"
                min="0"
                onChange={(e) =>
                  setNewOperation((prev) => {
                    return { ...prev, priceTotal: parseFloat(e.target.value) };
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="date">Data pregão:</label>
              <input
                type="date"
                id="date"
                name="date"
                onChange={(e) =>
                  setNewOperation((prev) => {
                    return { ...prev, date: e.target.value };
                  })
                }
              />
            </div>
            <div className="flex flex-col col-span-2">
              <label htmlFor="corretora">Corretora: </label>
              <input
                type="text"
                id="corretora"
                name="corretora"
                onChange={(e) =>
                  setNewOperation((prev) => {
                    return { ...prev, corretora: e.target.value };
                  })
                }
              />
            </div>
            <div className="flex flex-col col-span-3">
              <label htmlFor="description">Descrição: </label>
              <textarea
                id="description"
                name="description"
                rows={1}
                onChange={(e) =>
                  setNewOperation((prev) => {
                    return { ...prev, description: e.target.value };
                  })
                }
              />
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
