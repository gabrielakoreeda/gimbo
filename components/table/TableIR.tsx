import { formatMoney } from "@utils/index";
import TableWrapper from "./TableWrapper";

const TableIR: React.FC<{ notas: {} }> = ({ notas }) => {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>Mês</th>
            <th>Lucro Ação (R$)</th>
            <th>Lucro FII (R$)</th>
            <th>Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          {[
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ].map((month) => {
            return (
              <tr key={month}>
                <td>{month}</td>
                <td>{formatMoney(notas[month] ? notas[month]["Ação"] : 0)}</td>
                <td>{formatMoney(notas[month] ? notas[month]["FII"] : 0)}</td>
                <td>
                  {formatMoney(
                    notas[month]
                      ? notas[month]["Ação"] + notas[month]["FII"]
                      : 0
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default TableIR;
