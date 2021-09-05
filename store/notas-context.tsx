import { groupBy } from "@utils/query-notas";
import { useRouter } from "next/dist/client/router";
import { useEffect, createContext, useCallback, useState } from "react";

const endpoint = "http://localhost:3000/api/notas?";

interface NotasContextType {
  notasConsolidadas: NotaConsolidada[];
  currentTicker: Nota[];
  isLoading: boolean;
  reloadNotas: (reload: boolean) => void;
  filter: (start: string, end: string) => void;
  getTicker: (ticker: string) => void;
  editTicker: (ticker: string, newTicker: string, type: string) => void;
  addNewOperation: (operation: {
    ticker: string;
    operationType: string;
    quantity: number;
    price: number;
    priceTotal: number;
    date: string;
    corretora: string;
    description: string;
  }) => void;
}

const NotasContext = createContext<NotasContextType>({
  notasConsolidadas: [],
  currentTicker: [],
  isLoading: false,
  reloadNotas: () => {},
  filter: () => {},
  getTicker: () => [],
  editTicker: () => {},
  addNewOperation: () => {},
});

export const NotasContextProvider: React.FC = ({ children }) => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notasConsolidadas, setNotasConsolidadas] = useState<NotaConsolidada[]>(
    []
  );
  const [currentTicker, setCurrentTicker] = useState<Nota[]>([]);
  const [filterPeriod, setFilterPeriod] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const filterHandler = (start, end) => {
    setFilterPeriod([start, end]);
  };

  const retrieveNotasFile = useCallback(
    async (reload) => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (reload) {
        params.append("reload", "true");
      }
      const response = await fetch(endpoint + params.toString());
      response.json().then((data) => {
        setNotas(data);
      });
      setIsLoading(false);
    },
    [setNotas, setIsLoading]
  );

  const getTicker = useCallback(
    (ticker) => {
      setIsLoading(true);
      const filteredNotas = notas.filter((nota) => nota.ticker === ticker);
      setCurrentTicker(filteredNotas);
      setIsLoading(false);
    },
    [notas]
  );

  const editTicker = (ticker, newTicker, type) => {
    setIsLoading(true);
    const payload = { ticker, newTicker, type };
    fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then(() => {
      retrieveNotasFile(false);
      if (newTicker) router.replace(`/ativo/${newTicker}`);
    });
    setIsLoading(false);
  };

  const addNewOperation = (operation) => {
    setIsLoading(true);
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(operation),
    }).then(async (response) => {
      const newOperation = await response.json();
      setNotas((prev) => [...prev, newOperation]);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    retrieveNotasFile(false);
  }, [retrieveNotasFile]);

  useEffect(() => {
    const notasConsolidadas = groupBy(notas);
    setNotasConsolidadas(notasConsolidadas);
  }, [notas]);

  const contextValue = {
    notasConsolidadas: notasConsolidadas,
    currentTicker: currentTicker,
    isLoading: isLoading,
    reloadNotas: retrieveNotasFile,
    filter: filterHandler,
    getTicker: getTicker,
    editTicker: editTicker,
    addNewOperation: addNewOperation,
  };

  return (
    <NotasContext.Provider value={contextValue}>
      {children}
    </NotasContext.Provider>
  );
};

export default NotasContext;
