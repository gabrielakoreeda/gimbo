import Header from "./Header";
import { VscLoading } from "react-icons/vsc";
import { useContext } from "react";
import NotasContext from "@store/notas-context";

const Layout: React.FC = ({ children }) => {
  const notasCtx = useContext(NotasContext);

  return (
    <main className="bg-gray-200 h-screen flex flex-col">
      <Header />
      <div className="flex-grow relative px-10 py-5 overflow-y-auto">
        {notasCtx.isLoading && (
          <div className="h-full bg-gray-700 bg-opacity-60 absolute z-10 inset-0">
            <VscLoading className="h-full animate-spin font-bold text-8xl m-auto" />
          </div>
        )}
        {children}
      </div>
    </main>
  );
};

export default Layout;