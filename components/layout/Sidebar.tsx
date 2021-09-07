import { useRouter } from "next/dist/client/router";
import { FaMoneyBillWave } from "react-icons/fa";
import Link from "next/link";

import styles from "./Sidebar.module.css";
import navigation from "config/navigation";

const Sidebar: React.FC = () => {
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="bg-white p-5 w-1/6">
      <div
        className="text-green-500 text-md flex items-center space-x-2 cursor-pointer"
        onClick={goToHome}
      >
        <FaMoneyBillWave className="text-2xl" />
        <p className="font-bold">GIMBO</p>
      </div>
      <p className="font-bold text-xs text-gray-500 mt-6 mb-4">MENU</p>
      <nav className="font-semi-bold text-sm text-gray-400">
        <ul className="space-y-6">
          {navigation.map((item, index) => {
            return (
              <li key={index}>
                <Link href={item.path}>
                  <a
                    className={`flex items-center ${
                      router.pathname === item.path ? styles.selected : ""
                    }`}
                  >
                    <span className="mr-2 bg-gray-300 p-2 rounded-md">
                      {item.icon}
                    </span>
                    <p>{item.label}</p>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
