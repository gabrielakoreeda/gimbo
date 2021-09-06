const PageTitle: React.FC<{ title: string }> = (props) => {
  return (
    <h1 className="font-bold text-gray-800 text-xl mb-10">{props.title}</h1>
  );
};

export default PageTitle;
