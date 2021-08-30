let fs = require("fs");
import getAllNotas from "../../converter/index";
const filename = "./notas/notas.json";

export default function handler(req, res) {
  const { reload } = req.query;
  if (reload) {
    getAllNotas();
  }
  try {
    const notas = fs.readFileSync(filename, "utf8");
    res.status(200).json(notas);
  } catch (err) {
    res.status(500).send(`Error reading ${filename}`);
  }
}
