import { useEffect, createContext, useCallback, useState } from "react";

const NotasContext = createContext({
  notas: [],
  isLoading: false,
  reloadNotas: () => {},
  filter: (start, end) => {},
});

export const NotasContextProvider = (props) => {
  const [notas, setNotas] = useState([]);
  const [filterPeriod, setFilterPeriod] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filterHandler = (start, end) => {
    setFilterPeriod([start, end]);
  };

  const retrieveNotasFile = useCallback(
    async (reload) => {
      setIsLoading(true);
      let endpoint = "http://localhost:3000/api/notas?";
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

  useEffect(() => {
    retrieveNotasFile();
  }, [retrieveNotasFile]);

  const contextValue = {
    notas: notas,
    isLoading: isLoading,
    reloadNotas: retrieveNotasFile,
    filter: filterHandler,
  };

  return (
    <NotasContext.Provider value={contextValue}>
      {props.children}
    </NotasContext.Provider>
  );
};

export default NotasContext;
