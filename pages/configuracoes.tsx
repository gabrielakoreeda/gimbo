import Button from "@components/ui/Button";
import PageTitle from "@components/ui/PageTitle";
import { NextPage } from "next";

const Configuracoes: NextPage = () => {
  return (
    <>
      <PageTitle title="Configurações" />
      <div>
        <h2 className="font-bold text-gray-600 text-md">Resetar as notas</h2>
        <div className="flex justify-between items-center mb-10">
          <p className="text-gray-600">
            Lê novamente as notas de negociações e remove as notas
            personalizadas adicionadas manualmente.
          </p>
          <Button>Aplicar</Button>
        </div>
        <h2 className="font-bold text-gray-600 text-md">
          Carregar novas notas
        </h2>
        <div className="flex justify-between items-center mb-10">
          <p className="text-gray-600">
            Lê novamente as notas de negociações e adiciona as já existentes sem
            apagar as notas personalizadas adicionadas manualmente.
          </p>
          <Button>Aplicar</Button>
        </div>
        <h2 className="font-bold text-gray-600 text-md">
          Remover notas personalizadas
        </h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Remove todas as notas personalizadas adicionadas manualmente.
          </p>
          <Button>Aplicar</Button>
        </div>
      </div>
    </>
  );
};

export default Configuracoes;
