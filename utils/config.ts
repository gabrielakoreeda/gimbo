let fs = require("fs");

const saveKey = (key: string) => {
  fs.writeFileSync(`./.env`, `YAHOO_KEY=${key}`, function (err) {
    if (err) {
      return console.log(err);
    }
  });
};

const getKey = (): {} => {
  try {
    const data = fs.readFileSync(`./.env`, { encoding: "utf8", flag: "r" });
    const [key, value] = data.split("=");
    return { [key]: value };
  } catch (e) {
    return {};
  }
};

export { saveKey, getKey };
