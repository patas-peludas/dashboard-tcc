import { Layout } from '@/components/Layout';
import { Team, TeamMembers } from '@/components/TeamMembers';
import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { parseCookies, setCookie } from 'nookies';
import { api } from '@/services/api';
import { OngForm } from '@/components/Form/Create/OngForm';
import { IndependentGroupForm } from '@/components/Form/Create/IndependentGroup';
import { Role } from '@/@types/clerk-user';

type OrganizationProps = {
  userId: string;
  orgName: string;
  orgType: 'ONG' | 'INDEPENDENT_GROUP';
  members: {
    approveds: Team[];
    pendents: Team[];
  };
  role: Role;
};

export default function Organization({
  userId,
  orgName,
  orgType,
  members,
  role,
}: OrganizationProps) {
  return (
    <>
      <Head>
        <title>Equipe | Patas Peludas</title>
      </Head>
      <Layout title={orgName} orgName={orgName}>
        <div className="flex flex-col gap-5">
          <TeamMembers members={members} userId={userId} role={role} />

          {role === 'ADMIN' && (
            <>
              {orgType === 'ONG' ? (
                <OngForm email={null} type="ONG" />
              ) : (
                <IndependentGroupForm email={null} type="INDEPENDENT_GROUP" />
              )}
            </>
          )}
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

  if (!orgId) {
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

  const { data } = await api.get('/teams/members', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const role = user?.publicMetadata.role;

  return {
    props: {
      userId,
      orgName,
      orgType,
      members: {
        approveds: data.approveds,
        pendents: data.pendents,
      },
      role,
    },
  };
};
