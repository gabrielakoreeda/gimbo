const { data } = require("autoprefixer");
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
  let formattedNotas = {};
  const accessor = "Especificação do título";
  notas.forEach((nota) => {
    const [day, month, year] = nota["Data pregão"].split("/");
    let qtdCompra = 0;
    let qtdVenda = 0;
    let totalCompra = 0;
    let totalVenda = 0;
    let precoMedioCompra = 0;
    let precoMedioVenda = 0;
    if (nota["C/V"] === "V") {
      qtdVenda = nota.Quantidade;
      totalVenda = nota["Valor Operação / Ajuste"];
      precoMedioVenda = totalVenda / qtdVenda;
    } else {
      qtdCompra = nota.Quantidade;
      totalCompra = nota["Valor Operação / Ajuste"];
      precoMedioCompra = totalCompra / qtdCompra;
    }
    if (Object.keys(formattedNotas).includes(nota[accessor])) {
      formattedNotas[nota[accessor]].notas.push(nota);
      formattedNotas[nota[accessor]] = {
        ...formattedNotas[nota[accessor]],
        qtdCompra: formattedNotas[nota[accessor]].qtdCompra + qtdCompra || 0,
        qtdVenda: formattedNotas[nota[accessor]].qtdVenda + qtdVenda || 0,
        totalCompra:
          formattedNotas[nota[accessor]].totalCompra + totalCompra || 0,
        totalVenda: formattedNotas[nota[accessor]].totalVenda + totalVenda || 0,
        precoMedioVenda:
          (formattedNotas[nota[accessor]].totalVenda + totalVenda) /
            (formattedNotas[nota[accessor]].qtdVenda + qtdVenda) || 0,
        precoMedioCompra:
          (formattedNotas[nota[accessor]].totalCompra + totalCompra) /
            (formattedNotas[nota[accessor]].qtdCompra + qtdCompra) || 0,
      };

      if (
        Object.keys(formattedNotas[nota[accessor]].months).includes(
          `${month}/${year}`
        )
      ) {
        formattedNotas[nota[accessor]].months[`${month}/${year}`] = {
          ...formattedNotas[nota[accessor]].months[`${month}/${year}`],
          qtdCompra:
            formattedNotas[nota[accessor]].months[`${month}/${year}`]
              .qtdCompra + qtdCompra || 0,
          qtdVenda:
            formattedNotas[nota[accessor]].months[`${month}/${year}`].qtdVenda +
              qtdVenda || 0,
          totalCompra:
            formattedNotas[nota[accessor]].months[`${month}/${year}`]
              .totalCompra + totalCompra || 0,
          totalVenda:
            formattedNotas[nota[accessor]].months[`${month}/${year}`]
              .totalVenda + totalVenda || 0,
          precoMedioVenda:
            (formattedNotas[nota[accessor]].months[`${month}/${year}`]
              .totalVenda +
              totalVenda) /
              (formattedNotas[nota[accessor]].months[`${month}/${year}`]
                .qtdVenda +
                qtdVenda) || 0,
          precoMedioCompra:
            (formattedNotas[nota[accessor]].months[`${month}/${year}`]
              .totalCompra +
              totalCompra) /
              (formattedNotas[nota[accessor]].months[`${month}/${year}`]
                .qtdCompra +
                qtdCompra) || 0,
        };
      } else {
        formattedNotas[nota[accessor]].months[`${month}/${year}`] = {
          qtdCompra,
          qtdVenda,
          totalCompra,
          totalVenda,
          precoMedioVenda,
          precoMedioCompra,
        };
      }
      if (Object.keys(formattedNotas[nota[accessor]].years).includes(year)) {
        formattedNotas[nota[accessor]].years[year] = {
          ...formattedNotas[nota[accessor]].years[year],
          qtdCompra:
            formattedNotas[nota[accessor]].years[year].qtdCompra + qtdCompra ||
            0,
          qtdVenda:
            formattedNotas[nota[accessor]].years[year].qtdVenda + qtdVenda || 0,
          totalCompra:
            formattedNotas[nota[accessor]].years[year].totalCompra +
              totalCompra || 0,
          totalVenda:
            formattedNotas[nota[accessor]].years[year].totalVenda +
              totalVenda || 0,
          precoMedioVenda:
            (formattedNotas[nota[accessor]].years[year].totalVenda +
              totalVenda) /
              (formattedNotas[nota[accessor]].years[year].qtdVenda +
                qtdVenda) || 0,
          precoMedioCompra:
            (formattedNotas[nota[accessor]].years[year].totalCompra +
              totalCompra) /
              (formattedNotas[nota[accessor]].years[year].qtdCompra +
                qtdCompra) || 0,
        };
      } else {
        formattedNotas[nota[accessor]].years[year] = {
          qtdCompra,
          qtdVenda,
          totalCompra,
          totalVenda,
          precoMedioVenda,
          precoMedioCompra,
        };
      }
    } else {
      formattedNotas[nota[accessor]] = {
        notas: [nota],
        qtdCompra,
        qtdVenda,
        totalCompra,
        totalVenda,
        precoMedioVenda,
        precoMedioCompra,
        months: {},
        years: {},
      };
      formattedNotas[nota[accessor]].months[`${month}/${year}`] = {
        qtdCompra,
        qtdVenda,
        totalCompra,
        totalVenda,
        precoMedioVenda,
        precoMedioCompra,
      };
      formattedNotas[nota[accessor]].years[year] = {
        qtdCompra,
        qtdVenda,
        totalCompra,
        totalVenda,
        precoMedioVenda,
        precoMedioCompra,
      };
    }
  });
  return formattedNotas;
};

const getAllNotas = async () => {
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
