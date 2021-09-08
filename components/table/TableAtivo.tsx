import { formatMoney } from "@utils/index";
import { VscLoading } from "react-icons/vsc";
import TableWrapper from "./TableWrapper";

const TableAtivo: React.FC<{ notas: Nota[]; isLoading?: boolean }> = ({
  notas,
  isLoading,
}) => {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>Negociação</th>
            <th>C/V</th>
            <th>Tipo mercado</th>
            <th>Especificação do título</th>
            <th>Quantidade</th>
            <th>Preço / Ajuste</th>
            <th>Valor Operação / Ajuste</th>
            <th>D/C</th>
            <th>Corretora</th>
            <th>Data pregão</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10}>
                <VscLoading className="h-full animate-spin font-bold text-8xl m-auto" />
              </td>
            </tr>
          ) : (
            notas.map((nota) => {
              if (!nota.manual) {
                return (
                  <tr key={nota.id}>
                    <td>{nota["Negociação"]}</td>
                    <td>{nota["C/V"]}</td>
                    <td>{nota["Tipo mercado"]}</td>
                    <td>{nota["Especificação do título"]}</td>
                    <td>{nota["Quantidade"]}</td>
                    <td>{formatMoney(nota["Preço / Ajuste"])}</td>
                    <td>{formatMoney(nota["Valor Operação / Ajuste"])}</td>
                    <td>{nota["D/C"]}</td>
                    <td>{nota["Corretora"]}</td>
                    <td>{nota["Data pregão"]}</td>
                  </tr>
                );
              }
            })
          )}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default TableAtivo;
