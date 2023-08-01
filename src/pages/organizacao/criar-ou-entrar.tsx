import { Role } from '@/@types/clerk-user';
import { Layout } from '@/components/Layout';
import { api } from '@/services/api';
import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { HeartHandshake, LogIn } from 'lucide-react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';

export type User = {
  id: string;
  avatarUrl: string;
  name: string;
  email: string;
  phone?: string;
  role: Role | null;
  isVerified: boolean;
};

export default function CreateOrEnter() {
  return (
    <>
      <Head>
        <title>Crie ou entre em uma organização | Patas Peludas</title>
      </Head>
      <Layout title="Crie ou entre em uma organização" isLocked>
        <div className="w-max">
          <div className="grid xs:grid-cols-1 lg:grid-cols-2 gap-8">
            <Link
              href="/organizacao/criar"
              className="w-44 h-44 p-3 border-gray-400 text-zinc-600 border hover:bg-green-300 hover:text-zinc-50 hover:border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-lg uppercase tracking-wider font-medium  shadow"
            >
              <HeartHandshake strokeWidth={1} className="w-32 h-32" />
              Criar
            </Link>

            <Link
              href="/organizacao/entrar"
              className="w-44 h-44 p-3 border-gray-400 text-zinc-600 border hover:bg-green-300 hover:text-zinc-50 hover:border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 text-lg uppercase tracking-wider font-medium  shadow"
            >
              <LogIn strokeWidth={1} className="w-32 h-32" />
              Entrar
            </Link>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { getToken, userId } = getAuth(ctx.req);

  const token = await getToken({ template: 'jwt-patas-peludas' });

  if (!token || !userId) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  const user = await clerkClient.users.getUser(userId);

  const orgId = user?.publicMetadata.orgId;

  if (orgId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } else {
    try {
      await api.post<{ user: User }>(
        '/users',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        props: {},
      };
    } catch {
      try {
        await api.get('/teams/request', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return {
          redirect: {
            destination: '/organizacao/aguardando-confirmacao',
            permanent: false,
          },
        };
      } catch (err) {
        console.log(err);

        return {
          props: {},
        };
      }
    }
  }
};
