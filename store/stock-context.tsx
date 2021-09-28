import { useEffect, createContext, useCallback, useState } from "react";

const endpoint = "http://localhost:3000/api";

interface StockContextType {
  apiKey: string;
  saveAPIKey: (key: string) => void;
}

const StockContext = createContext<StockContextType>({
  apiKey: "",
  saveAPIKey: () => {},
});

export const StockContextProvider: React.FC = ({ children }) => {
  const [apiKey, setApiKey] = useState("");

  const saveAPIKey = (key) => {
    fetch(`${endpoint}/config`, {
      method: "POST",
      body: JSON.stringify({ key }),
    });
    setApiKey(key);
  };

  const getKey = useCallback(async () => {
    const response = await fetch(`${endpoint}/config`);
    const data = await response.json();
    setApiKey(data.ALPHAVANTAGE_KEY);
  }, []);

  useEffect(() => {
    getKey();
  }, [getKey]);

  const contextValue = {
    saveAPIKey: saveAPIKey,
    apiKey: apiKey,
  };

  return (
    <StockContext.Provider value={contextValue}>
      {children}
    </StockContext.Provider>
  );
};

export default StockContext;
