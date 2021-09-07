import { saveKey, getKey } from "@utils/config";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { key } = JSON.parse(req.body);
    try {
      saveKey(key);
      res.status(200).send("Successfully updated ticker");
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating ticker");
    }
  } else if (req.method === "GET") {
    try {
      const apiKey = getKey();
      res.status(200).json(apiKey);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error updating ticker");
    }
  }
}
