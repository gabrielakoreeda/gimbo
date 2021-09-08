interface Ticker {
  id: number;
  name: string;
  symbol: string;
}

interface Nota {
  id: number;
  tickerId: number;
  tipo: string;
  descricao?: string;
  manual: boolean;
  Negociação?: string;
  "C/V": string;
  "Tipo mercado"?: string;
  "Especificação do título"?: string;
  "Obs. (*)"?: string;
  Quantidade: number;
  "Preço / Ajuste": number;
  "Valor Operação / Ajuste": number;
  "D/C"?: string;
  Corretora: string;
  "Data pregão": string;
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
