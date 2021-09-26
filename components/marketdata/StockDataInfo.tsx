import Button from "@components/ui/Button";
import { useState } from "react";
import { FaSearchDollar } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import Candlestick from "@components/marketdata/Candlestick";

const StockDataInfo: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ticker, setTicker] = useState<string>("");
  const [tickerTimeSeries, setTickerTimeSeries] = useState([]);

  const searchTickerHandler = async () => {
    resetTicker();
    setIsLoading(true);
    const response = await fetch(
      "http://localhost:3000/api/tickers?func=SYMBOL_SEARCH&keywords=" +
        searchText
    );
    const results = await response.json();
    setSearchResults(results.bestMatches);
    if (results.bestMatches.length === 0) setNoResults(true);
    setIsLoading(false);
  };

  const selectTickerHandler = async (symbol: string) => {
    setTicker(symbol);
    setIsLoading(true);
    const responseTimeSeries = await fetch(
      "http://localhost:3000/api/tickers?func=TIME_SERIES_DAILY_ADJUSTED&symbol=" +
        symbol
    );
    const resultsTimeSeries = await responseTimeSeries.json();
    const transformedSeries = Object.keys(
      resultsTimeSeries["Time Series (Daily)"]
    ).map((date) => {
      const [year, month, day] = date.split("-");
      return {
        x: `${day}/${month}`,
        y: [
          parseFloat(resultsTimeSeries["Time Series (Daily)"][date]["1. open"]),
          parseFloat(resultsTimeSeries["Time Series (Daily)"][date]["2. high"]),
          parseFloat(resultsTimeSeries["Time Series (Daily)"][date]["3. low"]),
          parseFloat(
            resultsTimeSeries["Time Series (Daily)"][date]["4. close"]
          ),
        ],
      };
    });
    setTickerTimeSeries([
      {
        name: "candle",
        data: transformedSeries.reverse(),
      },
    ]);
    setIsLoading(false);
  };

  const resetTicker = () => {
    setTicker(null);
    setSearchResults([]);
    setTickerTimeSeries(null);
  };

  return (
    <div className="bg-white rounded p-2 pb-0 overflow-hidden flex-grow flex flex-col">
      {!ticker && (
        <>
          <span className="flex items-center space-x-3 mb-2">
            <input
              type="text"
              className="w-full"
              placeholder="Buscar ticker"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
            <Button onClick={searchTickerHandler}>Buscar</Button>
          </span>
          <div className="overflow-scroll h-5/6">
            {!noResults && !isLoading && searchResults.length === 0 && (
              <FaSearchDollar className="m-auto my-5 text-7xl text-gray-600 h-full" />
            )}
            {searchResults.map((res, index) => {
              return (
                <span
                  onClick={() => selectTickerHandler(res["1. symbol"])}
                  className={`flex items-center justify-between m-1 p-1 rounded cursor-pointer hover:shadow transition-all ${
                    index % 2 === 0 ? "bg-gray-200" : ""
                  }`}
                  key={res["1. symbol"]}
                >
                  <p>{res["1. symbol"]}</p>
                  <span className="text-right">
                    <p className="text-xs">{res["2. name"]}</p>
                    <p className="text-xs">{res["4. region"]}</p>
                  </span>
                </span>
              );
            })}
            {noResults && (
              <p className="text-center">
                Nenhum resultado encontrado para a busca: {searchText}
              </p>
            )}
            {isLoading && (
              <VscLoading className="animate-spin m-auto my-5 text-7xl text-gray-600 h-full" />
            )}
          </div>
        </>
      )}
      {ticker && (
        <>
          <span className="flex items-center space-x-3 mb-2">
            <input
              type="text"
              className="w-full"
              placeholder="Buscar ticker"
              value={ticker}
              disabled
            />
            <Button onClick={resetTicker}>Editar</Button>
          </span>
          <div className="h-full">
            {tickerTimeSeries &&
              Object.keys(tickerTimeSeries).length > 0 &&
              !isLoading && (
                <>
                  <Candlestick tickerTimeSeries={tickerTimeSeries} />
                </>
              )}
            {isLoading && (
              <VscLoading className="animate-spin m-auto my-5 text-7xl text-gray-600 h-full" />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StockDataInfo;
