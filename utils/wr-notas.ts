let fs = require("fs");
const folder = "./notas/";
const filename = `notas.json`;

const editTicker = (ticker, newTicker, type) => {
  const notas = readNotas();
  const updatedNotas = notas.map((nota) => {
    const updatedNota = { ...nota };
    if (newTicker && nota.ticker === ticker) {
      updatedNota.ticker = newTicker;
    }
    if (type && nota.ticker === ticker) {
      updatedNota.tipo = type;
    }
    return updatedNota;
  });

  writeFile(JSON.stringify(updatedNotas), filename);
};

const readNotas = (): Nota[] => {
  try {
    const notas = JSON.parse(fs.readFileSync(`${folder}/notas.json`, "utf8"));
    return notas;
  } catch (e) {
    return [];
  }
};

const readTickers = (): {} => {
  try {
    const tickers = JSON.parse(
      fs.readFileSync(`${folder}/tickers.json`, "utf8")
    );
    return tickers;
  } catch (e) {
    return {};
  }
};

const writeFile = (object: string, filename: string) => {
  fs.writeFileSync(`${folder}/${filename}`, object, function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

const addNewNota = (
  slug: string,
  ticker: string,
  operationType: string,
  type: string,
  qtd: number,
  price: number,
  totalPrice: number,
  date: string,
  description: string,
  corretora: string
) => {
  const notas = readNotas();
  const lastId = notas[notas.length - 1]?.id + 1 || 1;
  const [year, month, day] = date.split("-");
  const formattedDate = `${day}/${month}/${year}`;
  const newOperation = {
    id: lastId,
    slug,
    ticker,
    tipo: type,
    descricao: description,
    "C/V": operationType,
    Quantidade: qtd,
    "Preço / Ajuste": price,
    "Valor Operação / Ajuste": totalPrice,
    Corretora: corretora,
    "Data pregão": formattedDate,
    manual: true,
  };
  notas.push(newOperation);
  writeFile(JSON.stringify(notas), filename);
  return newOperation;
};

const deleteManualNotas = () => {
  const notas = readNotas();
  const newNotas = notas.filter((nota) => nota.manual === false);
  writeFile(JSON.stringify(newNotas), filename);
  return newNotas;
};

export {
  editTicker,
  readNotas,
  readTickers,
  addNewNota,
  deleteManualNotas,
  writeFile,
};
