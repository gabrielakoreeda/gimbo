import { useEffect, createContext, useCallback, useState } from "react";

const NotasContext = createContext({
  notas: [],
  isLoading: false,
  reloadNotas: () => {},
});

export const NotasContextProvider = (props) => {
  const [notas, setNotas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const retrieveNotasFile = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:3000/api/notas");
    response.json().then((data) => setNotas(data));
    setIsLoading(false);
  }, [setNotas, setIsLoading]);

  useEffect(() => {
    retrieveNotasFile();
  }, [retrieveNotasFile]);

  const contextValue = {
    notas: notas,
    isLoading: isLoading,
    reloadNotas: retrieveNotasFile,
  };

  return (
    <NotasContext.Provider value={contextValue}>
      {props.children}
    </NotasContext.Provider>
  );
};

export default NotasContext;
