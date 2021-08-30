import { useEffect } from "react";

const NotasContext = React.createContext({
  notas: [],
  reloadNotas: () => {},
});

export const NotasContextProvider = (props) => {
  const [notas, setNotas] = [];

  const retrieveNotasFile = useCallback(async () => {
    const response = await fetch("http://localhost:3000/api/notas");
    response.json().then((data) => setNotas(data));
  }, [setNotas]);

  useEffect(() => {
    retrieveNotasFile();
  }, [retrieveNotasFile]);

  const contextValue = {
    notas: notas,
    reloadNotas: retrieveNotasFile,
  };

  return (
    <NotasContext.Provider value={contextValue}>
      {props.children}
    </NotasContext.Provider>
  );
};
