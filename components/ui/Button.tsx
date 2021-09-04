const Button: React.FC<{
  pressed?: boolean;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
}> = (props) => {
  let style = "bg-green-500 shadow-md";
  if (props.pressed) {
    style = "bg-green-600 shadow-sm";
  }

  return (
    <button
      onClick={props.onClick}
      type={props.type || "button"}
      className={`px-4 py-2 rounded font-bold text-white text-sm hover:shadow-sm hover:bg-green-600 transition ${style}`}
    >
      {props.children}
    </button>
  );
};

export default Button;
