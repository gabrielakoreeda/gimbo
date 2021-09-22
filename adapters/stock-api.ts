import { getKey } from "@utils/config";
import axios from "axios";
import axiosThrottle from "axios-request-throttle";

const instance = axios.create({
  baseURL: "https://www.alphavantage.co/query",
});

instance.interceptors.request.use((config) => {
  config.params = {
    apikey: getKey()["ALPHAVANTAGE_KEY"],
    ...config.params,
  };
  return config;
});

axiosThrottle.use(instance, { requestsPerSecond: 0.08 });

const getTicker = (search: string) => {
  return instance
    .get("", {
      params: {
        function: "SYMBOL_SEARCH",
        keywords: search,
      },
    })
    .then((response) => {
      return response.data.bestMatches;
    });
};

export { getTicker };
