const decimalAdjust = (type, value, exp) => {
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
};

const round = (value, exp) => {
  return decimalAdjust("round", value, exp);
};

const formatMoney = (value) => {
  const money = round(value, -2);
  return money.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};

const formatPercentage = (value) => {
  const percent = round(value, -2);
  return percent.toLocaleString("pt-br", { minimumFractionDigits: 2 });
};

export { formatMoney, formatPercentage };
