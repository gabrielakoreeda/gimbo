import Button from "@components/ui/Button";
import { Dispatch, SetStateAction, useState } from "react";

const EditTickerForm: React.FC<{
  ticker: string;
  setTicker: Dispatch<SetStateAction<string>>;
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  saveTicker: (ticker: string, type: string) => void;
}> = ({ ticker, setTicker, type, setType, saveTicker }) => {
  const [edit, setEdit] = useState(false);

  const changeTickerHandler = (e) => {
    e.preventDefault();
    setEdit(false);
    saveTicker(ticker, type);
  };

  const editTickerHandler = (e) => {
    e.preventDefault();
    setEdit(true);
  };

  return (
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
  );
};

export default EditTickerForm;
