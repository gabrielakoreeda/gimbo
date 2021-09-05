import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const Overlay: React.FC = ({ children }) => {
  return (
    <div className="bg-black bg-opacity-60 h-screen w-screen absolute inset z-50">
      <div className="bg-white rounded">{children}</div>
    </div>
  );
};

const PopUp: React.FC = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted ? (
    <>
      {ReactDOM.createPortal(
        <Overlay>{children}</Overlay>,
        document.querySelector("#popup")
      )}
    </>
  ) : null;
};

export default PopUp;
