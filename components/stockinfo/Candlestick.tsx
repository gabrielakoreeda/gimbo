import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Candlestick: React.FC<{ tickerTimeSeries: any[] }> = ({
  tickerTimeSeries,
}) => {
  const options = {
    chart: { height: "100%" },
    title: {
      text: "Cotações diárias dos últimos 100 dias",
    },
    tooltip: {
      enabled: true,
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <Chart
      height="100%"
      series={tickerTimeSeries}
      options={options}
      type="candlestick"
    />
  );
};

export default Candlestick;
