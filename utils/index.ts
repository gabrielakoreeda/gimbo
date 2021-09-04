const decimalAdjust = (type: string, value: number, exp: number) => {
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  let newValue = value.toString().split("e");
  newValue = Math[type](
    +(newValue[0] + "e" + (newValue[1] ? +newValue[1] - exp : -exp))
  );
  newValue = newValue.toString().split("e");
  return +(newValue[0] + "e" + (newValue[1] ? +newValue[1] + exp : exp));
};

const round = (value: number, exp: number): number => {
  return decimalAdjust("round", value, exp);
};

const formatMoney = (value: number): string => {
  const money = round(value, -2);
  return money.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};

const formatPercentage = (value: number): string => {
  const percent = round(value, -2);
  return percent.toLocaleString("pt-br", { minimumFractionDigits: 2 });
};

export { round, formatMoney, formatPercentage };
