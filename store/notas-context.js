import { useRouter } from "next/dist/client/router";
import { useEffect, createContext, useCallback, useState } from "react";

const endpoint = "http://localhost:3000/api/notas?";

const NotasContext = createContext({
  notas: [],
  isLoading: false,
  reloadNotas: () => {},
  filter: (start, end) => {},
  getTicker: (ticker) => {},
  editTicker: (ticker, newTicker, type) => {},
});

export const NotasContextProvider = (props) => {
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
      const params = {};
      if (reload) {
        params.reload = true;
      }
      if (filterPeriod.length === 2) {
        params.startDate = filterPeriod[0];
        params.endDate = filterPeriod[1];
      }
      const response = await fetch(endpoint + new URLSearchParams(params));
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

  const editTicker = ({ ticker, newTicker, type }) => {
    setIsLoading(true);
    const payload = { ticker, newTicker, type };
    fetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(payload),
    }).then(() => {
      retrieveNotasFile();
      if (newTicker) router.replace(`/ativo/${newTicker}`);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    retrieveNotasFile();
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
      {props.children}
    </NotasContext.Provider>
  );
};

export default NotasContext;
