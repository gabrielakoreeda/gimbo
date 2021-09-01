import { formatMoney } from "../../utils/index";
import Link from "next/link";
import TableWrapper from "./TableWrapper";

const TablePosicoes = (props) => {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Preço médio de compra</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((nota) => {
            if (nota.qtdCompra - nota.qtdVenda > 0) {
              return (
                <tr key={nota.ticker}>
                  <td>
                    <Link href={`/ativo/${nota.ticker}`}>
                      <a>{nota.ticker}</a>
                    </Link>
                  </td>
                  <td>{formatMoney(nota.precoMedioCompra)}</td>
                  <td>{nota.qtdCompra}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default TablePosicoes;
