import { Layout } from '@/components/Layout';
import { api } from '@/services/api';
import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Org } from '../organizacao';
import { RegisterPetForm } from '@/components/Form/RegisterPetForm';

type RegisterPetProps = {
  orgName: string;
};

export default function RegisterPet({ orgName }: RegisterPetProps) {
  return (
    <>
      <Head>
        <title>Cadastrar Pet | Patas Peludas</title>
      </Head>
      <Layout title="Cadastrar Pet" orgName={orgName}>
        <RegisterPetForm />
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

  if (!orgId) {
    return {
      redirect: {
        destination: '/organizacao/criar-ou-entrar',
        permanent: false,
      },
    };
  }

  try {
    const responseOrg = await api.get<{
      org: Org;
    }>(`/orgs/${orgId}`, { params: { by: 'ID' } });

    return {
      props: {
        orgName: responseOrg.data.org.name,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }
};
