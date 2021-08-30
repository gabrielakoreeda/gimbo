let fs = require("fs");
const filename = "./notas/notas.json";

export default function handler(req, res) {
  try {
    const notas = fs.readFileSync(filename, "utf8");
    res.status(200).json(notas);
  } catch (err) {
    res.status(500).send(`Error reading ${filename}`);
  }
}
