import { FaCog, FaCoins, FaMoneyBillWaveAlt } from "react-icons/fa";
import { IoReceipt } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

const navigation = [
  {
    path: "/",
    icon: <MdDashboard />,
    label: "Dashboard",
  },
  {
    path: "/ativos",
    icon: <FaMoneyBillWaveAlt />,
    label: "Ativos",
  },
  {
    path: "/posicoes",
    icon: <FaCoins />,
    label: "Posições",
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
