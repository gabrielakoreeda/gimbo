import { formatMoney } from "../../utils/index";
import Link from "next/link";
import TableWrapper from "./TableWrapper";
import Button from "../ui/Button";

const TablePosicoesFechadas: React.FC<{ notas: NotaConsolidada[] }> = (
  props
) => {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Quantidade</th>
            <th>Preço médio de compra</th>
            <th>Preço médio de venda</th>
            <th>Lucro (R$)</th>
            <th>Lucro (%)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.notas?.map((nota) => {
            if (nota.qtdCompra - nota.qtdVenda === 0) {
              return (
                <tr key={nota.ticker}>
                  <td>
                    <Link href={`/ativo/${nota.ticker}`}>
                      <a>{nota.ticker}</a>
                    </Link>
                  </td>
                  <td>{nota.qtdCompra}</td>
                  <td>{formatMoney(nota.precoMedioCompra)}</td>
                  <td>{formatMoney(nota.precoMedioVenda)}</td>
                  <td
                    className={
                      nota.lucroRS < 0 ? "text-red-700" : "text-green-700"
                    }
                  >
                    {formatMoney(nota.lucroRS)}
                  </td>
                  <td
                    className={
                      nota.lucroPerc < 0 ? "text-red-700" : "text-green-700"
                    }
                  >
                    {nota.lucroPerc}
                  </td>
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

export default TablePosicoesFechadas;
