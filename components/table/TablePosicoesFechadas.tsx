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
            <th>Qtd</th>
            <th>Preço médio de compra</th>
            <th>Preço médio de venda</th>
            <th>Lucro (R$)</th>
            <th>Lucro (%)</th>
          </tr>
        </thead>
        <tbody>
          {props.notas?.map((nota) => {
            if (nota.qtdCompra - nota.qtdVenda === 0) {
              return (
                <tr key={nota.slug}>
                  <td className="text-green-500">
                    <Link href={`/posicoes/${nota.slug}`}>
                      <a>{nota.titulo?.substring(0, 10)}...</a>
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
