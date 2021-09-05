import getAllNotas from "../../converter/index";
import { editTicker, readNotasFile, addNewNota } from "@utils/wr-notas";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { reload } = req.query;
    if (reload) {
      getAllNotas();
    }
    try {
      const notas = readNotasFile();
      res.status(200).json(notas);
    } catch (err) {
      console.log(err);
      res.status(500).send(`Error reading notas.json`);
    }
  } else if (req.method === "PUT") {
    const { ticker, newTicker, type } = JSON.parse(req.body);
    try {
      editTicker(ticker, newTicker, type);
      res.status(200).send("Successfully updated ticker");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating ticker");
    }
  } else if (req.method === "POST") {
    const {
      ticker,
      operationType,
      type,
      qtd,
      price,
      totalPrice,
      date,
      description,
      corretora,
    } = JSON.parse(req.body);
    try {
      const newOperation = addNewNota(
        ticker,
        operationType,
        type,
        qtd,
        price,
        totalPrice,
        date,
        description,
        corretora
      );
      res.status(200).json(newOperation);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error adding operation");
    }
  }
}
