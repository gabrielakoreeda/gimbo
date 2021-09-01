let fs = require("fs");
import getAllNotas from "../../converter/index";
import { filterNotas, groupBy, editTicker } from "../../utils/filter";
const filename = "./notas/notas.json";

export default function handler(req, res) {
  if (req.method === "GET") {
    const { reload, startDate, endDate, type, ticker } = req.query;
    if (reload) {
      getAllNotas();
    }
    try {
      const notas = JSON.parse(fs.readFileSync(filename, "utf8"));
      const filteredNotas = filterNotas(
        notas,
        startDate,
        endDate,
        type,
        ticker
      );
      if (!ticker) {
        const groupedNotas = groupBy(filteredNotas);
        res.status(200).json(groupedNotas);
      } else {
        res.status(200).json(filteredNotas);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(`Error reading ${filename}`);
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
  }
}
