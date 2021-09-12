import { getKey } from "@utils/config";
import axios from "axios";
import axiosThrottle from "axios-request-throttle";

const instance = axios.create({
  baseURL: "http://api.marketstack.com/v1",
});

instance.interceptors.request.use((config) => {
  config.params = {
    access_key: getKey()["MARKETSTACK_KEY"],
    exchange: "BVMF",
    ...config.params,
  };
  return config;
});

axiosThrottle.use(instance, { requestsPerSecond: 5 });

const getTicker = (search: string) => {
  return instance
    .get("/tickers", {
      params: {
        search,
      },
    })
    .then((response) => {
      let ticker;
      response.data.data.forEach((item) => {
        if (item.name === search) {
          ticker = item.symbol.replace("F.BVMF", ".BVMF");
        }
      });
      return ticker;
    });
};

export { getTicker };
