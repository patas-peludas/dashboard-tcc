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
import { TopTable } from '@/components/Table/TopTable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TeamMembers } from '@/components/TeamMembers';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

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

const contributions = [
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
  {
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    amount: 100,
  },
];

export const members = [
  {
    id: '1',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    office: 'Presidente',
  },
  {
    id: '2',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    office: 'Presidente',
  },
  {
    id: '3',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    office: 'Presidente',
  },
];

export const contributionOne = {
  title: `Top Contribuidores - Ano ${new Date().getFullYear()}`,
  link: '/',
  tableItems: ['Nome', 'Total de Contribuições'],
  contributions,
};

export const contributionTwo = {
  title: `Top Contribuidores - ${format(new Date(), 'MMM/yy', {
    locale: ptBR,
  })}`,
  link: '/',
  tableItems: ['Nome', 'Total de Contribuições'],
  contributions,
};

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Patas Peludas</title>
      </Head>
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
        <div className="my-5 flex flex-col gap-5">
          <ContributionsLineChart data={dataOne} />

          <AdoptionsLineChart data={dataTwo} />
        </div>

        <div className="w-full grid grid-cols-2 gap-5">
          <TopTable {...contributionOne} />
          <TopTable {...contributionTwo} />
        </div>

        <div className="w-full my-5">
          <TeamMembers members={members} />
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/organizacao',
      permanent: false,
    },
  };

  // const { userId } = getAuth(ctx.req);

  // if (!userId) {
  //   return {
  //     redirect: {
  //       destination: '/sign-in',
  //       permanent: false,
  //     },
  //   };
  // }

  // const user = await clerkClient.users.getUser(userId);

  // const role = user?.publicMetadata.role;

  // const orgId = user?.publicMetadata.orgId;

  // if (role !== 'ADMIN' || !orgId) {
  //   return {
  //     redirect: {
  //       destination: '/organizacao/criar-ou-entrar',
  //       permanent: false,
  //     },
  //   };
  // }

  // return {
  //   props: {},
  // };
};
