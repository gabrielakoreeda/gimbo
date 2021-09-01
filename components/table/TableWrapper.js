const TableWrapper = (props) => {
  return (
    <div className="rounded border border-b-0 border-gray-400">
      {props.children}
    </div>
  );
};

export default TableWrapper;
