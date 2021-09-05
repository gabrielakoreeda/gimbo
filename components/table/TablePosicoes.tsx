import { formatMoney } from "../../utils/index";
import Link from "next/link";
import TableWrapper from "./TableWrapper";
import Button from "../ui/Button";

const TablePosicoes: React.FC<{ notas: NotaConsolidada[] }> = (props) => {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Preço médio de compra</th>
            <th>Quantidade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.notas?.map((nota) => {
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
                  <td>
                    <Button>
                      <Link href={`/ativo/${nota.ticker}`}>
                        <a>Detalhes</a>
                      </Link>
                    </Button>
                  </td>
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
