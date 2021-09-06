let fs = require("fs");
let PDFJS = require("pdfjs-dist/legacy/build/pdf.js");

const folder = "./notas/";

const formatField = (operation, fieldName, str) => {
  operation[fieldName] = (
    operation[fieldName]
      ? operation[fieldName] + str
      : str.replace(/\s{1,}/g, " ")
  ).trim();
  return operation;
};

const parsePrice = (operation, fieldName, str) => {
  if (str.trim() !== "")
    operation[fieldName] = parseFloat(str.replace(".", "").replace(",", "."));
  return operation;
};

const convertPDFToObject = async (filename, notas) => {
  const pdf = await PDFJS.getDocument(filename).promise;
  const pages = await pdf.numPages;
  for (let i = 1; i <= pages; i++) {
    let dataIndex;
    let tableIndex;
    let tableHeader = {};
    let tablePrev;
    let tableHeaderEndIndex;
    let tableEnd = false;
    let data = "";
    let corretora = "";
    const operations = [];
    let operation = {};
    const page = await (await pdf.getPage(i)).getTextContent();
    page.items.forEach((item, index) => {
      if (item.str === "Data pregão") dataIndex = index;
      if (index === dataIndex + 2) data = item.str;
      if (index === dataIndex + 4) corretora = item.str;
      if (item.str === "Negócios realizados") tableIndex = index + 2;
      if (item.str === "D/C") tableHeaderEndIndex = index;
      if (
        index >= tableIndex &&
        (!tableHeaderEndIndex || index <= tableHeaderEndIndex)
      ) {
        if ((index - tableIndex) % 2 === 0) {
          tableHeader[item.str] = { start: item.transform[4] };
          tablePrev = item.str;
          if (index === tableHeaderEndIndex)
            tableHeader[tablePrev].end = item.transform[4] + item.width;
        } else {
          tableHeader[tablePrev].end = item.transform[4] + item.width;
        }
      }
      if (index > tableHeaderEndIndex && !tableEnd) {
        if (Object.keys(operation).includes("D/C")) {
          operation.manual = false;
          operations.push(operation);
          operation = {};
        }
        if (
          item.transform[4] >= tableHeader["Q"].start &&
          item.transform[4] < tableHeader["Q"].end
        ) {
          operation = formatField(operation, "Q", item.str);
        } else if (
          item.transform[4] >= tableHeader["Negociação"].start &&
          item.transform[4] < tableHeader["Negociação"].end
        ) {
          operation = formatField(operation, "Negociação", item.str);
        } else if (
          item.transform[4] >= tableHeader["C/V"].start &&
          item.transform[4] < tableHeader["C/V"].end
        ) {
          operation = formatField(operation, "C/V", item.str);
        } else if (
          item.transform[4] >= tableHeader["Tipo mercado"].start &&
          item.transform[4] < tableHeader["Tipo mercado"].end
        ) {
          operation = formatField(operation, "Tipo mercado", item.str);
        } else if (
          item.transform[4] >= tableHeader["Prazo"].start &&
          item.transform[4] < tableHeader["Prazo"].end
        ) {
          operation = formatField(operation, "Prazo", item.str);
        } else if (
          item.transform[4] >= tableHeader["Especificação do título"].start &&
          item.transform[4] < tableHeader["Especificação do título"].end
        ) {
          operation = formatField(
            operation,
            "Especificação do título",
            item.str
          );
        } else if (
          item.transform[4] >= tableHeader["Obs. (*)"].start &&
          item.transform[4] < tableHeader["Obs. (*)"].end
        ) {
          operation = formatField(operation, "Obs. (*)", item.str);
        } else if (
          item.transform[4] >= tableHeader["Quantidade"].start &&
          item.transform[4] < tableHeader["Quantidade"].end
        ) {
          operation = parsePrice(operation, "Quantidade", item.str);
        } else if (
          item.transform[4] >= tableHeader["Preço / Ajuste"].start &&
          item.transform[4] < tableHeader["Preço / Ajuste"].end
        ) {
          operation = parsePrice(operation, "Preço / Ajuste", item.str);
        } else if (
          item.transform[4] >= tableHeader["Valor Operação / Ajuste"].start &&
          item.transform[4] < tableHeader["Valor Operação / Ajuste"].end
        ) {
          operation = parsePrice(
            operation,
            "Valor Operação / Ajuste",
            item.str
          );
        } else if (
          item.transform[4] >= tableHeader["D/C"].start &&
          item.transform[4] < tableHeader["D/C"].end
        ) {
          operation = formatField(operation, "D/C", item.str);
        }
      }
      if (item.str === "NOTA DE NEGOCIAÇÃO") tableEnd = true;
    });
    const nota = operations.map((op) => {
      return { ...op, Corretora: corretora, "Data pregão": data };
    });
    notas.push(...nota);
  }
};

const formatNotas = (notas) => {
  let formattedNotas = [];
  let counter = 1;
  notas.forEach((nota) => {
    let ticker = nota["Especificação do título"].replace(/\s+/g, "");
    let tipo = "Ação";
    if (nota["Especificação do título"].startsWith("FII")) {
      tipo = "FII";
      ticker = nota["Especificação do título"].match(/[A-Za-z]{4}11/g)[0];
    }
    formattedNotas.push({ id: counter, ticker, tipo, ...nota });
    counter++;
  });
  return formattedNotas;
};

const getAllNotas = async (readNewOnly) => {
  let notas = [];
  fs.readdir(folder, async (err, files) => {
    for await (let file of files) {
      if (file.match(/\.pdf$/)) {
        await convertPDFToObject(`${folder}/${file}`, notas).catch((e) =>
          console.log(e)
        );
      }
    }
    notas = formatNotas(notas);
    if (readNewOnly) {
      let lastIndex = notas.length;
      const oldNotas = readNotasFile();
      const manualNotas = oldNotas
        .filter((nota) => nota.manual)
        .map((nota, index) => {
          return {
            ...nota,
            id: lastIndex + index,
          };
        });
      notas.push(...manualNotas);
    }
    fs.writeFileSync(
      `${folder}/notas.json`,
      JSON.stringify(notas),
      function (err) {
        if (err) {
          return console.log(err);
        }
      }
    );
  });
};

export default getAllNotas;
