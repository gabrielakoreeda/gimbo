const PageTitle: React.FC<{ title: string }> = (props) => {
  return (
    <h1 className="font-bold text-grey-800 text-xl mb-4">{props.title}</h1>
  );
};

export default PageTitle;
