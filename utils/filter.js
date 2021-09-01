import { round } from "./index";

const filterNotas = (notas, startDate, endDate, type, ticker) => {
  const filteredNotas = notas.filter((nota) => {
    let filter = true;
    const [day, month, year] = nota["Data pregão"].split("/");
    if (ticker && ticker === nota.ticker) {
      return true;
    } else if (ticker) {
      return false;
    }
    if (startDate) {
      const [startYear, startMonth] = startDate.split("-");
      filter =
        filter &&
        parseInt(year) >= parseInt(startYear) &&
        parseInt(month) >= parseInt(startMonth);
    }
    if (endDate) {
      const [endYear, endMonth] = endDate.split("-");
      filter =
        filter &&
        parseInt(year) <= parseInt(endYear) &&
        parseInt(month) <= parseInt(endMonth);
    }
    if (type && type === nota.type) {
      filter = filter && true;
    } else if (type) {
      filter = filter && false;
    }
    return filter;
  });
  return filteredNotas;
};

const groupBy = (notas) => {
  const groupNotas = {};
  const groupedNotas = [];
  notas.forEach((nota) => {
    if (Object.keys(groupNotas).includes(nota.ticker)) {
      const currNota = groupNotas[nota.ticker];
      const calcValues = {
        totalCompra: round(
          nota["C/V"] === "C"
            ? nota["Valor Operação / Ajuste"] + currNota.totalCompra
            : currNota.totalCompra,
          -2
        ),
        totalVenda: round(
          nota["C/V"] === "V"
            ? nota["Valor Operação / Ajuste"] + currNota.totalVenda
            : currNota.totalVenda,
          -2
        ),
        qtdCompra: round(
          nota["C/V"] === "C"
            ? nota.Quantidade + currNota.qtdCompra
            : currNota.qtdCompra,
          -2
        ),
        qtdVenda: round(
          nota["C/V"] === "V"
            ? nota.Quantidade + currNota.qtdVenda
            : currNota.qtdVenda,
          -2
        ),
        precoMedioCompra: round(
          nota["C/V"] === "C"
            ? (nota["Valor Operação / Ajuste"] + currNota.totalCompra) /
                (nota.Quantidade + currNota.qtdCompra)
            : currNota.precoMedioCompra,
          -2
        ),
        precoMedioVenda: round(
          nota["C/V"] === "V"
            ? (nota["Valor Operação / Ajuste"] + currNota.totalVenda) /
                (nota.Quantidade + currNota.qtdVenda)
            : currNota.precoMedioVenda,
          -2
        ),
      };
      groupedNotas[groupNotas[nota.ticker].index] = {
        ticker: nota.ticker,
        ...calcValues,
      };
      groupNotas[nota.ticker] = {
        ...groupNotas[nota.ticker],
        ...calcValues,
      };
    } else {
      const calcValues = {
        totalCompra: round(
          nota["C/V"] === "C" ? nota["Valor Operação / Ajuste"] : 0,
          -2
        ),
        totalVenda: round(
          nota["C/V"] === "V" ? nota["Valor Operação / Ajuste"] : 0,
          -2
        ),
        qtdCompra: round(nota["C/V"] === "C" ? nota.Quantidade : 0, -2),
        qtdVenda: round(nota["C/V"] === "V" ? nota.Quantidade : 0, -2),
        precoMedioCompra: round(
          nota["C/V"] === "C"
            ? nota["Valor Operação / Ajuste"] / nota.Quantidade
            : 0,
          -2
        ),
        precoMedioVenda: round(
          nota["C/V"] === "V"
            ? nota["Valor Operação / Ajuste"] / nota.Quantidade
            : 0,
          -2
        ),
      };
      groupNotas[nota.ticker] = {
        index: groupedNotas.length,
        ...calcValues,
      };
      groupedNotas.push({
        ticker: nota.ticker,
        ...calcValues,
      });
    }
  });
  return groupedNotas.map((nota) => {
    let lucroRS = null;
    let lucroPerc = null;
    if (nota.qtdVenda > 0) {
      lucroRS = round(
        (nota.precoMedioVenda - nota.precoMedioCompra) * nota.qtdVenda,
        -2
      );
      lucroPerc = round(
        (100 * (nota.precoMedioVenda - nota.precoMedioCompra)) /
          nota.precoMedioCompra,
        -2
      );
    }

    return { ...nota, lucroRS, lucroPerc };
  });
};

export { filterNotas, groupBy };
