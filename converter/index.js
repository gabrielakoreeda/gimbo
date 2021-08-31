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

const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

const similarity = (s1, s2) => {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
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
    if (
      Object.keys(formattedNotas).some(
        (n) => similarity(nota[accessor], n) >= 0.9
      )
    ) {
      const ativo = Object.keys(formattedNotas).filter(
        (n) => similarity(nota[accessor], n) >= 0.9
      )[0];
      formattedNotas[ativo].notas.push(nota);
      formattedNotas[ativo] = {
        ...formattedNotas[ativo],
        qtdCompra: formattedNotas[ativo].qtdCompra + qtdCompra || 0,
        qtdVenda: formattedNotas[ativo].qtdVenda + qtdVenda || 0,
        totalCompra: formattedNotas[ativo].totalCompra + totalCompra || 0,
        totalVenda: formattedNotas[ativo].totalVenda + totalVenda || 0,
        precoMedioVenda:
          (formattedNotas[ativo].totalVenda + totalVenda) /
            (formattedNotas[ativo].qtdVenda + qtdVenda) || 0,
        precoMedioCompra:
          (formattedNotas[ativo].totalCompra + totalCompra) /
            (formattedNotas[ativo].qtdCompra + qtdCompra) || 0,
      };

      if (
        Object.keys(formattedNotas[ativo].months).includes(`${month}/${year}`)
      ) {
        formattedNotas[ativo].months[`${month}/${year}`] = {
          ...formattedNotas[ativo].months[`${month}/${year}`],
          qtdCompra:
            formattedNotas[ativo].months[`${month}/${year}`].qtdCompra +
              qtdCompra || 0,
          qtdVenda:
            formattedNotas[ativo].months[`${month}/${year}`].qtdVenda +
              qtdVenda || 0,
          totalCompra:
            formattedNotas[ativo].months[`${month}/${year}`].totalCompra +
              totalCompra || 0,
          totalVenda:
            formattedNotas[ativo].months[`${month}/${year}`].totalVenda +
              totalVenda || 0,
          precoMedioVenda:
            (formattedNotas[ativo].months[`${month}/${year}`].totalVenda +
              totalVenda) /
              (formattedNotas[ativo].months[`${month}/${year}`].qtdVenda +
                qtdVenda) || 0,
          precoMedioCompra:
            (formattedNotas[ativo].months[`${month}/${year}`].totalCompra +
              totalCompra) /
              (formattedNotas[ativo].months[`${month}/${year}`].qtdCompra +
                qtdCompra) || 0,
        };
      } else {
        formattedNotas[ativo].months[`${month}/${year}`] = {
          qtdCompra,
          qtdVenda,
          totalCompra,
          totalVenda,
          precoMedioVenda,
          precoMedioCompra,
        };
      }
      if (Object.keys(formattedNotas[ativo].years).includes(year)) {
        formattedNotas[ativo].years[year] = {
          ...formattedNotas[ativo].years[year],
          qtdCompra:
            formattedNotas[ativo].years[year].qtdCompra + qtdCompra || 0,
          qtdVenda: formattedNotas[ativo].years[year].qtdVenda + qtdVenda || 0,
          totalCompra:
            formattedNotas[ativo].years[year].totalCompra + totalCompra || 0,
          totalVenda:
            formattedNotas[ativo].years[year].totalVenda + totalVenda || 0,
          precoMedioVenda:
            (formattedNotas[ativo].years[year].totalVenda + totalVenda) /
              (formattedNotas[ativo].years[year].qtdVenda + qtdVenda) || 0,
          precoMedioCompra:
            (formattedNotas[ativo].years[year].totalCompra + totalCompra) /
              (formattedNotas[ativo].years[year].qtdCompra + qtdCompra) || 0,
        };
      } else {
        formattedNotas[ativo].years[year] = {
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

// export default getAllNotas;
getAllNotas();
