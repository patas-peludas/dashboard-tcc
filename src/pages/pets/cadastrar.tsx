import { Layout } from '@/components/Layout';
import { api } from '@/services/api';
import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { Address, Org, SocialMedia } from '../organizacao';
import { RegisterPetForm } from '@/components/Form/RegisterPetForm';
import { Locale } from '@/components/Form/Create/IndependentGroup';

type RegisterPetProps = {
  orgName: string;
  locales: Locale[];
};

export default function RegisterPet({ orgName, locales }: RegisterPetProps) {
  return (
    <>
      <Head>
        <title>Cadastrar Pet | Patas Peludas</title>
      </Head>
      <Layout title="Cadastrar Pet" orgName={orgName}>
        <RegisterPetForm locales={locales} />
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
    const { data } = await api.get<{
      org: Org;
      socialMedias: SocialMedia[];
      addresses: Address[];
    }>(`/orgs/${orgId}/complete`, { params: { by: 'ID' } });

    return {
      props: {
        orgName: data.org.name,
        locales: data.addresses.map((address) => {
          return {
            city: address.city,
            uf: address.uf,
          };
        }),
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
