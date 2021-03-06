import { round } from "./index";

const filterNotas = (
  notas: Nota[],
  startDate?: Date,
  endDate?: Date,
  type?: string,
  ticker?: string,
  corretora?: string
) => {
  const filteredNotas = notas.filter((nota) => {
    let filter = true;
    const [day, month, year] = nota["Data pregão"].split("/");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (
      ticker !== "" &&
      nota.ticker.toLowerCase().includes(ticker.toLowerCase())
    ) {
      return true;
    } else if (ticker !== "") {
      return false;
    }
    if (
      corretora !== "" &&
      nota.Corretora.toLowerCase().includes(corretora.toLowerCase())
    ) {
      return true;
    } else if (corretora !== "") {
      return false;
    }
    if (startDate) {
      filter = filter && date >= startDate;
    }
    if (endDate) {
      filter = filter && date <= endDate;
    }
    if (type !== "" && type === nota["C/V"]) {
      filter = filter && true;
    } else if (type !== "") {
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
    if (Object.keys(groupNotas).includes(nota.slug)) {
      const currNota = groupNotas[nota.slug];
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
      groupedNotas[groupNotas[nota.slug].index] = {
        titulo: nota["Especificação do título"],
        slug: nota.slug,
        ...calcValues,
      };
      groupNotas[nota.slug] = {
        ...groupNotas[nota.slug],
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
      groupNotas[nota.slug] = {
        index: groupedNotas.length,
        ...calcValues,
      };
      groupedNotas.push({
        titulo: nota["Especificação do título"],
        slug: nota.slug,
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

const groupByMonth = (notas) => {
  const groupNotas = {};
  const groupedNotas = [];
  const monthly = {};
  notas.forEach((nota) => {
    let calcValues;
    if (Object.keys(groupNotas).includes(nota.slug)) {
      const currNota = groupNotas[nota.slug];
      calcValues = {
        totalCompra:
          nota["C/V"] === "C"
            ? nota["Valor Operação / Ajuste"] + currNota.totalCompra
            : currNota.totalCompra,
        qtdCompra:
          nota["C/V"] === "C"
            ? nota.Quantidade + currNota.qtdCompra
            : currNota.qtdCompra,
        precoMedioCompra:
          nota["C/V"] === "C"
            ? (nota["Valor Operação / Ajuste"] + currNota.totalCompra) /
              (nota.Quantidade + currNota.qtdCompra)
            : currNota.precoMedioCompra,
      };
      groupedNotas[groupNotas[nota.slug].index] = {
        titulo: nota["Especificação do título"],
        slug: nota.slug,
        ...calcValues,
      };
      groupNotas[nota.slug] = {
        ...groupNotas[nota.slug],
        ...calcValues,
      };
    } else {
      calcValues = {
        totalCompra: nota["C/V"] === "C" ? nota["Valor Operação / Ajuste"] : 0,
        qtdCompra: nota["C/V"] === "C" ? nota.Quantidade : 0,
        precoMedioCompra:
          nota["C/V"] === "C"
            ? nota["Valor Operação / Ajuste"] / nota.Quantidade
            : 0,
      };
      groupedNotas.push({
        titulo: nota["Especificação do título"],
        slug: nota.slug,
        ...calcValues,
      });
      groupNotas[nota.slug] = {
        index: groupedNotas.length,
        ...calcValues,
      };
    }

    if (nota["C/V"] === "V") {
      const [day, month, year] = nota["Data pregão"].split("/");
      if (Object.keys(monthly).includes(year)) {
        if (Object.keys(monthly[year]).includes(month)) {
          monthly[year][month] = {
            ...monthly[year][month],
            [nota.tipo]:
              (monthly[year][month][nota.tipo] || 0) +
              (nota["Preço / Ajuste"] - calcValues.precoMedioCompra) *
                nota.Quantidade,
          };
        } else {
          monthly[year][month] = {
            [nota.tipo]:
              (nota["Preço / Ajuste"] - calcValues.precoMedioCompra) *
              nota.Quantidade,
          };
        }
      } else {
        monthly[year] = {
          [month]: {
            [nota.tipo]:
              (nota["Preço / Ajuste"] - calcValues.precoMedioCompra) *
              nota.Quantidade,
          },
        };
      }
    }
  });
  Object.keys(monthly).forEach((year) => {
    Object.keys(monthly[year]).forEach((month) => {
      if (monthly[year][month]["Ação"]) {
        monthly[year][month]["Ação"] = round(monthly[year][month]["Ação"], -2);
      } else {
        monthly[year][month]["Ação"] = 0;
      }
      if (monthly[year][month]["FII"]) {
        monthly[year][month]["FII"] = round(monthly[year][month]["FII"], -2);
      } else {
        monthly[year][month]["FII"] = 0;
      }
    });
  });

  return monthly;
};

export { filterNotas, groupBy, groupByMonth };
