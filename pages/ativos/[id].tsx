import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import TableAtivo from "@components/table/TableAtivo";
import NewOperationForm from "@components/forms/NewOperationForm";
import NotasContext from "@store/notas-context";
import ErrorMessagePopUp from "@components/ui/ErrorMessagePopUp";
import EditTickerForm from "@components/forms/EditTickerForm";

const Ativo = () => {
  const notaCtx = useContext(NotasContext);
  const notas = notaCtx.currentTicker;
  const getTicker = notaCtx.getTicker;
  const router = useRouter();
  const { id } = router.query;
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    const ativoTicker = id?.toString();
    setTicker(ativoTicker);
    getTicker(ativoTicker);
  }, [getTicker, id]);

  const changeTickerHandler = (ticker, type) => {
    notaCtx.editTicker(id?.toString(), ticker !== id ? ticker : null, type);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-5 mb-4 items-end">
        <EditTickerForm
          ticker={ticker}
          setTicker={setTicker}
          type={type}
          setType={setType}
          saveTicker={changeTickerHandler}
        />
        <NewOperationForm ticker={ticker} setErrorMessages={setErrorMessages} />
      </div>
      <TableAtivo notas={notas} />
      <ErrorMessagePopUp
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
      />
    </div>
  );
};

export default Ativo;
