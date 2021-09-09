let fs = require("fs");
const folder = "./notas/";
const filename = `${folder}/notas.json`;

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

  fs.writeFileSync(filename, JSON.stringify(updatedNotas), function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

const readNotas = (): Nota[] => {
  try {
    const notas = JSON.parse(fs.readFileSync(`${folder}/notas.json`, "utf8"));
    return notas;
  } catch (e) {
    return [];
  }
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
  const notas = readNotas();
  const lastId = notas[notas.length - 1]?.id + 1 || 1;
  const [year, month, day] = date.split("-");
  const formattedDate = `${day}/${month}/${year}`;
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
    "Data pregão": formattedDate,
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
  const notas = readNotas();
  const newNotas = notas.filter((nota) => nota.manual === false);
  fs.writeFileSync(filename, JSON.stringify(newNotas), function (err) {
    if (err) {
      return console.log(err);
    }
  });
  return newNotas;
};

export { editTicker, readNotas, addNewNota, deleteManualNotas };
