import { Layout } from '@/components/Layout';
import { DollarSign, HelpingHand } from 'lucide-react';
import { ContributionsTable } from '@/components/Table/ContributionsTable';
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';

const contributions = [
  {
    id: '15',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '25',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '35',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '45',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '55',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '65',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '75',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '85',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '95',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
  {
    id: '105',
    avatarURL: 'https://github.com/joaod3v.png',
    name: 'João Pedro Silva',
    type: 'Apadrinhamento',
    amount: 100,
    date: new Date(),
  },
];

export default function Contributions() {
  return (
    <>
      <Head>
        <title>Contribuições | Patas Peludas</title>
      </Head>
      <Layout title="Contribuições">
        <div>
          <div className="w-max mx-auto flex flex-col gap-3">
            <div className="w-full flex items-center justify-between">
              <button className="bg-green-700 text-base font-medium leading-6 tracking-tight rounded-lg py-2 px-4 text-white flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-50 relative border-solid border-2 border-leaf">
                  <DollarSign
                    strokeWidth={1}
                    className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                Registrar Doação
              </button>

              <button className="bg-green-500 text-base font-medium leading-6 tracking-tight rounded-lg py-2 px-4 text-white flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-50 relative border-solid border-2 border-leaf">
                  <HelpingHand
                    strokeWidth={1}
                    className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                Registrar Apadrinhamento
              </button>
            </div>
            <div>
              <ContributionsTable contributions={contributions} />
            </div>
          </div>

          {/* <div className="w-full grid grid-cols-2 gap-5 mt-8">
          <TopTable {...contributionOne} />
          <TopTable {...contributionTwo} />
        </div> */}
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  const user = await clerkClient.users.getUser(userId);

  const role = user?.publicMetadata.role;

  const orgId = user?.publicMetadata.orgId;

  if (role !== 'ADMIN' || !orgId) {
    return {
      redirect: {
        destination: '/organizacao/criar-ou-entrar',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
