interface Nota {
  id: number;
  ticker: string;
  tipo: string;
  Negociação: string;
  "C/V": string;
  "Tipo mercado": string;
  "Especificação do título": string;
  "Obs. (*)": string;
  Quantidade: number;
  "Preço / Ajuste": number;
  "Valor Operação / Ajuste": number;
  "D/C": string;
  Corretora: string;
  "Data pregão": string;
  type: FII;
}

interface NotaConsolidada {
  ticker: string;
  totalCompra: number | null;
  totalVenda: number | null;
  qtdCompra: number | null;
  qtdVenda: number | null;
  precoMedioCompra: number | null;
  precoMedioVenda: number | null;
  lucroRS: number | null;
  lucroPerc: number | null;
}
