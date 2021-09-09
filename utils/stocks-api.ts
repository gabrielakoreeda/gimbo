import { getTicker } from "adapters/stock-api";
import { readNotas } from "./wr-notas";
let fs = require("fs");
const folder = "./notas/";

const syncTickers = async () => {
  const notas = readNotas();
  const tickers = {};

  const getTickers = async (notas, tickers) => {
    return Promise.all(
      notas.map(async (nota, index) => {
        if (tickers[nota["Especificação do título"]]) {
          notas[index].ticker = tickers[nota["Especificação do título"]].ticker;
        } else {
          const ticker = await getTicker(nota["Especificação do título"]);
          notas[index].ticker = ticker;
          tickers[nota["Especificação do título"]] = ticker;
        }
      })
    );
  };
  getTickers(notas, tickers).then(() => {
    fs.writeFileSync(
      `${folder}/notas.json`,
      JSON.stringify(notas),
      function (err) {
        if (err) {
          return console.log(err);
        }
      }
    );
  });
};

export { syncTickers };
