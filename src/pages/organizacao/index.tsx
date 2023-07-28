import { Layout } from '@/components/Layout';
import { TeamMembers } from '@/components/TeamMembers';
import Head from 'next/head';
import { members } from '..';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { parseCookies, setCookie } from 'nookies';
import { api } from '@/services/api';
import { OngForm } from '@/components/Form/Create/OngForm';
import { IndependentGroupForm } from '@/components/Form/Create/IndependentGroup';

type OrganizationProps = {
  orgName: string;
  orgType: 'ONG' | 'INDEPENDENT_GROUP';
};

export default function Organization({ orgName, orgType }: OrganizationProps) {
  return (
    <>
      <Head>
        <title>Equipe | Patas Peludas</title>
      </Head>
      <Layout title="Organização" orgName={orgName}>
        <div className="flex flex-col gap-5">
          <TeamMembers members={members} />

          {orgType === 'ONG' ? (
            <OngForm email={null} type="ONG" />
          ) : (
            <IndependentGroupForm email={null} type="INDEPENDENT_GROUP" />
          )}
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

  const { 'pataspeludas.orgName': cookieOrgName } = parseCookies(ctx);
  const { 'pataspeludas.orgType': cookieOrgType } = parseCookies(ctx);

  let orgName;
  let orgType;

  if (cookieOrgName && cookieOrgType) {
    orgName = cookieOrgName;
    orgType = cookieOrgType;
  } else {
    const { data } = await api.get(`/orgs/${orgId}`, { params: { by: 'ID' } });

    orgName = data.org.name;
    orgType = data.org.type;

    setCookie(ctx, 'pataspeludas.orgName', data.org.name, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });

    setCookie(undefined, 'pataspeludas.orgType', data.org.type, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });
  }

  return {
    props: {
      orgName,
      orgType,
    },
  };
};
