import { createPortal } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";

const ErrorMessagePopUp: React.FC<{
  errorMessages: string[];
  setErrorMessages: Dispatch<SetStateAction<string[]>>;
}> = ({ errorMessages, setErrorMessages }) => {
  const [mounted, setMounted] = useState(false);
  const [showMessages, setShowMessages] = useState(true);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (errorMessages.length > 0) setShowMessages(true);

    const timer = setTimeout(() => {
      setErrorMessages([]);
      setShowMessages(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessages, setErrorMessages]);

  const closePopUp = () => {
    setShowMessages(false);
  };

  return mounted && showMessages ? (
    <>
      {createPortal(
        <div className="absolute z-30 right-0 bottom-16 bg-white p-2 rounded w-96 shadow-lg">
          <span>
            <FaTimes
              className="cursor-pointer text-lg mb-2"
              onClick={closePopUp}
            />
          </span>
          {errorMessages.map((message, index) => {
            return (
              <p key={index} className="flex items-center">
                <TiWarning className="text-yellow-500 text-xl mr-2" />
                {message}
              </p>
            );
          })}
        </div>,
        document.querySelector("#popup")
      )}
    </>
  ) : null;
};

export default ErrorMessagePopUp;
