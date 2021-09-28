import { FaCog, FaCoins } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { RiBankFill } from "react-icons/ri";

const navigation = [
  {
    path: "/",
    icon: <MdDashboard />,
    label: "Dashboard",
  },
  {
    path: "/posicoes",
    icon: <FaCoins />,
    label: "Posições",
  },
  {
    path: "/ir",
    icon: <RiBankFill />,
    label: "IR",
  },
  {
    path: "/notas",
    icon: <IoReceipt />,
    label: "Notas",
  },
  {
    path: "/configuracoes",
    icon: <FaCog />,
    label: "Configurações",
  },
];

export default navigation;
