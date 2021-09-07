const TableWrapper: React.FC = ({ children }) => {
  return (
    <div className="rounded border border-gray-300 overflow-y-auto">
      {children}
    </div>
  );
};

export default TableWrapper;
