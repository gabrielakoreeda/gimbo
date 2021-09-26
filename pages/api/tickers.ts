import { getInfo } from "adapters/stock-api";

export default async function handler(req, res) {
  const { func, keywords, symbol } = req.query;
  if (req.method === "GET") {
    try {
      const result = await getInfo({
        function: func,
        keywords,
        symbol,
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating ticker");
    }
  }
}
