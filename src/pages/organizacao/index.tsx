import { Layout } from '@/components/Layout';
import { TeamMembers } from '@/components/TeamMembers';
import Head from 'next/head';
import { OrganizationForm } from '@/components/Form/OrganizationForm';
import { AddressForm } from '@/components/Form/AddressForm';
import { DescriptionForm } from '@/components/Form/DescriptionForm';
import { SocialMediaForm } from '@/components/Form/SocialMediaForm';
import { PixCodeForm } from '@/components/Form/PixCodeForm';
import { members } from '..';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';

export default function Organization() {
  return (
    <>
      <Head>
        <title>Equipe | Patas Peludas</title>
      </Head>
      <Layout title="Organização">
        <div className="w-full">
          <div className="grid grid-cols-2 gap-5 w-full">
            <OrganizationForm />
            <AddressForm />
          </div>

          <div>
            <DescriptionForm />
          </div>

          <div className="grid grid-cols-2 gap-5 w-full">
            <SocialMediaForm />
            <PixCodeForm />
          </div>

          <TeamMembers members={members} />
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
