import dynamic from 'next/dynamic';
const ContributionsLineChart = dynamic(
  () =>
    import('@/components/Chart/ContributionsLineChart').then(
      (module) => module.ContributionsLineChart
    ),
  {
    ssr: false,
  }
);

const AdoptionsLineChart = dynamic(
  () =>
    import('@/components/Chart/AdoptionsLineChart').then(
      (module) => module.AdoptionsLineChart
    ),
  {
    ssr: false,
  }
);

import { CardInfo } from '@/components/CardInfo';
import { Layout } from '@/components/Layout';
import { CircleDollarSign, Dog, HelpingHand } from 'lucide-react';

const dataOne = [
  { month: '2023-01-01', donations: 1000, sponsorships: 500 },
  { month: '2023-02-01', donations: 1500, sponsorships: 800 },
  { month: '2023-03-01', donations: 2000, sponsorships: 1200 },
  { month: '2023-04-01', donations: 2000, sponsorships: 1200 },
  { month: '2023-05-01', donations: 2000, sponsorships: 1200 },
  { month: '2023-06-01', donations: 2000, sponsorships: 1200 },
  { month: '2023-07-01', donations: 2000, sponsorships: 1200 },
  { month: '2023-08-01', donations: 2000, sponsorships: 1200 },
  // Adicione mais dados para outros meses e anos, se necessário
];

const dataTwo = [
  { month: '2023-01-01', adoptions: 1 },
  { month: '2023-02-01', adoptions: 15 },
  { month: '2023-03-01', adoptions: 20 },
  { month: '2023-04-01', adoptions: 20 },
  { month: '2023-05-01', adoptions: 20 },
  { month: '2023-06-01', adoptions: 20 },
  { month: '2023-07-01', adoptions: 20 },
  { month: '2023-08-01', adoptions: 20 },
  // Adicione mais dados para outros meses e anos, se necessário
];

export default function Home() {
  return (
    <Layout title="Dashboard">
      <div className="flex items-start gap-5">
        <CardInfo
          Icon={CircleDollarSign}
          amount={350}
          title="Doações"
          currentDate={new Date()}
          growthComparedLastMonth={23}
        />

        <CardInfo
          Icon={HelpingHand}
          amount={350}
          title="Apadrinhamentos"
          currentDate={new Date()}
          growthComparedLastMonth={23}
        />

        <CardInfo
          Icon={Dog}
          quantity={10}
          title="Adoções"
          currentDate={new Date()}
          growthComparedLastMonth={23}
        />
      </div>

      <ContributionsLineChart data={dataOne} />

      <AdoptionsLineChart data={dataTwo} />
    </Layout>
  );
}
