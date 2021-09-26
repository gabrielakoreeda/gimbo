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

const getInfo = (params) => {
  return instance
    .get("", {
      params,
    })
    .then((response) => {
      return response.data;
    });
};

export { getInfo };
