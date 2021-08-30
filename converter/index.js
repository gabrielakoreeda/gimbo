let fs = require("fs");
let PDFJS = require("pdfjs-dist/legacy/build/pdf.js");

const folder = "./notas/";

const converPDFToObject = async (filename, nota) => {
  const pdf = await PDFJS.getDocument(filename).promise;
  const pages = await pdf.numPages;
  for (let i = 1; i <= pages; i++) {
    let dataIndex;
    let tableIndex;
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
      if (item.str === "D/C") tableIndex = index + 2;
      if (item.str === "NOTA DE NEGOCIAÇÃO") tableEnd = true;
      if (index >= tableIndex && !tableEnd) {
        if (Object.keys(operation).length === 7) {
          operations.push(operation);
          operation = {};
        }
        if (index - tableIndex === 0 || (index - tableIndex) % 16 === 0) {
          operation["Negociação"] = item.str;
        }

        if (
          index - tableIndex !== 0 &&
          (index - tableIndex === 2 || (index - tableIndex) % 18 === 0)
        ) {
          operation["C/V"] = item.str;
        }

        if (
          index - tableIndex !== 0 &&
          (index - tableIndex === 4 || (index - tableIndex) % 20 === 0)
        ) {
          operation["Tipo mercado"] = item.str;
        }

        if (
          index - tableIndex !== 0 &&
          (index - tableIndex === 6 || (index - tableIndex) % 22 === 0)
        ) {
          operation["Especificação do título"] = item.str;
        }

        if (
          index - tableIndex !== 0 &&
          (index - tableIndex === 8 || (index - tableIndex) % 26 === 0)
        ) {
          operation["Quantidade"] = item.str;
        }

        if (
          index - tableIndex !== 0 &&
          (index - tableIndex === 12 || (index - tableIndex) % 28 === 0)
        ) {
          operation["Preço / Ajuste"] = item.str;
        }

        if (
          index - tableIndex !== 0 &&
          (index - tableIndex === 10 || (index - tableIndex) % 30 === 0)
        ) {
          operation["Valor Operação / Ajuste"] = item.str;
        }
      }
    });
    if (nota.hasOwnProperty(data)) {
      nota[data] = [
        ...nota[data],
        operations.map((op) => {
          return { ...op, corretora };
        }),
      ];
    } else {
      nota[data] = operations.map((op) => {
        return { ...op, corretora };
      });
    }
  }
  return nota;
};

const getAllNotas = async () => {
  let notas = {};
  fs.readdir(folder, async (err, files) => {
    for await (let file of files) {
      if (file.match(/\.pdf$/)) {
        notas = await converPDFToObject(`${folder}/${file}`, notas).catch((e) =>
          console.log(e)
        );
      }
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
