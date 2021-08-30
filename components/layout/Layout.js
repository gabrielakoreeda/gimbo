import Header from "./Header";

const Layout = (props) => {
  return (
    <main className="bg-indigo-100 h-screen">
      <Header />
      <div>{props.children}</div>
    </main>
  );
};

export default Layout;
