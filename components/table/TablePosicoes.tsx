import { formatMoney } from "../../utils/index";
import Link from "next/link";
import TableWrapper from "./TableWrapper";

const TablePosicoes: React.FC<{ notas: NotaConsolidada[] }> = (props) => {
  return (
    <TableWrapper>
      <table>
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Preço médio de compra</th>
            <th>Qtd</th>
          </tr>
        </thead>
        <tbody>
          {props.notas?.map((nota) => {
            if (nota.qtdCompra - nota.qtdVenda > 0) {
              return (
                <tr key={nota.slug}>
                  <td className="text-green-500">
                    <Link href={`/posicoes/${nota.slug}`}>
                      <a>{nota.titulo?.substring(0, 10)}...</a>
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
