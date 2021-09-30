import { getInfo } from "adapters/stock-api";
import { readNotas, readTickers, writeFile } from "./wr-notas";

const syncTickers = async () => {
  const notas = readNotas();
  const tickers = readTickers();

  for (var index = 0; index < notas.length; index++) {
    if (tickers[notas[index]["Especificação do título"]]) {
      notas[index].ticker = tickers[notas[index]["Especificação do título"]];
    } else {
      const ticker = await getInfo(notas[index]["Especificação do título"]);
      notas[index].ticker = ticker || notas[index].ticker;
      tickers[notas[index]["Especificação do título"]] = ticker;
    }
  }

  writeFile(JSON.stringify(notas), "notas.json");
  writeFile(JSON.stringify(tickers), "tickers.json");
};

export { syncTickers };
