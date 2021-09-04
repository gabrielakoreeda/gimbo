import { useRouter } from "next/dist/client/router";
import { useEffect, createContext, useCallback, useState } from "react";

const endpoint = "http://localhost:3000/api/notas?";

interface NotasContextType {
  notas: NotaConsolidada[];
  isLoading: boolean;
  reloadNotas: (reload: boolean) => void;
  filter: (start: string, end: string) => void;
  getTicker: (ticker: string) => Promise<Nota[]>;
  editTicker: (ticker: string, newTicker: string, type: string) => void;
}

const NotasContext = createContext<NotasContextType>({
  notas: [],
  isLoading: false,
  reloadNotas: () => {},
  filter: () => {},
  getTicker: async () => [],
  editTicker: () => {},
});

export const NotasContextProvider: React.FC = ({ children }) => {
  const [notas, setNotas] = useState([]);
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
      if (filterPeriod.length === 2) {
        params.append("startDate", filterPeriod[0]);
        params.append("endDate", filterPeriod[1]);
      }
      const response = await fetch(endpoint + params.toString());
      response.json().then((data) => {
        setNotas(data);
      });
      setIsLoading(false);
    },
    [setNotas, setIsLoading, filterPeriod]
  );

  const getTicker = useCallback(async (ticker) => {
    setIsLoading(true);
    const params = { ticker };
    const response = await fetch(endpoint + new URLSearchParams(params));
    const nota = await response.json();
    setIsLoading(false);
    return nota;
  }, []);

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

  useEffect(() => {
    retrieveNotasFile(false);
  }, [retrieveNotasFile]);

  const contextValue = {
    notas: notas,
    isLoading: isLoading,
    reloadNotas: retrieveNotasFile,
    filter: filterHandler,
    getTicker: getTicker,
    editTicker: editTicker,
  };

  return (
    <NotasContext.Provider value={contextValue}>
      {children}
    </NotasContext.Provider>
  );
};

export default NotasContext;
