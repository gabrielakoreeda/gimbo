import { formatMoney } from "@utils/index";
import TableWrapper from "./TableWrapper";

const TableAtivoPersonalizado: React.FC<{ notas: Nota[] }> = ({ notas }) => {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>C/V</th>
            <th>Quantidade</th>
            <th>Preço / Ajuste</th>
            <th>Valor Operação / Ajuste</th>
            <th>Data pregão</th>
            <th>Corretora</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => {
            if (nota.manual) {
              return (
                <tr key={nota.id}>
                  <td>{nota["C/V"]}</td>
                  <td>{nota["Quantidade"]}</td>
                  <td>{formatMoney(nota["Preço / Ajuste"])}</td>
                  <td>{formatMoney(nota["Valor Operação / Ajuste"])}</td>
                  <td>{nota["Corretora"]}</td>
                  <td>{nota["Data pregão"]}</td>
                  <td>{nota["Descrição"]}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default TableAtivoPersonalizado;
