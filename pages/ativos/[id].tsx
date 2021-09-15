import { useRouter } from "next/dist/client/router";
import { useContext, useEffect, useState } from "react";
import TableAtivo from "@components/table/TableAtivo";
import NewOperationForm from "@components/forms/NewOperationForm";
import NotasContext from "@store/notas-context";
import ErrorMessagePopUp from "@components/ui/ErrorMessagePopUp";
import EditTickerForm from "@components/forms/EditTickerForm";
import SelectionTabs from "@components/ui/SelectionTabs";
import TableAtivoPersonalizado from "@components/table/TableAtivoPersonalizado";

const Ativo = () => {
  const notaCtx = useContext(NotasContext);
  const notas = notaCtx.currentTicker;
  const getTicker = notaCtx.getTicker;
  const router = useRouter();
  const { id } = router.query;
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [notasType, setNotasType] = useState("importadas");

  useEffect(() => {
    const ativoTicker = id?.toString();
    setTicker(ativoTicker);
    getTicker(ativoTicker);
  }, [getTicker, id]);

  const changeTickerHandler = (ticker, type) => {
    notaCtx.editTicker(id?.toString(), ticker !== id ? ticker : null, type);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex space-x-5 items-end">
        <EditTickerForm
          ticker={ticker}
          setTicker={setTicker}
          type={type}
          setType={setType}
          saveTicker={changeTickerHandler}
        />
        <NewOperationForm ticker={ticker} setErrorMessages={setErrorMessages} />
      </div>
      <SelectionTabs
        selectedTab={notasType}
        setSelectedTab={setNotasType}
        tabs={[
          { label: "Notas importadas", value: "importadas" },
          { label: "Notas personalizadas", value: "personalizadas" },
        ]}
      />
      {notasType === "importadas" && <TableAtivo notas={notas} />}
      {notasType === "personalizadas" && (
        <TableAtivoPersonalizado notas={notas} />
      )}
      <ErrorMessagePopUp
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
      />
    </div>
  );
};

export default Ativo;
