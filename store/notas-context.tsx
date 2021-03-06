import { groupBy, groupByMonth } from "@utils/query-notas";
import { useRouter } from "next/dist/client/router";
import { useEffect, createContext, useCallback, useState } from "react";

const endpoint = "http://localhost:3000/api/";

interface NotasContextType {
  notas: Nota[];
  notasConsolidadas: NotaConsolidada[];
  ir: {};
  currentTicker: Nota[];
  isLoading: boolean;
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
  ir: {},
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
  const [ir, setIr] = useState({});
  const [currentTicker, setCurrentTicker] = useState<Nota[]>([]);
  const [filterPeriod, setFilterPeriod] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
      const response = await fetch(endpoint + "notas?" + params.toString());
      response.json().then((data) => {
        setNotas(data);
      });
      setIsLoading(false);
    },
    [setNotas, setIsLoading]
  );

  const getTicker = useCallback(
    (slug) => {
      setIsLoading(true);
      const filteredNotas = notas.filter((nota) => nota.slug === slug);
      setCurrentTicker(filteredNotas);
      setIsLoading(false);
    },
    [notas]
  );

  const editTicker = (ticker, newTicker, type) => {
    setIsLoading(true);
    const payload = { ticker, newTicker, type };
    fetch(endpoint + "notas", {
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
    fetch(endpoint + "notas", {
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
  }, [retrieveNotasFile]);

  useEffect(() => {
    const notasConsolidadas = groupBy(notas);
    setNotasConsolidadas(notasConsolidadas);
    setIr(groupByMonth(notas));
  }, [notas]);

  const contextValue = {
    notas: notas,
    notasConsolidadas: notasConsolidadas,
    ir: ir,
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
