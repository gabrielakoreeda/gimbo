import Button from "@components/ui/Button";
import PageTitle from "@components/ui/PageTitle";
import NotasContext from "@store/notas-context";
import Link from "next/link";
import { NextPage } from "next";
import { useContext, useEffect, useState } from "react";

const Configuracoes: NextPage = () => {
  const notasCtx = useContext(NotasContext);
  const apiKey = notasCtx.apiKey;
  const [key, setKey] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setKey(apiKey);
  }, [apiKey]);

  const resetNotasHandler = () => {
    notasCtx.reloadNotas("reset");
  };

  const reloadNotasHandler = () => {
    notasCtx.reloadNotas("reload");
  };

  const removeManualHandler = () => {
    notasCtx.reloadNotas("remove");
  };

  const saveAPIKeyHandler = () => {
    notasCtx.saveAPIKey(key);
    setEdit(false);
  };

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
          <Button onClick={resetNotasHandler}>Aplicar</Button>
        </div>
        <h2 className="font-bold text-gray-600 text-md">
          Carregar novas notas
        </h2>
        <div className="flex justify-between items-center mb-10">
          <p className="text-gray-600">
            Lê novamente as notas de negociações e adiciona as já existentes sem
            apagar as notas personalizadas adicionadas manualmente.
          </p>
          <Button onClick={reloadNotasHandler}>Aplicar</Button>
        </div>
        <h2 className="font-bold text-gray-600 text-md">
          Remover notas personalizadas
        </h2>
        <div className="flex justify-between items-center mb-10">
          <p className="text-gray-600">
            Remove todas as notas personalizadas adicionadas manualmente.
          </p>
          <Button onClick={removeManualHandler}>Aplicar</Button>
        </div>
        <h2 className="font-bold text-gray-600 text-md">
          Adicionar chave API Alpha Vantage
        </h2>
        <div>
          <p className="text-gray-600">
            A API é utilizada para buscar informações adicionais sobre cada
            ativo. A API tem um limite diário de 500 chamadas, além de 5
            chamadas por minuto. A chave pode ser gerada em: {}
            <Link href="https://www.alphavantage.co/">
              <a className="text-green-600">https://www.alphavantage.co/</a>
            </Link>
          </p>
          <div className="flex mt-2 mb-4">
            <input
              type="text"
              className="w-1/2"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={!edit}
            />
            {edit && <Button onClick={saveAPIKeyHandler}>Salvar</Button>}
            {!edit && <Button onClick={() => setEdit(true)}>Editar</Button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuracoes;
