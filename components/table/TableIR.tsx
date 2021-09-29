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
          {Object.keys(notas)
            .sort()
            .map((month) => {
              return (
                <tr key={month}>
                  <td>{month}</td>
                  <td>{formatMoney(notas[month]["Ação"])}</td>
                  <td>{formatMoney(notas[month]["FII"])}</td>
                  <td>
                    {formatMoney(notas[month]["Ação"] + notas[month]["FII"])}
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
