import { Layout } from '@/components/Layout';
import { api } from '@/services/api';
import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import waitImg from '../../assets/wait.svg';

type WaitConfirmationProps = {
  orgName: string;
};

export default function WaitConfirmation({ orgName }: WaitConfirmationProps) {
  return (
    <>
      <Head>
        <title>Aguardando Confirmação | Patas Peludas</title>
      </Head>
      <Layout title="Aguardando Confirmação" isLocked>
        <div className="flex xs:flex-col lg:flex-row items-start mx-auto gap-2 h-max xs:w-full lg:w-[800px]">
          <Image
            src={waitImg}
            alt="Ilustração de uma pessoa esperando com uma ampulheta"
          />

          <div className="flex flex-col gap-5 ">
            <p className="text-lg text-green-800">
              Aguarde enquanto algum administrador da organização{' '}
              <strong className="font-semibold">{orgName}</strong> confirma a
              sua solicitação.
            </p>

            <p className="text-sm font-medium mt-auto text-green-700">
              Para agilizar o processo de confirmação, nós recomendamos que
              entre em contato direto com a organização.
            </p>
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
      const responseTeam = await api.get('/teams/request', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseOrg = await api.get(
        `/orgs/${responseTeam.data.team.org_id}`,
        {
          params: { by: 'ID' },
        }
      );

      return {
        props: {
          orgName: responseOrg.data.org.name,
        },
      };
    } catch {
      return {
        redirect: {
          destination: '/organizacao/criar-ou-entrar',
          permanent: false,
        },
      };
    }
  }
};
