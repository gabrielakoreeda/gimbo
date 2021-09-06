let fs = require("fs");
const filename = "./notas/notas.json";

const editTicker = (ticker, newTicker, type) => {
  const notas = JSON.parse(fs.readFileSync(filename, "utf8"));
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

  fs.writeFileSync(filename, JSON.stringify(updatedNotas), function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

const readNotasFile = (): Nota[] => {
  const notas = JSON.parse(fs.readFileSync(filename, "utf8"));
  return notas;
};

const addNewNota = (
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
  const notas = readNotasFile();
  const lastId = notas[notas.length - 1]?.id + 1 || 1;
  const newOperation = {
    id: lastId,
    ticker,
    tipo: type,
    descricao: description,
    "C/V": operationType,
    Quantidade: qtd,
    "Preço / Ajuste": price,
    "Valor Operação / Ajuste": totalPrice,
    Corretora: corretora,
    "Data pregão": date,
    manual: true,
  };
  notas.push(newOperation);
  fs.writeFileSync(filename, JSON.stringify(notas), function (err) {
    if (err) {
      return console.log(err);
    }
  });
  return newOperation;
};

const deleteManualNotas = () => {
  const notas = readNotasFile();
  const newNotas = notas.filter((nota) => nota.manual === false);
  fs.writeFileSync(filename, JSON.stringify(newNotas), function (err) {
    if (err) {
      return console.log(err);
    }
  });
  return newNotas;
};

export { editTicker, readNotasFile, addNewNota, deleteManualNotas };
