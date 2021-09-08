import { groupBy } from "@utils/query-notas";
import { useRouter } from "next/dist/client/router";
import { useEffect, createContext, useCallback, useState } from "react";

const endpoint = "http://localhost:3000/api/notas?";

interface NotasContextType {
  notas: Nota[];
  notasConsolidadas: NotaConsolidada[];
  currentTicker: Nota[];
  isLoading: boolean;
  apiKey: string;
  saveAPIKey: (key: string) => void;
  reloadNotas: (reload: string) => void;
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
  notas: [],
  notasConsolidadas: [],
  currentTicker: [],
  isLoading: false,
  apiKey: "",
  saveAPIKey: () => {},
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
  const [apiKey, setApiKey] = useState("");
  const router = useRouter();

  const saveAPIKey = (key) => {
    fetch("http://localhost:3000/api/config", {
      method: "POST",
      body: JSON.stringify({ key }),
    });
    setApiKey(key);
  };

  const getKey = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/config");
    const data = await response.json();
    setApiKey(data.MARKETSTACK_KEY);
  }, []);

  const filterHandler = (start, end) => {
    setFilterPeriod([start, end]);
  };

  const retrieveNotasFile = useCallback(
    async (param?) => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (param) {
        params.append(param, "true");
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
      retrieveNotasFile();
      if (newTicker) router.replace(`/ativos/${newTicker}`);
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
    retrieveNotasFile();
    getKey();
  }, [retrieveNotasFile, getKey]);

  useEffect(() => {
    const notasConsolidadas = groupBy(notas);
    setNotasConsolidadas(notasConsolidadas);
  }, [notas]);

  const contextValue = {
    notas: notas,
    notasConsolidadas: notasConsolidadas,
    currentTicker: currentTicker,
    isLoading: isLoading,
    saveAPIKey: saveAPIKey,
    apiKey: apiKey,
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
