import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

type LineChartProps = {
  data: {
    month: string;
    donations: number;
    sponsorships: number;
  }[];
};

export function ContributionsLineChart({ data }: LineChartProps) {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const filteredData = data.filter(
    (item) => new Date(item.month).getFullYear() === selectedYear
  );

  const months = filteredData.map((item) =>
    format(new Date(item.month), 'MMMM', { locale: ptBR })
  );

  const donationsData = filteredData.map((item) => item.donations);
  const sponsorshipsData = filteredData.map((item) => item.sponsorships);

  const total = data.reduce(
    (acc, item) => acc + item.donations + item.sponsorships,
    0
  );

  const chartOptions: ApexOptions = {
    xaxis: {
      categories: months,
    },
    legend: {
      show: true,
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    colors: ['#243117', '#779F4C'],
  };

  const series = [
    {
      name: 'Doações',
      data: donationsData,
    },
    {
      name: 'Apadrinhamentos',
      data: sponsorshipsData,
    },
  ];

  return (
    <div className="bg-white px-8 py-7 rounded-[20px]">
      <div className="w-[123px] p-2 bg-zinc-100 flex items-center gap-1 text-green-600 focus-within:ring-2 focus-within:ring-leaf rounded">
        <Calendar strokeWidth={1} className="w-6 h-6" />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="bg-zinc-100 outline-0 flex-1"
        >
          <option value={2022}>2022</option>
          <option value={2023}>2023</option>
          {/* Adicione mais opções para outros anos, se necessário */}
        </select>
      </div>

      <div className="mt-7">
        <div>
          <p className="text-green-800 text-3xl font-bold tracking-tight">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(total)}
          </p>

          <span className="text-gray-500 text-sm font-medium leading-6 tracking-tight">
            Total Arrecadado
          </span>
        </div>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="line"
          height={400}
        />
      </div>
    </div>
  );
}
