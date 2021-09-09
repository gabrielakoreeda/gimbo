import { syncTickers } from "@utils/stocks-api";

export default function handler(req, res) {
  if (req.method === "GET") {
    try {
      syncTickers();
      res.status(200).send("OK");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating ticker");
    }
  }
}
